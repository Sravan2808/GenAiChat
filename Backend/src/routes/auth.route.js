import {Router} from 'express';
import { loginValidator, registerValidator } from '../validators/auth.validator.js';
import { register, verifyEmail,login, getMe } from '../controllers/auth.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body {string} username - The username of the user
 * @body {string} email - The email of the user
 * @body {string} password - The password of the user
 * 
 */

authRouter.post("/register",registerValidator,register)

/**
 * 
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */

authRouter.post("/login",loginValidator,login)


/**
 * @route POST /api/auth/get-me
 * @desc Get the current logged in user
 * @access Private
 */

authRouter.get("/get-me",authUser,getMe)

/**
 * @route GET /api/auth/verify-email
 * @desc Verify email of the user
 * @access Public
 * @query {string} token - The email verification token
 */
authRouter.get("/verify-email",verifyEmail)

export default authRouter;