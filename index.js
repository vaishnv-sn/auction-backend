import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import auctionRoutes from "./routes/auctionRoutes.js";
import initDB from "./config/db.js";

const app = express();
const PORT = 4000;
const allowedOrigin = "http://localhost:5173";

const corsOptions = {
  origin: allowedOrigin,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// ✅ Start server only after DB is ready
const startServer = async () => {
  try {
    const db = await initDB();
    console.log("✅ SQLite connected and tables ready");

    app.locals.db = db;

    // routes (db available now)
    app.use("/api", auctionRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to initialize DB:", err);
    process.exit(1); // stop process if DB fails
  }
};

startServer();
