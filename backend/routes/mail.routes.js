const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();
const { validateContactEmailPayload } = require("../middleware/validationMiddleware");
const { contactEmailRateLimiter } = require("../middleware/rateLimitMiddleware");
const { sendError } = require("../utils/httpResponses");

router.post('/send-email', contactEmailRateLimiter, validateContactEmailPayload, async (req, res) => {
    const { fullName, email, phone, service, message } = req.body;

    const sourceSite = req.get('origin') || req.get('referer') || 'Origen desconocido';
    const sentAt = new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Mexico_City',
      dateStyle: 'long',
      timeStyle: 'medium',
    }).format(new Date());

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'a.jacobo@duck-hack.com',
      subject: `Contacto de ${fullName}`,
      text: `Nombre: ${fullName}\nCorreo: ${email}\nTeléfono: ${phone}\nServicio: ${service}\nMensaje: ${message}\n\nEnviado desde: ${sourceSite}\nFecha y hora: ${sentAt}`,
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
