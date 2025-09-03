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
         <p>Thanks for joining in<strong>CaterRides</strong>!</p>
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
           <p>Thanks for Register for event in <strong>CaterRides</strong>!</p>
           <p>For Further info please contact the Organizer via gmail or phone,You can check your status by mail or website dasboard</p>
           <p>Keep in contact with us for further info</p>
           <p>This mail confirm that you successfully registered for an Event in caterRides</p>
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

  // Format date from MongoDB ISO format
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "TBA";

  // Format time if provided
  const formattedTime = time
    ? new Date(time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
    : "TBA";

  // Status (for body, with green/red tick)
  const statusText = status === "accepted" 
    ? `<span style="color:green; font-weight:bold;">&#9989; Accepted</span>`  // ✅
    : `<span style="color:red; font-weight:bold;">&#10060; Rejected</span>`;  // ❌

  // Subject (plain text only, no HTML)
  const subjectStatus = status === "accepted" ? "Accepted" : "Rejected";

  // HTML content
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h3>Hi ${name},</h3>
      <p>Your application for the event <strong>${eventName}</strong> has been <strong>${statusText}</strong>.</p>
      ${
        status === "accepted"
          ? `
            <p><strong>Event Details:</strong></p>
            <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;"> Date</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;"> Time</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${formattedTime}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;"> Location</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${place || "TBA"}</td>
              </tr>
            </table>
          `
          : "<p>Thank you for applying. Keep checking for other upcoming events!</p>"
      }
      <p>Regards,<br/>Team CaterRides</p>
    </div>
  `;

  const mailOptions = {
    from: `"CaterRides" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Your Application for ${eventName} is ${subjectStatus}`,
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

//update notification
// update notification
const updateNotification = async (event) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS
      }
    });

    const confirmed = event.applicants.filter(a => a.status === "accepted");

    for (const applicant of confirmed) {
      const mailOptions = {
        from: `"CaterRides" <${process.env.GMAIL_USER}>`,
        to: applicant.rider.email,   // ✅ use rider instead of user
        subject: `🔔 Update on Event: ${event.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4CAF50;">Event Update Notification</h2>
            <p>Hello <b>${applicant.rider.name || "Participant"}</b>,</p>
            <p>We wanted to let you know that the event you’ve confirmed for has been <b>updated</b>:</p>
            
            <div style="background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 10px 0; border: 1px solid #ddd;">
              <p><b>Event:</b> ${event.title}</p>
            </div>
            
            <p>Please log in to your CaterRides dashboard for more details.</p>
            
            <p style="margin-top:20px;">Best regards,<br/>
            <b>CaterRides Team</b></p>
            
            <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />
            <p style="font-size: 12px; color: #777;">
              This is an automated message. Please do not reply directly to this email.
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    }
  } catch (err) {
    console.error("Update notification error:", err);
  }
};
//notification for deleted event

const sendDeleteEventMail = async (applicants, event) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS
      },
    });

    for (let applicantEmails of applicants) {
      const mailOptions = {
        from: `"CaterRides Team" <${process.env.GMAIL_USER}>`, // ✅ fixed
        to: applicantEmails,
        subject: `Update: "${event.title}" is Cancelled`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height:1.6; padding:20px; color:#333;">
            <h2 style="color:#e63946;">Event Update from CaterRides</h2>
            <p>Dear <b>Rider</b>,</p>
            <p>We regret to inform you that the event <b>"${event.title}"</b>, 
            originally scheduled for <b>${new Date(event.date).toLocaleDateString()}</b> at <b>${event.location}</b>, 
            has been <span style="color:#e63946; font-weight:bold;">cancelled</span> by the organizer.</p>
            
            <p style="margin-top:15px;">We truly appreciate your interest and application. 
            We know this may come as disappointing news, but don’t worry — 
            many exciting events are coming up soon on <b>CaterRides</b>.</p>

            <div style="margin:20px 0; text-align:center;">
              <a href="https://caterrides.com/events" 
                 style="background:#457b9d; color:#fff; padding:12px 20px; border-radius:6px; 
                        text-decoration:none; font-weight:bold;">
                Explore Upcoming Events
              </a>
            </div>

            <p>If you have any questions, feel free to reply to this email. 
            Our team is here to help!</p>

            <p style="margin-top:25px;">Warm regards,<br>
            <b>The CaterRides Team</b></p>

            <hr style="margin-top:30px;">
            <p style="font-size:12px; color:#777;">You’re receiving this email because you applied to an event on CaterRides.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    }
  } catch (error) {
    console.error("Error sending delete event mail:", error);
  }
};

// Transporter setup

 const forgotPasswordOTP= async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,       // your Gmail
    pass: process.env.GMAIL_APP_PASS   // Gmail App Password
  }
   });

    const subject = "CaterRides - Password Reset Verification Code";

    // Plain text fallback
    const text = `Your CaterRides verification code is ${otp}. It will expire in 5 minutes.`;

    // HTML template
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #007BFF;">CaterRides Password Reset</h2>
        <p>Dear User,</p>
        <p>We received a request to reset your password. Please use the verification code below to proceed:</p>
        <div style="margin: 20px 0; text-align: center;">
          <span style="font-size: 28px; font-weight: bold; color: #d9534f; letter-spacing: 4px;">
            ${otp}
          </span>
        </div>
        <p>This code will expire in <strong>5 minutes</strong>. If you did not request this change, you can safely ignore this email.</p>
        <br />
        <p>Best regards,</p>
        <p><strong>CaterRides Support Team</strong></p>
      </div>
    `;

    await transporter.sendMail({
      from: `"CaterRides Support" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });

    console.log("✅ OTP Mail sent to:", to);
  } catch (err) {
    console.error("❌ OTP Mail sending failed:", err);
    throw new Error("OTP mail sending failed");
  }
};





module.exports = {sendWelcomeEmail,confirmationMail,sendOrganizerResponseMail,sendOtpEmail,updateNotification,sendDeleteEventMail,forgotPasswordOTP};
