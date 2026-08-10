const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();
const { validateContactEmailPayload } = require("../middleware/validationMiddleware");
const { contactEmailRateLimiter } = require("../middleware/rateLimitMiddleware");
const { sendError } = require("../utils/httpResponses");
const { buildContactNotificationEmail, getLogoAttachment } = require("../utils/emailTemplates");

router.post('/send-email', contactEmailRateLimiter, validateContactEmailPayload, async (req, res) => {
    const { fullName, email, phone, service, message } = req.body;

    const sourceSite = req.get('origin') || req.get('referer') || 'Origen desconocido';
    const sentAt = new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Mexico_City',
      dateStyle: 'long',
      timeStyle: 'medium',
    }).format(new Date());

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_CONTACT_HOST,
      port: parseInt(process.env.EMAIL_CONTACT_PORT, 10),
      secure: false,
      auth: {
        user: process.env.EMAIL_CONTACT_USER,
        pass: process.env.EMAIL_CONTACT_PASS,
      },
    });

    const { subject, html, text } = buildContactNotificationEmail({
      fullName,
      email,
      phone,
      service,
      message,
      sourceSite,
      sentAt,
    });

    const mailOptions = {
      from: process.env.EMAIL_CONTACT_USER,
      to: 'a.jacobo@duck-hack.com',
      replyTo: email,
      subject,
      text,
      html,
      attachments: [await getLogoAttachment()],
    };
  
    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "Email enviado" });
    } catch (error) {
      console.error("Error enviando email", error);
      return sendError(res, 500, "EMAIL_SEND_FAILED", "Error enviando email");
    }
  });

  module.exports = router;
