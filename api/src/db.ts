import { DatabaseSync } from "node:sqlite";

export const db = new DatabaseSync("./storage/database.sqlite");

db.exec("PRAGMA journal_mode=WAL;");

db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id TEXT NOT NULL PRIMARY KEY,
    createdAt TEXT NOT NULL,
    source TEXT NOT NULL
  );
`);
