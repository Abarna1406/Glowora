// Quick test — run: node testEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config();

async function test() {
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***SET***' : 'NOT SET');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
  } catch (err) {
    console.error('❌ SMTP Error:', err.message);
  }
}

test();
