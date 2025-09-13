import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import initDB from "./config/db.js";
import auctionRoutes from "./routes/auctionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Start server only after DB is ready
const startServer = async () => {
  try {
    const db = await initDB();
    console.log("✅ SQLite connected and tables ready");

    app.locals.db = db;

    app.use("/api/auth", authRoutes);
    app.use("/api", auctionRoutes);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to initialize DB:", err);
    process.exit(1);
  }
};

startServer();
