// db/query.js
import { pool } from "./pool.js";

export async function query(text, params = []) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const ms = Date.now() - start;
    if (ms > 200) {
      console.warn(
        `[db] slow query ${ms}ms: ${text} :: ${JSON.stringify(params)}`
      );
    }
    return res.rows;
  } catch (err) {
    console.error("[db] query error:", { text, params, err: err.stack || err }); // <— stack
    throw err;
  }
}
