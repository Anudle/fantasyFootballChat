// scripts/dbPing.js
import { query } from "../db/query.js";
const rows = await query("select 1 as ok");
console.log("db ping:", rows);
process.exit(0);