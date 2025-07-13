import { Database } from "bun:sqlite";

export const db = new Database("./storage/database.sqlite", {
  create: true,
  strict: true,
});

db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id TEXT NOT NULL PRIMARY KEY,
    createdAt TEXT NOT NULL,
    source TEXT NOT NULL
  );
`);
