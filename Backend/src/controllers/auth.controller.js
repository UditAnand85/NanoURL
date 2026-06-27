import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

// ─── Validation Schemas ────────────────────────────────────────────────────────
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── POST /api/auth/signup ─────────────────────────────────────────────────────
/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 * @body    { name, email, password }
 */
export const signup = async (req, res) => {
  try {
    // Validate request body
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { name, email, password } = parsed.data;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user
    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword })
      .returning({ _id: users._id, name: users.name, email: users.email });

    // Generate JWT
    const token = jwt.sign(
      { _id: newUser._id, email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      user: newUser,
    });
  } catch (err) {
    console.error("[signup]", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ─── POST /api/auth/signin ─────────────────────────────────────────────────────
/**
 * @route   POST /api/auth/signin
 * @desc    Login an existing user and receive a JWT
 * @access  Public
 * @body    { email, password }
 */
export const signin = async (req, res) => {
  try {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { email, password } = parsed.data;

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { _id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Signed in successfully.",
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("[signin]", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ─── POST /api/auth/signout ────────────────────────────────────────────────────
/**
 * @route   POST /api/auth/signout
 * @desc    Signout the current user (client should discard the JWT token)
 * @access  Protected (JWT required)
 */
export const signout = async (req, res) => {
  // JWT is stateless — instruct the client to delete the token.
  // Server-side blacklisting can be added via Redis if needed.
  return res.status(200).json({
    success: true,
    message: "Signed out successfully. Please delete your token on the client.",
  });
};
