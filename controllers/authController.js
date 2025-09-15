// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
      await db.run(
        "INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)",
        [name, email, passwordHash]
      );
    } catch (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(400).json({ error: "Email already exists" });
      }
      throw err;
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error user signup:", err);
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const { email, password } = req.body;

    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    // generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user: { id: user.id, name: user.name } });
  } catch (err) {
    console.error("Error user login:", err);
    next(err);
  }
};
