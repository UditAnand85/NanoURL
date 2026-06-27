import jwt from "jsonwebtoken";

/**
 * Middleware: Verify JWT token from Authorization header.
 * Attaches decoded user payload to req.user on success.
 *
 * Expected header format:
 *   Authorization: Bearer <token>
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please login first.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { _id, email, name }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};
