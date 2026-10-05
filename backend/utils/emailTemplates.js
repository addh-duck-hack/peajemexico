// Plantilla HTML compartida para los correos salientes (contacto, verificación de cuenta, etc).
// Reutiliza la paleta/tipografía/logo de app-angular para mantener consistencia visual.

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const LOGO_CID = "peajesmx-logo-mark";
const LOGO_SOURCE_PATH = path.join(__dirname, "..", "assets", "email", "logo-mark.png");

// El logo se redimensiona una sola vez y se cachea en memoria: los clientes de correo
// (Outlook, muchas apps de Gmail) no soportan <img> con SVG, así que se embebe como PNG
// adjunto referenciado por cid en el <img> del header. La fuente es una copia del logo
// oficial en app-angular/src/assets/logo/logo-color.png — se copia en vez de referenciarse
// porque backend y frontend corren en contenedores separados sin filesystem compartido;
// si el logo se actualiza ahí, hay que volver a copiarlo aquí.
let logoAttachmentPromise = null;
function getLogoAttachment() {
  if (!logoAttachmentPromise) {
    logoAttachmentPromise = sharp(fs.readFileSync(LOGO_SOURCE_PATH))
      .resize(144, 144, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
      .then((buffer) => ({
        filename: "logo-mark.png",
        content: buffer,
        cid: LOGO_CID,
        contentDisposition: "inline",
      }));
  }
  return logoAttachmentPromise;
}

const BRAND = {
  companyName: process.env.COMPANY_NAME || "PeajesMX",
  siteUrl: process.env.FRONTEND_URL || "https://peajesmx.com",
  colors: {
    bg: "#FAF9F5",
    surface: "#FFFFFF",
    surfaceAlt: "#F2EFE8",
    border: "#E6E1D6",
    ink: "#1B1B18",
    inkSoft: "#6B6459",
    inkInvert: "#FAF9F5",
    accent: "#E4572E",
    accentHover: "#C8481F",
    accentSoft: "#FBE4D8",
    positive: "#2F7A4F",
  },
  // Mismas familias que app-angular/src/styles.css. Se cargan vía Google Fonts en el
  // <head> (funciona en Apple Mail, Outlook.com, Yahoo, la mayoría de apps móviles);
  // los fallbacks cubren clientes que ignoran fuentes externas (Gmail web, Outlook desktop).
  fontDisplay: "'Roboto Slab', Georgia, 'Times New Roman', serif",
  fontBody: "'Roboto Condensed', Arial, Helvetica, sans-serif",
  googleFontsUrl:
    "https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700;800&family=Roboto+Condensed:wght@400;700&display=swap",
};

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderButton({ url, label }) {
  const { colors, fontBody } = BRAND;
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="border-radius:8px; background-color:${colors.accent};">
          <a href="${url}" target="_blank"
             style="display:inline-block; padding:12px 24px; font-family:${fontBody}; font-size:15px; font-weight:700; color:${colors.inkInvert}; text-decoration:none; border-radius:8px;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

// Layout base tipo "tarjeta" (header con logo, cuerpo, footer con datos de contacto),
// hecho con tablas + estilos inline por compatibilidad con Gmail/Outlook.
function renderLayout({ preheader = "", heading, bodyHtml, footerNote = "" }) {
  const { colors, fontDisplay, fontBody, googleFontsUrl, companyName, siteUrl } = BRAND;
  const siteHost = siteUrl.replace(/^https?:\/\//, "");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>${escapeHtml(companyName)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${googleFontsUrl}" rel="stylesheet" />
<style>
  @import url('${googleFontsUrl}');
</style>
<!--[if mso]>
<style>table { border-collapse: collapse; }</style>
<![endif]-->
</head>
<body style="margin:0; padding:0; background-color:${colors.bg}; font-family:${fontBody}; color:${colors.ink};">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${colors.bg};">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:100%; background-color:${colors.surface}; border:1px solid ${colors.border}; border-radius:12px; overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:20px 32px; border-bottom:1px solid ${colors.border};">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle; padding-right:10px;">
                    <img src="cid:${LOGO_CID}" width="36" height="36" alt="" style="display:block; width:36px; height:36px; border:0; outline:none;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-family:${fontDisplay}; font-weight:700; font-size:18px; color:${colors.ink};">${escapeHtml(companyName)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${heading ? `<h1 style="margin:0 0 16px; font-family:${fontDisplay}; font-size:22px; line-height:1.3; color:${colors.ink};">${escapeHtml(heading)}</h1>` : ""}
              <div style="font-family:${fontBody}; font-size:15px; line-height:1.6; color:${colors.ink};">
                ${bodyHtml}
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px; background-color:${colors.surfaceAlt}; border-top:1px solid ${colors.border};">
              <p style="margin:0 0 8px; font-family:${fontBody}; font-size:12px; color:${colors.inkSoft};">
                ${footerNote ? `${escapeHtml(footerNote)}<br/>` : ""}
                <a href="${siteUrl}" style="color:${colors.accent}; text-decoration:none;">${siteHost}</a>
              </p>
              <p style="margin:0; font-family:${fontBody}; font-size:11px; color:${colors.inkSoft};">
                &copy; ${new Date().getFullYear()} ${escapeHtml(companyName)}. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildContactNotificationEmail({ fullName, email, phone, service, message, sourceSite, sentAt }) {
  const { colors } = BRAND;
  const fields = [
    ["Nombre", fullName],
    ["Correo", email],
    ["Teléfono", phone],
    ["Servicio", service],
  ];

  const fieldsHtml = fields
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:6px 12px 6px 0; font-weight:700; width:110px; vertical-align:top; color:${colors.ink};">${escapeHtml(label)}</td>
          <td style="padding:6px 0; vertical-align:top; color:${colors.ink};">${escapeHtml(value || "—")}</td>
        </tr>`
    )
    .join("");

  const bodyHtml = `
    <p style="margin:0 0 16px;">Se ha recibido un nuevo mensaje desde el formulario de contacto del sitio.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;">
      ${fieldsHtml}
    </table>
    <div style="padding:16px; background-color:${colors.accentSoft}; border-radius:8px; margin-bottom:20px;">
      <p style="margin:0; white-space:pre-wrap;">${escapeHtml(message)}</p>
    </div>
    <p style="margin:0; font-size:13px; color:${colors.inkSoft};">
      Enviado desde: ${escapeHtml(sourceSite)}<br/>
      Fecha y hora: ${escapeHtml(sentAt)}
    </p>`;

  const html = renderLayout({
    preheader: `Nuevo contacto de ${fullName}`,
    heading: "Nuevo mensaje de contacto",
    bodyHtml,
    footerNote: "Este correo fue generado automáticamente por el formulario de contacto.",
  });

  const text = [
    "Nuevo mensaje de contacto",
    "",
    `Nombre: ${fullName}`,
    `Correo: ${email}`,
    `Teléfono: ${phone}`,
    `Servicio: ${service}`,
    `Mensaje: ${message}`,
    "",
    `Enviado desde: ${sourceSite}`,
    `Fecha y hora: ${sentAt}`,
  ].join("\n");

  return { subject: `Contacto de ${fullName}`, html, text };
}

function buildVerifyAccountEmail({ name, verifyUrl }) {
  const { colors, companyName } = BRAND;
  const greeting = name ? `Hola ${escapeHtml(name)},` : "Hola,";

  const bodyHtml = `
    <p style="margin:0 0 16px;">${greeting}</p>
    <p style="margin:0 0 16px;">Gracias por registrarte en ${escapeHtml(companyName)}. Para activar tu cuenta y empezar a calcular el costo de tus casetas, confirma tu correo electrónico.</p>
    ${renderButton({ url: verifyUrl, label: "Verificar mi correo" })}
    <p style="margin:16px 0 0; font-size:13px; color:${colors.inkSoft};">
      Si el botón no funciona, copia y pega este enlace en tu navegador:<br/>
      <a href="${verifyUrl}" style="color:${colors.accent}; word-break:break-all;">${verifyUrl}</a>
    </p>
    <p style="margin:16px 0 0; font-size:13px; color:${colors.inkSoft};">Si tú no solicitaste este correo, puedes ignorarlo.</p>`;

  const html = renderLayout({
    preheader: "Confirma tu correo para activar tu cuenta",
    heading: "Verifica tu cuenta",
    bodyHtml,
    footerNote: "Recibiste este correo porque te registraste en nuestro sitio.",
  });

  const text = [
    name ? `Hola ${name},` : "Hola,",
    "",
    `Gracias por registrarte en ${companyName}. Para activar tu cuenta, visita el siguiente enlace:`,
    verifyUrl,
    "",
    "Si tú no solicitaste este correo, ignóralo.",
  ].join("\n");

  return { subject: `Verifica tu cuenta - ${companyName}`, html, text };
}

function buildResetPasswordEmail({ name, resetUrl }) {
  const { colors, companyName } = BRAND;
  const greeting = name ? `Hola ${escapeHtml(name)},` : "Hola,";

  const bodyHtml = `
    <p style="margin:0 0 16px;">${greeting}</p>
    <p style="margin:0 0 16px;">Recibimos una solicitud para cambiar la contraseña de tu cuenta en ${escapeHtml(companyName)}. Haz clic en el siguiente botón para crear una nueva contraseña.</p>
    ${renderButton({ url: resetUrl, label: "Cambiar mi contraseña" })}
    <p style="margin:16px 0 0; font-size:13px; color:${colors.inkSoft};">
      Si el botón no funciona, copia y pega este enlace en tu navegador:<br/>
      <a href="${resetUrl}" style="color:${colors.accent}; word-break:break-all;">${resetUrl}</a>
    </p>
    <p style="margin:16px 0 0; font-size:13px; color:${colors.inkSoft};">Si tú no solicitaste este correo, puedes ignorarlo; tu contraseña actual seguirá funcionando.</p>`;

  const html = renderLayout({
    preheader: "Cambia tu contraseña",
    heading: "Recupera tu contraseña",
    bodyHtml,
    footerNote: "Recibiste este correo porque se solicitó restablecer tu contraseña.",
  });

  const text = [
    name ? `Hola ${name},` : "Hola,",
    "",
    `Recibimos una solicitud para cambiar la contraseña de tu cuenta en ${companyName}. Visita el siguiente enlace para crear una nueva contraseña:`,
    resetUrl,
    "",
    "Si tú no solicitaste este correo, ignóralo; tu contraseña actual seguirá funcionando.",
  ].join("\n");

  return { subject: `Recupera tu contraseña - ${companyName}`, html, text };
}

module.exports = {
  BRAND,
  LOGO_CID,
  getLogoAttachment,
  renderLayout,
  renderButton,
  buildContactNotificationEmail,
  buildVerifyAccountEmail,
  buildResetPasswordEmail,
};
