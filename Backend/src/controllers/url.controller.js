import { db } from "../db/index.js";
import { urls } from "../db/schema.js";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";

// ─── Validation Schemas ────────────────────────────────────────────────────────
const createUrlSchema = z.object({
  originalUrl: z.string().url("Invalid URL. Please provide a valid URL including http:// or https://"),
  shortcode: z
    .string()
    .min(2, "Shortcode must be at least 2 characters")
    .max(50, "Shortcode must not exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Shortcode can only contain letters, numbers, hyphens, and underscores"
    ),
});

// ─── POST /api/urls ────────────────────────────────────────────────────────────
/**
 * @route   POST /api/urls
 * @desc    Create a new shortened URL
 * @access  Protected (JWT required)
 * @body    { originalUrl, shortcode }
 */
export const createUrl = async (req, res) => {
  try {
    // Validate input
    const parsed = createUrlSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { originalUrl, shortcode } = parsed.data;
    const userId = req.user._id;

    // Check if shortcode is already taken (globally — no 2 users can share a shortcode)
    const existing = await db
      .select({ _id: urls._id })
      .from(urls)
      .where(eq(urls.shortcode, shortcode))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: `ShortKey "${shortcode}" is already taken. Please choose a different one.`,
      });
    }

    // Save to database
    const [newUrl] = await db
      .insert(urls)
      .values({ userId, originalUrl, shortcode })
      .returning();

    const shortUrl = `${process.env.BASE_URL}/${shortcode}`;

    return res.status(201).json({
      success: true,
      message: "Short URL created successfully.",
      data: {
        ...newUrl,
        shortUrl,
      },
    });
  } catch (err) {
    console.error("[createUrl]", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ─── GET /api/urls ─────────────────────────────────────────────────────────────
/**
 * @route   GET /api/urls
 * @desc    Get all URLs created by the authenticated user
 * @access  Protected (JWT required)
 */
export const getUserUrls = async (req, res) => {
  try {
    const userId = req.user._id;

    const userUrls = await db
      .select()
      .from(urls)
      .where(eq(urls.userId, userId))
      .orderBy(sql`${urls.createdAt} DESC`);

    const enriched = userUrls.map((u) => ({
      ...u,
      shortUrl: `${process.env.BASE_URL}/${u.shortcode}`,
    }));

    return res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (err) {
    console.error("[getUserUrls]", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ─── PATCH /api/urls/:shortcode/toggle ────────────────────────────────────────
/**
 * @route   PATCH /api/urls/:shortcode/toggle
 * @desc    Toggle the isActive status of a URL (activate / deactivate)
 * @access  Protected (JWT required)
 */
export const toggleUrl = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const userId = req.user._id;

    // Find the URL and verify ownership
    const [url] = await db
      .select()
      .from(urls)
      .where(and(eq(urls.shortcode, shortcode), eq(urls.userId, userId)))
      .limit(1);

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found or you do not have permission to modify it.",
      });
    }

    // Toggle isActive
    const [updated] = await db
      .update(urls)
      .set({
        isActive: !url.isActive,
        updatedAt: new Date(),
      })
      .where(eq(urls._id, url._id))
      .returning();

    return res.status(200).json({
      success: true,
      message: `URL has been ${updated.isActive ? "activated" : "deactivated"}.`,
      data: {
        ...updated,
        shortUrl: `${process.env.BASE_URL}/${updated.shortcode}`,
      },
    });
  } catch (err) {
    console.error("[toggleUrl]", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ─── DELETE /api/urls/:shortcode ──────────────────────────────────────────────
/**
 * @route   DELETE /api/urls/:shortcode
 * @desc    Permanently delete a URL
 * @access  Protected (JWT required)
 */
export const deleteUrl = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const userId = req.user._id;

    // Find and verify ownership before deleting
    const [url] = await db
      .select({ _id: urls._id })
      .from(urls)
      .where(and(eq(urls.shortcode, shortcode), eq(urls.userId, userId)))
      .limit(1);

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found or you do not have permission to delete it.",
      });
    }

    await db.delete(urls).where(eq(urls._id, url._id));

    return res.status(200).json({
      success: true,
      message: "URL deleted successfully.",
    });
  } catch (err) {
    console.error("[deleteUrl]", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
