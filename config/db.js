import sqlite3 from "sqlite3";
import { open } from "sqlite";

// This opens a database handle
const initDB = async () => {
  const db = await open({
    filename: "./auction.db", // creates a file auction.db in root
    driver: sqlite3.Database,
  });

  // Create tables if not exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      currentBid INTEGER NOT NULL DEFAULT 100,
      lastBidder TEXT DEFAULT NULL,
      lockedUntil INTEGER DEFAULT 0
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS bids (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      itemId INTEGER,
      amount INTEGER,
      timestamp INTEGER DEFAULT (strftime('%s','now')),
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(itemId) REFERENCES items(id)
    );
  `);

  return db;
};

export default initDB;
