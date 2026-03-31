import jwt from "jsonwebtoken";
import { redis } from "../config/cache.js";

export async function authUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "Unauthorized",
    });
  }

  const isTokenBlacklisted = await redis.get(token);

  if(isTokenBlacklisted){
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "Unauthorized",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "Unauthorized",
    });
  }
}
