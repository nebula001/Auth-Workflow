const { createJWT, isTokenValid, attachCookiesToResponse } = require("./jwt");
const createTokenUser = require("./createTokenUser");
const checkPermissions = require("./checkPermissions");
const nodemailerConfig = require("./nodeMailerConfig");
const sendEmail = require("./sendEmail");
const sendVerificationEmail = require("./sendVerificationEmail");
const sendResetPasswordEmail = require("./sendResetPasswordEmail");

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
  nodemailerConfig,
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
};
