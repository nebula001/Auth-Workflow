const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodeMailerConfig");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  const info = await transporter.sendMail({
    from: '"Admin" <admin@gmail.com>',
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
