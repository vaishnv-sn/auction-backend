// seed.js
import initDB from "./config/db.js";

import dotenv from "dotenv";
dotenv.config();

const seed = async () => {
  const db = await initDB();

  console.log("🌱 Seeding database...");

  // Clear old data if needed
  await db.exec("DELETE FROM items;");
  await db.exec("DELETE FROM bids;");

  // Insert sample items
  await db.exec(`
    INSERT INTO items (title, description, startingPrice)
    VALUES
      ("Vintage Watch", "Classic Swiss-made vintage wristwatch from 1970s, leather strap.", 5000),
      ("iPhone 14 Pro", "256GB, Deep Purple, lightly used, excellent condition.", 80000),
      ("Gaming Laptop", "15.6-inch display, RTX 3070, 16GB RAM, 1TB SSD.", 120000),
      ("Antique Vase", "Handcrafted ceramic vase from the Ming Dynasty replica collection.", 15000),
      ("Mountain Bike", "Alloy frame, Shimano gears, hydraulic brakes, barely used.", 25000),
      ("Art Painting", "Original oil painting on canvas by local artist.", 10000),
      ("Smart TV", "4K Ultra HD, HDR10+, 2-year warranty left.", 40000),
      ("Gold Ring", "22K solid gold ring, 7 grams, hallmarked.", 45000)
  `);

  console.log("✅ Database seeded successfully!");
  await db.close();
};

seed().catch((err) => {
  console.error("❌ Error seeding DB:", err);
});
