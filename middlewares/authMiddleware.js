import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Attach user ID to req.user
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;
