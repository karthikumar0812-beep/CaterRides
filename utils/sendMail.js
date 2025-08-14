const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (toEmail, name) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,  // your Gmail address
      pass: process.env.GMAIL_APP_PASS  // Gmail App Password
    }
  });
const mailOptions = {
  from: `"CaterRides" <noreply@caterrides.com>`,
  to: toEmail,
  subject: "🎉 Welcome to CaterRides!",
  html: `<h3>Hi ${name},</h3>
         <p>Thanks for joining <strong>CaterRides</strong>!</p>
         <p>You can now apply for events and earn as a rider.</p>
         <p>Regards,<br/>Team CaterRides</p>`
};


  await transporter.sendMail(mailOptions);
};

const confirmationMail=async (toEmail, name) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,  // your Gmail address
      pass: process.env.GMAIL_APP_PASS  // Gmail App Password
    }
  });

  const mailOptions = {
    from: `"CaterRides" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "🎉 Registered successfully for an Event!",
    html: `<h3>Hi ${name},</h3>
           <p>Thanks for Register for event in CaterRides<strong>CaterRides</strong>!</p>
           <p>For Further info please contact the Organizer via gmail or phone,You can check your status by mail or website dasboard</p>
           <p>Keep in contact with us for further info</p>
           <p>Have a happy ride :)</p>
            <p>Regards,<br/>Team CaterRides</p>`
  };

  await transporter.sendMail(mailOptions);
};

const sendOrganizerResponseMail = async (toEmail, name, eventName, status, date, time, place) => {
  const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS
  }
});
  const statusText = status === "accepted" ? "✅ Accepted" : "❌ Rejected";

  const htmlContent = `
    <h3>Hi ${name},</h3>
    <p>Your application for the event <strong>${eventName}</strong> has been <strong>${statusText}</strong>.</p>
    ${
      status === "accepted"
        ? `<p><strong>Event Details:</strong><br/>
           📅 Date: ${date}<br/>
           🕒 Time: ${time}<br/>
           📍 Location: ${place}</p>`
        : "<p>Thank you for applying. Keep checking for other upcoming events!</p>"
    }
    <p>Regards,<br/>Team CaterRides</p>
  `;

  const mailOptions = {
    from: `"CaterRides" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Your Application for ${eventName} is ${statusText}`,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
};

//Used for sending otp for Rider
const sendOtpEmail = async (toEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,        // your Gmail address
      pass: process.env.GMAIL_APP_PASS     // Gmail App Password
    }
  });

  const mailOptions = {
    from: `"CaterRides" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "🔑 Your OTP for CaterRides Signup",
    html: `
      <h3>Hi there,</h3>
      <p>Your OTP for <strong>CaterRides</strong> signup is:</p>
      <h2 style="color: #2e86de;">${otp}</h2>
      <p>This OTP will expire in 5 minutes.</p>
      <p>Regards,<br/>Team CaterRides</p>
    `
  };

  await transporter.sendMail(mailOptions);
};


module.exports = {sendWelcomeEmail,confirmationMail,sendOrganizerResponseMail,sendOtpEmail};
