// scripts/seedFlavors.js
import "dotenv/config";
import { query } from "../db/query.js";

const flavorsByName = new Map([
  [
    "Garipp Bowls",
    [
      "Commissioner of this fantasy football league",
      "Was guitarist in an emo band Sound of Speed",
      "Good at Halo",
      "hot mom",
    ],
  ],
  [
    "Calvins Cutthroats",
    [
      "Good at skateboarding",
      "Good at snowboarding",
      "Gives driving tours in Estes Park",
      "hot mom",
    ],
  ],
  [
    "Cow Bellz",
    [
      "Knows Hollywood people",
      "Memory of a goldfish",
      "Aspiring actor",
      "hot mom",
    ],
  ],
  [
    "The Baker Mayfields",
    [
      "Works at Thumbtack (home services)",
      "Big OU Sooner fan",
      "runs a lot",
      "hot mom",
    ],
  ],
  ["Anubis", ["Coded this app", "Hard to make fun of", "Too perfect"]],
  ["GlennAgain", ["Hot mom", "Too tall", "Goes to raves", "Engineer"]],
  [
    "LUCAS'S LUCKY LIONS",
    [
      "Hot mom",
      "Was head boy in high school but was forced out by the administration",
      "Has a quesadilla review account on X (Twitter)",
    ],
  ],
  [
    "Leapfrog Clause",
    [
      "Friends used the code word 'leapfrog' so he'd win video games if he got too angry",
      "Unsuccessfully tried a backflip at a school dance",
      "Paramore/Foo Fighters superfan",
      "good at guitar",
      "hot mom",
    ],
  ],
  [
    "This One's for John",
    [
      "Loves astronomy",
      "good at world of warcaft",
      "Software engineer",
      "hot mom",
    ],
  ],
  [
    "Super Mega Awesome ✨",
    [
      "Runs marathons",
      "Won 'best smile' in high school",
      "ex-Facebook",
      "hot mom",
    ],
  ],
  [
    "TN Gamblers",
    ["Hot mom", "Phi's uncle", "No one knows his real name", "A mystery"],
  ],
  [
    "BowleyCowley",
    [
      "Saintly mom",
      "Worked for Halliburton",
      "Web developer",
      "Played guard for his high school football team",
    ],
  ],
  ["O-moss-em", ["Hot mom", "Played lacrosse", "Has big body parts"]],
  [
    "Tebow’s Purity Ring",
    [
      "Hot mom",
      "Drafted Jason Elam (a kicker) in the 1st round",
      "Too handsome",
      "Could be a Bollywood actor or model",
    ],
  ],
]);

let updated = 0;
for (const [name, flavors] of flavorsByName.entries()) {
  const res = await query(
    `UPDATE teams
       SET flavors = $2::jsonb
     WHERE name = $1`,
    [name, JSON.stringify(flavors)]
  );
  updated += res.length || 0; // your query() returns rows; UPDATE returns []
}
console.log(`✅ Flavors seeded for ${flavorsByName.size} teams`);
process.exit(0);
