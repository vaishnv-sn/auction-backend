import initDB from "../config/db.js";

export const getAuctionItems = async (req, res, next) => {
  try {
    const db = await initDB();

    const items = await db.all(`
      SELECT 
        i.id,
        i.title,
        i.description,
        i.startingPrice,
        i.status,
        b.id AS bidId,
        b.userId AS bidderId,
        b.amount AS lastBidAmount,
        b.timestamp AS lastBidTime
      FROM items i
      LEFT JOIN bids b ON i.lastBidId = b.id
      ORDER BY i.id ASC
    `);

    res.status(200).json({ items });
  } catch (error) {
    console.error("Error fetching items:", error);
    next(error);
  }
};

export const createBid = async (req, res, next) => {
  try {
    const db = await initDB();
    const { itemId, amount } = req.body;
    const userId = req.user?.id;
    console.log("userId:", userId);

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or missing token" });
    }

    if (!itemId || !amount) {
      return res.status(400).json({ error: "itemId and amount are required" });
    }

    if (!Number.isInteger(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ error: "Bid amount must be a positive integer" });
    }

    // 1. Fetch item & last bid
    const item = await db.get(
      `SELECT i.id, i.title, i.startingPrice, i.status, i.lockedUntil, b.amount AS lastBidAmount
       FROM items i
       LEFT JOIN bids b ON i.lastBidId = b.id
       WHERE i.id = ?`,
      [itemId]
    );

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.status !== "active") {
      return res.status(400).json({ error: "Auction has ended" });
    }

    const now = Math.floor(Date.now() / 1000);
    if (item.lockedUntil && now < item.lockedUntil) {
      return res
        .status(423)
        .json({ error: "Item is locked. Try again later." });
    }

    const lastBid = item.lastBidAmount || item.startingPrice;

    // 2. Validate bid
    if (amount <= lastBid) {
      return res
        .status(400)
        .json({ error: `Bid must be greater than ${lastBid}` });
    }

    if (amount < lastBid + 1) {
      return res
        .status(400)
        .json({ error: `Bid must beat last bid by at least ₹1` });
    }

    // 3. Lock for 3 seconds
    const lockUntil = now + 3;
    await db.run(`UPDATE items SET lockedUntil = ? WHERE id = ?`, [
      lockUntil,
      itemId,
    ]);

    // 4. Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 5. Double-check last bid after delay
    const checkItem = await db.get(
      `SELECT b.amount AS lastBidAmount FROM items i
       LEFT JOIN bids b ON i.lastBidId = b.id
       WHERE i.id = ?`,
      [itemId]
    );

    if (checkItem.lastBidAmount && checkItem.lastBidAmount >= amount) {
      return res.status(409).json({
        error: "Another user has already placed a higher or equal bid",
      });
    }

    // 6. Insert bid
    const result = await db.run(
      `INSERT INTO bids (itemId, userId, amount)
       VALUES (?, ?, ?)`,
      [itemId, userId, amount]
    );

    const bidId = result.lastID;

    await db.run(
      `UPDATE items SET lastBidId = ?, lockedUntil = 0 WHERE id = ?`,
      [bidId, itemId]
    );

    const newBid = await db.get(`SELECT * FROM bids WHERE id = ?`, [bidId]);

    res.status(201).json({
      message: "Bid placed successfully",
      bid: newBid,
    });
  } catch (error) {
    console.error("Error creating bid:", error);
    next(error);
  }
};
