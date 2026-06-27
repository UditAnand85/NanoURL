import { Router } from "express";
import { signup, signin, signout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 * @body    { name: string, email: string, password: string }
 */
router.post("/signup", signup);

/**
 * @route   POST /api/auth/signin
 * @desc    Login with email and password, receive JWT
 * @access  Public
 * @body    { email: string, password: string }
 */
router.post("/signin", signin);

/**
 * @route   POST /api/auth/signout
 * @desc    Signout (client must discard the JWT token)
 * @access  Protected — requires Bearer token
 */
router.post("/signout", verifyToken, signout);

export default router;
