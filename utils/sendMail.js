const { Resend } = require("resend");
const dotenv = require("dotenv");

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Generic helper
const sendEmail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: "CaterRides <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to: ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};

// -----------------------------
// 📨 Welcome Email
// -----------------------------
const sendWelcomeEmail = async (toEmail, name) => {
  const html = `
    <h3>Hi ${name},</h3>
    <p>Thanks for joining <strong>CaterRides</strong>!</p>
    <p>You can now apply for events and earn as a rider.</p>
    <p>Regards,<br/>Team CaterRides</p>
  `;
  await sendEmail(toEmail, "🎉 Welcome to CaterRides!", html);
};

// -----------------------------
// 📨 Confirmation Mail
// -----------------------------
const confirmationMail = async (toEmail, name) => {
  const html = `
    <h3>Hi ${name},</h3>
    <p>Thanks for registering for an event in <strong>CaterRides</strong>!</p>
    <p>You can contact the organizer for more info or check your status in the dashboard.</p>
    <p>This mail confirms your successful registration.</p>
    <p>Regards,<br/>Team CaterRides</p>
  `;
  await sendEmail(toEmail, "🎉 Registered successfully for an Event!", html);
};

// -----------------------------
// 📨 Organizer Response
// -----------------------------
const sendOrganizerResponseMail = async (toEmail, name, eventName, status, date, time, place) => {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
    : "TBA";

  const formattedTime = time
    ? new Date(time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    : "TBA";

  const statusText =
    status === "accepted"
      ? `<span style="color:green; font-weight:bold;">&#9989; Accepted</span>`
      : `<span style="color:red; font-weight:bold;">&#10060; Rejected</span>`;

  const subjectStatus = status === "accepted" ? "Accepted" : "Rejected";

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h3>Hi ${name},</h3>
      <p>Your application for the event <strong>${eventName}</strong> has been ${statusText}.</p>
      ${
        status === "accepted"
          ? `
            <p><strong>Event Details:</strong></p>
            <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
              <tr><td><b>Date</b></td><td>${formattedDate}</td></tr>
              <tr><td><b>Time</b></td><td>${formattedTime}</td></tr>
              <tr><td><b>Location</b></td><td>${place || "TBA"}</td></tr>
            </table>
          `
          : "<p>Thank you for applying. Keep checking for other events!</p>"
      }
      <p>Regards,<br/>Team CaterRides</p>
    </div>
  `;

  await sendEmail(toEmail, `Your Application for ${eventName} is ${subjectStatus}`, html);
};

// -----------------------------
// 📨 Rider OTP Email
// -----------------------------
const sendOtpEmail = async (toEmail, otp) => {
  const html = `
    <h3>Hi there,</h3>
    <p>Your OTP for <strong>CaterRides</strong> signup is:</p>
    <h2 style="color: #2e86de;">${otp}</h2>
    <p>This OTP will expire in 5 minutes.</p>
    <p>Regards,<br/>Team CaterRides</p>
  `;
  await sendEmail(toEmail, "🔑 Your OTP for CaterRides Signup", html);
};

// -----------------------------
// 📨 Update Notification
// -----------------------------
const updateNotification = async (event) => {
  const confirmed = event.applicants.filter(a => a.status === "accepted");

  for (const applicant of confirmed) {
    const html = `
      <div style="font-family: Arial; color: #333;">
        <h2 style="color: #4CAF50;">Event Update Notification</h2>
        <p>Hello <b>${applicant.rider.name || "Participant"}</b>,</p>
        <p>Your confirmed event <b>${event.title}</b> has been updated.</p>
        <p>Please log in to your dashboard for more details.</p>
        <p>Best regards,<br/>Team CaterRides</p>
      </div>
    `;
    await sendEmail(applicant.rider.email, `🔔 Update on Event: ${event.title}`, html);
  }
};

// -----------------------------
// 📨 Event Deleted Notification
// -----------------------------
const sendDeleteEventMail = async (applicants, event) => {
  for (let email of applicants) {
    const html = `
      <div style="font-family: Arial; color:#333;">
        <h2 style="color:#e63946;">Event Cancelled</h2>
        <p>Dear Rider,</p>
        <p>The event <b>${event.title}</b> scheduled for <b>${new Date(event.date).toLocaleDateString()}</b> at <b>${event.location}</b> has been cancelled.</p>
        <p>We appreciate your interest. Check out more events on CaterRides!</p>
        <p>Regards,<br/>Team CaterRides</p>
      </div>
    `;
    await sendEmail(email, `Update: "${event.title}" is Cancelled`, html);
  }
};

// -----------------------------
// 📨 Forgot Password OTP
// -----------------------------
const forgotPasswordOTP = async (to, otp) => {
  const html = `
    <div style="font-family: Arial; color: #333;">
      <h2 style="color: #007BFF;">CaterRides Password Reset</h2>
      <p>Dear User,</p>
      <p>Your verification code is:</p>
      <h2 style="color: #d9534f; letter-spacing: 4px;">${otp}</h2>
      <p>This code expires in <b>5 minutes</b>.</p>
      <p>If you didn’t request this, ignore this email.</p>
      <p>Regards,<br/>CaterRides Support Team</p>
    </div>
  `;
  await sendEmail(to, "CaterRides - Password Reset Verification Code", html);
};

module.exports = {sendWelcomeEmail,confirmationMail,sendOrganizerResponseMail,sendOtpEmail,updateNotification,sendDeleteEventMail,forgotPasswordOTP};