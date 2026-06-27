import { Router } from "express";
import { redirect } from "../controllers/redirect.controller.js";

const router = Router();

/**
 * @route   GET /:shortcode
 * @desc    Public redirect — no auth required.
 *          - 404 if shortcode not found
 *          - 400 if link is disabled (isActive = false)
 *          - 302 redirect to originalUrl if active
 * @access  Public
 */
router.get("/:shortcode", redirect);

export default router;
