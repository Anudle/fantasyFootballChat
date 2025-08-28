// scripts/initDb.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { query } from "../db/query.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");

try {
  await query(sql);
  console.log("✅ DB initialized");
  process.exit(0);
} catch (e) {
  console.error("❌ init error:", e.message);
  process.exit(1);
}
