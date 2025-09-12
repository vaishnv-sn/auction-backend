import { Router } from "express";
import { getAuctionItems } from "../controllers/auctionController.js";

const router = Router();
router.get("/auctionItems", getAuctionItems);

export default router;
