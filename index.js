import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import auctionRoutes from "./routes/auctionRoutes.js";

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

app.use("/api", auctionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
