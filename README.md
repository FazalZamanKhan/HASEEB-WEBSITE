# HASEEB-WEBSITE — Email Backend

This project is a static website. Added a lightweight Node/Express backend to send contact form emails via Gmail SMTP.

Setup

1. Install dependencies:

```bash
cd HASEEB-WEBSITE
npm install
```

2. Copy `.env.example` to `.env` and fill values (use Gmail App Password or OAuth credentials):

```bash
cp .env.example .env
# edit .env
```

3. Run server:

```bash
npm start
```

4. The frontend expects the backend at `http://localhost:3000`. The site can be served on port 8000 with the existing task.

Security notes

- Use a Gmail App Password (recommended) instead of your account password.
- Keep `.env` out of source control.
- For production, consider using OAuth2 and a secrets manager.

Testing

- Submit the contact form on the site; admin will receive an email and the user will receive a confirmation.

