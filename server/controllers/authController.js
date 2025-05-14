const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

const {
  createTokenUser,
  attachCookiesToResponse,
  sendVerificationEmail,
} = require("../utils");

const CustomError = require("../errors");
const User = require("../models/User");

const register = async (req, res) => {
  const { email, name, password } = req.body || {};
  const isFirstAccount = (await User.countDocuments()) === 0;
  const role = isFirstAccount ? "admin" : "user";
  const verificationToken = crypto.randomBytes(40).toString("hex");
  const newUser = await User.create({
    email,
    name,
    password,
    role,
    verificationToken,
  });
  const origin = "http://localhost:3000";

  await sendVerificationEmail({
    name: newUser.name,
    email: newUser.email,
    verificationToken: newUser.verificationToken,
    origin,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "User created successfully! Check email",
    verificationToken: newUser.verificationToken,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body || {};
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.Unauthenticated("Verification failed");
  }
  if (verificationToken !== user.verificationToken) {
    throw new CustomError.Unauthenticated("Verification failed");
  }
  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "email verified" });
};

const login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    throw new CustomError.BadRequest(
      "Please provide both email id and password"
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFound(`No user with email Id ${email} found`);
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.Unauthenticated("Invalid Credentials");
  }
  if (!user.verified) {
    throw new CustomError.Unauthenticated("Please verify your email");
  }
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse(res, tokenUser);
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    signed: true,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
  res.status(StatusCodes.OK).json({ msg: "User logged out" });
};

module.exports = { register, verifyEmail, login, logout };
