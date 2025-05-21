// runMockWeek.mjs
import { exec } from "child_process";
import { promisify } from "util";
import { sendTelegramMessage } from "../telegram/sendTelegramMessage.js";

const run = promisify(exec);

async function runMockWeek() {
  console.log("🔮 Running Thursday Prediction...\n");
  const { stdout: thursdayOutput } = await run(
    "node cron/runThursdayPrediction.mjs"
  );
  console.log(thursdayOutput);
  // await sendTelegramMessage(`<b>Thursday Prediction</b>\n${thursdayOutput}`);

  console.log("\n🔥 Running Tuesday Roast...\n");
  const { stdout: tuesdayOutput } = await run("node cron/runTuesdayRoast.mjs");
  // await sendTelegramMessage(`<b>Tuesday Roast</b>\n${tuesdayOutput}`);

  console.log("\n✅ Mock Week Completed.");
}

runMockWeek().catch((err) => {
  console.error("❌ Mock week failed:", err);
});
