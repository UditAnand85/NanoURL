import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import urlRoutes from "./routes/url.routes.js";
import redirectRoutes from "./routes/redirect.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ─── CORS ──────────────────────────────────────────────────────────────────────
// Allow requests from both the local dev server and the deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,         // Netlify URL from environment variable
].filter(Boolean);                  // remove undefined/empty entries

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: Origin '${origin}' not allowed.`));
  },
  credentials: true,
}));

// ─── Global Middleware ─────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan logging: 'dev' for colorized output during development
app.use(morgan("dev"));

// ─── Health Check ──────────────────────────────────────────────────────────────
/**
 * @route   GET /health
 * @desc    Health check endpoint — useful for uptime monitoring and testing
 * @access  Public
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is up and running 🚀",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/urls", urlRoutes);

// ─── Public Redirect Route (must come AFTER /api routes) ──────────────────────
// This catches /:shortcode — any shortcode not matching the above API routes
app.use("/", redirectRoutes);

// ─── 404 Fallback ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("[Global Error]", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  TinyURL Backend running on http://localhost:${PORT}`);
  console.log(`📊  Health check: http://localhost:${PORT}/health`);
  console.log(`📝  Environment: ${process.env.NODE_ENV || "development"}\n`);
});
