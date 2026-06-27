import { Router } from "express";
import {
  createUrl,
  getUserUrls,
  toggleUrl,
  deleteUrl,
} from "../controllers/url.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

// All URL management routes require authentication
router.use(verifyToken);

/**
 * @route   POST /api/urls
 * @desc    Create a new short URL
 * @access  Protected
 * @body    { originalUrl: string, shortcode: string }
 * @returns { success, message, data: { shortUrl, shortcode, originalUrl, isActive, clicks, ... } }
 */
router.post("/", createUrl);

/**
 * @route   GET /api/urls
 * @desc    Get all URLs belonging to the authenticated user
 * @access  Protected
 * @returns { success, count, data: [...urls with shortUrl] }
 */
router.get("/", getUserUrls);

/**
 * @route   PATCH /api/urls/:shortcode/toggle
 * @desc    Toggle isActive on/off for a URL (activate or deactivate)
 * @access  Protected — user must own the URL
 * @param   shortcode — the shortcode of the URL to toggle
 */
router.patch("/:shortcode/toggle", toggleUrl);

/**
 * @route   DELETE /api/urls/:shortcode
 * @desc    Permanently delete a URL
 * @access  Protected — user must own the URL
 * @param   shortcode — the shortcode of the URL to delete
 */
router.delete("/:shortcode", deleteUrl);

export default router;
