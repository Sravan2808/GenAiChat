import {Router} from 'express';
import { registerValidator } from '../validators/auth.validator.js';
import { register } from '../controllers/auth.controller.js';

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

export default authRouter;