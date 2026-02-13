const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Helper: simple validation
const validateContact = (body) => {
  const { name, email, message } = body || {};
  if (!name || !email || !message) return false;
  const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return re.test(email);
};

const loadTemplate = (name) => {
  try {
    const p = path.join(process.cwd(), 'emails', name);
    return fs.readFileSync(p, 'utf8');
  } catch (e) {
    console.warn('Template load failed', name, e && e.message);
    return null;
  }
};

const adminTemplate = loadTemplate('admin_template.html');
const userTemplate = loadTemplate('user_template.html');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = req.body;
    if (!validateContact(body)) {
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    const { name, email, phone = 'N/A', message, service = '' } = body;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

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

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error in /api/contact', err && err.message);
    res.status(500).json({ error: 'Failed to send email' });
  }
};
