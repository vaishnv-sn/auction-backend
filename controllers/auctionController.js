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
