import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../services/mail.service.js";
import {redis} from "../config/cache.js";

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body {string} username - The username of the user
 * @body {string} email - The email of the user
 * @body {string} password - The password of the user
 */
export async function register(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User already exist",
      success: false,
      err: "User already exist",
    });
  }

  const user = await userModel.create({
    username,
    email,
    password,
  });

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  await sendMail({
    to: email,
    subject: "Welcome to S2Chat - Please verify your email",
    text: `Hello ${username}, welcome to S2Chat! We're excited to have you on board.`,
    html: `<p>Hello <strong>${username}</strong>, welcome to S2Chat! We're excited to have you on board.</p><p>Please verify your email by clicking the link below:</p><a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>`,
  });

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}


/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 * @body {string} email - The email of the user
 * @body {string} password - The password of the user
 */

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid password",
      success: false,
      err: "Invalid password",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "Email not verified",
      success: false,
      err: "Email not verified",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}


/**
 * @route POST /api/auth/get-me
 * @desc Get the current logged in user
 * @access Private
 */
export async function getMe(req, res) {
  const userId = req.user.id;
  const user = await userModel.findById(userId).select("-password");

  if(!user){
    res.status(404).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }

  res.status(200).json({
    message: "User fetched successfully",
    success: true,
    user,
  });
}

/**
 * @route GET /api/auth/verify-email
 * @desc Verify email of the user
 * @access Public
 * @query {string} token - The email verification token
 */
export async function verifyEmail(req, res) {
  const { token } = req.query;
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decode.email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        success: false,
        err: "Invalid token",
      });
    }

    user.verified = true;
    await user.save();

    const html = `<h1>Email verified successfully.</h1>
  <p>You can now login to your account.</p>
  <a href="http://localhost:5173/login">Login</a>`;
    return res.status(200).send(html);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid token",
      success: false,
      err: error.message,
    });
  }
}

export async function logoutUser(req,res){
  const token = req.cookies.token;
  res.clearCookie("token");
  await redis.set(token,Date.now().toString(), "EX", 60*60);
  res.status(200).json({
    message: "User logged out successfully",
    success: true,
  });
}
