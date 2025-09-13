export const errorHandler = (err, req, res, next) => {
  // Log detailed error information for debugging
  console.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    userId: req.user?.id || "unauthenticated",
    timestamp: new Date().toISOString(),
  });

  // Handle specific error types
  if (err.name === "JsonWebTokenError") {
    return res
      .status(401)
      .json({ error: "Invalid token. Please log in again." });
  }

  if (err.name === "TokenExpiredError") {
    return res
      .status(401)
      .json({ error: "Access token expired. Please refresh your token." });
  }

  if (err.name === "SyntaxError" && err.message.includes("JSON")) {
    return res.status(400).json({ error: "Invalid JSON in request body." });
  }

  if (err.code === "SQLITE_ERROR") {
    // Handle SQLite-specific errors (adjust based on your SQLite library)
    return res
      .status(500)
      .json({ error: "Database error occurred. Please try again later." });
  }

  // Handle route-specific errors already sent with a status code
  if (res.statusCode >= 400 && res.statusCode < 500) {
    // Avoid overwriting specific errors (e.g., 400, 401, 423 from createBid)
    return res.json({ error: err.message });
  }

  // Default to 500 for unhandled errors
  res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;
