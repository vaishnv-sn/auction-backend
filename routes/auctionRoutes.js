import { Router } from "express";
import {
  getAuctionItems,
  createBid,
} from "../controllers/auctionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();
router.get("/auctionItems", authMiddleware, getAuctionItems);
router.post("/createBid", authMiddleware, createBid);

export default router;
