const nodemailer = require('nodemailer');

// ---------------------------------------------------------------------------
// sendEmail — thin wrapper around Nodemailer used for the forgot-password
// OTP flow (see controllers/authController.js -> forgotPassword).
//
// Reads EMAIL_USER / EMAIL_PASS from .env (Gmail App Password).
// SMTP_HOST defaults to smtp.gmail.com, port 587 with STARTTLS.
// ---------------------------------------------------------------------------
const sendEmail = async ({ to, subject, html }) => {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Glowora" <${user}>`,
    to,
    subject,
    html,
  });
};

// Generates a 6-digit numeric OTP as a string, e.g. "042817".
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

module.exports = { sendEmail, generateOtp };
