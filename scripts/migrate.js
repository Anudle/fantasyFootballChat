// scripts/migrate.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { query } from "../db/query.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, "migrations");

// Read all .sql files in scripts/migrations, in lexical order
const files = fs
  .readdirSync(migrationsDir)
  .filter(f => f.endsWith(".sql"))
  .sort((a, b) => a.localeCompare(b));

if (files.length === 0) {
  console.log("No migrations to run.");
  process.exit(0);
}

for (const file of files) {
  const p = path.join(migrationsDir, file);
  const sql = fs.readFileSync(p, "utf-8");
  console.log(`🚚 Applying migration: ${file}`);
  await query(sql);
  console.log(`✅ Applied: ${file}`);
}

console.log("🎉 All migrations applied.");
process.exit(0);
