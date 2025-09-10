const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "",
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

async function sendContactNotification(contact) {
  if (!process.env.SMTP_HOST) return; // não configurado
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
    subject: `Novo pedido de orçamento - ${contact.name}`,
    text: `Novo contato:\n\nNome: ${contact.name}\nEmpresa: ${contact.company}\nTelefone: ${contact.phone}\nEmail: ${contact.email}\nPessoas: ${contact.people}\nMensagem: ${contact.message}`,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendContactNotification };
