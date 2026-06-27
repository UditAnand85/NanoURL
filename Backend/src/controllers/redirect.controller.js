import { db } from "../db/index.js";
import { urls } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";

// ─── GET /:shortcode ───────────────────────────────────────────────────────────
/**
 * @route   GET /:shortcode
 * @desc    Public redirect — no authentication required.
 *          Looks up the shortcode, checks isActive, increments click count,
 *          and redirects the visitor to the original URL.
 * @access  Public
 */
export const redirect = async (req, res) => {
  try {
    const { shortcode } = req.params;

    // Find URL by shortcode
    const [url] = await db
      .select()
      .from(urls)
      .where(eq(urls.shortcode, shortcode))
      .limit(1);

    if (!url) {
      return res.status(404).json({
        success: false,
        message: `Short URL "/${shortcode}" not found.`,
      });
    }

    // Check if the link is active — redirect to a friendly frontend page
    if (!url.isActive) {
      return res.redirect(302, `${process.env.FRONTEND_URL}/deactivated?code=${shortcode}`);
    }

    // Increment click count (fire-and-forget — don't await to keep redirect fast)
    db.update(urls)
      .set({ clicks: sql`${urls.clicks} + 1` })
      .where(eq(urls._id, url._id))
      .catch((err) => console.error("[redirect] click increment failed:", err));

    // 302 redirect to the original URL
    return res.redirect(302, url.originalUrl);
  } catch (err) {
    console.error("[redirect]", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
