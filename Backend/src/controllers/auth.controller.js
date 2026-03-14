import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../services/mail.service.js";

export async function register(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExist) {
    return res
      .status(400)
      .json({
        message: "User already exist",
        success: false,
        err: "User already exist",
      });
  }

  const user = await userModel.create({
    username,email,password
  })

  await sendMail({
    to: email,
    subject: "Welcome to Perplexity",
    text: `Hello ${username}, welcome to Perplexity! We're excited to have you on board.`,
    html: `<p>Hello <strong>${username}</strong>, welcome to Perplexity! We're excited to have you on board.</p>`,
  });

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user:{
      id: user._id,
      username: user.username,
      email: user.email,
    }
  })
}
