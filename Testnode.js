require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: { user: "apikey", pass: process.env.SENDGRID_API_KEY }
});

async function sendTestMail() {
  try {
    await transporter.sendMail({
      from: `"CaterRides Support" <${process.env.VERIFIED_EMAIL}>`,
      to: "kumarkavitha355@gmail.com",
      subject: "Test SendGrid Email",
      text: "Hello! This is a test email from SendGrid."
    });
    console.log("✅ Email sent successfully!");
  } catch (err) {
    console.error("❌ Send failed:", err);
  }
}

sendTestMail();
