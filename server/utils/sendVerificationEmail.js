const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following link.
  <a href="${verifyEmail}">Click Here!</a>
  </p>`;

  return sendEmail({
    to: email,
    subject: "Verification mail",
    html: `<h4>Hello ${name}</h4>
    ${message}`,
  });
};

module.exports = sendVerificationEmail;
