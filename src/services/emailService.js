const nodemailer = require('nodemailer');
const { transport, from } = require('../config/emailConfig');

const transporter = nodemailer.createTransport(transport);

const sendPasswordResetEmail = async (to, token) => {
  const resetUrl = `http://localhost:8080/reset-password/${token}`;

  const mailOptions = {
    from,
    to,
    subject: 'Password Reset Request',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. The link will expire in 1 hour.</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };
