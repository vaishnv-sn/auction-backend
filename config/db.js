import sqlite3 from "sqlite3";
import { open } from "sqlite";

const initDB = async () => {
  const db = await open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt INTEGER DEFAULT (strftime('%s','now'))
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      startingPrice INTEGER NOT NULL DEFAULT 100,
      status TEXT NOT NULL DEFAULT 'active',
      lastBidId INTEGER DEFAULT NULL,
      lockedUntil INTEGER DEFAULT 0,
      createdAt INTEGER DEFAULT (strftime('%s','now')),
      FOREIGN KEY(lastBidId) REFERENCES bids(id) ON DELETE SET NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS bids (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      itemId INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      timestamp INTEGER DEFAULT (strftime('%s','now')),
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(itemId) REFERENCES items(id) ON DELETE CASCADE
    );
  `);

  return db;
};

export default initDB;
