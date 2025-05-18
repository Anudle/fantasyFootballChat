import generateTrashTalk from "./utils/generateTrashTalk.js";

(async () => {
  const message = await generateTrashTalk(
    "Touchdown Town",
    148.3,
    "Bench Warmers",
    97.6
  );
  console.log("💬 Trash Talk:", message);
})();
