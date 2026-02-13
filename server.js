const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigin = process.env.FRONTEND_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // limit to 5 requests per minute
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Use shared validation helper
const { validateContact } = require('./lib/validate');

// Load email templates
const loadTemplate = (name) => {
  try {
    return fs.readFileSync(path.join(__dirname, 'emails', name), 'utf8');
  } catch (e) {
    console.warn('Template load failed', name, e && e.message);
    return null;
  }
};

const adminTemplate = loadTemplate('admin_template.html');
const userTemplate = loadTemplate('user_template.html');

// POST /api/contact - send email to admin and confirmation to user
app.post('/api/contact', async (req, res) => {
  try {
    if (!validateContact(req.body)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const { name, email, phone = 'N/A', message, service = '' } = req.body;

    // create transport
    // Use OAuth2 or App Password. For small projects, an App Password is simplest.
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Prepare HTML versions by replacing placeholders in templates when available
    const timestamp = new Date().toLocaleString();
    const replace = (tpl) => {
      if (!tpl) return null;
      return tpl
        .replace(/\{\{name\}\}/g, name)
        .replace(/\{\{email\}\}/g, email)
        .replace(/\{\{phone\}\}/g, phone)
        .replace(/\{\{message\}\}/g, message)
        .replace(/\{\{service\}\}/g, service || 'General')
        .replace(/\{\{timestamp\}\}/g, timestamp)
        .replace(/\{\{admin_email\}\}/g, process.env.ADMIN_EMAIL || '');
    };

    const adminHtml = replace(adminTemplate);
    const userHtml = replace(userTemplate);

    const adminMailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: process.env.ADMIN_EMAIL,
      subject: `Website Contact: ${name} <${email}>`,
      text: `You have a new message from the website. Name: ${name} | Email: ${email} | Phone: ${phone} | Service: ${service} | Message: ${message}`,
      html: adminHtml || undefined
    };

    const userMailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: email,
      subject: 'Thank you for contacting HASEEB CABLES',
      text: `Hi ${name}, Thank you for reaching out to HASEEB CABLES. We have received your message and will respond within 1-2 business days. Summary: ${message}`,
      html: userHtml || undefined
    };

    // send admin email
    await transporter.sendMail(adminMailOptions);
    // send confirmation to user
    await transporter.sendMail(userMailOptions);

    return res.json({ success: true });
  } catch (err) {
    console.error('Error sending email', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Email backend listening on port ${PORT}`);
});
