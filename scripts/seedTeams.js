// scripts/seedTeams.js
import { query } from "../db/query.js";

const teams = [
  {
    league_id: "nfl.12345",
    team_key: "449.l.438606.t.1",
    name: "Garipp Bowls",
    manager: "Phi",
    city: "Bay Area",
    flavors: [
      "Commissioner of this fantasy football league",
      "Was guitarist in an emo band called Sound of Speed",
      "hot mom",
    ],
  },
  {
    league_id: "nfl.12345",
    team_key: "449.l.438606.t.2",
    name: "Calvins Cutthroats",
    manager: "Dan",
    city: "Longmont, CO",
    flavors: [
      "Good at skateboarding",
      "Good at snowboarding",
      "Gives driving tours in Estes Park",
      "hot mom",
    ],
  },
  {
    league_id: "nfl.12345",
    team_key: "449.l.438606.t.3",
    name: "Cow Bellz",
    manager: "Bales",
    city: "Longmont, CO",
    flavors: [
      "Lives in Hollywood",
      "Memory of a goldfish",
      "Aspiring actor",
      "hot mom",
    ],
  },
  {
    league_id: "nfl.12345",
    team_key: "449.l.438606.t.4",
    name: "The Baker Mayfields",
    manager: "Barry",
    city: "Brooklyn, NY",
    flavors: [
      "Works at Thumbtack (home services)",
      "Big OU Sooner fan",
      "hot mom",
    ],
  },
  {
    league_id: "nfl.12345",
    team_key: "449.l.438606.t.5",
    name: "Anubis",
    manager: "Anu",
    city: "Seattle, WA",
    flavors: ["Coded this app", "Hard to make fun of", "Too perfect"],
  },
  {
    league_id: "nfl.12345",
    team_key: "449.l.438606.t.6",
    name: "GlennAgain",
    manager: "Flo",
    city: "Rochester, NY",
    flavors: ["Hot mom", "Too tall", "Goes to raves", "Engineer"],
  },
  {
    league_id: "nfl.12345",
    team_key: "449.l.438606.t.7",
    name: "LUCAS'S LUCKY LIONS",
    manager: "Lucas",
    city: "Littleton, CO",
    flavors: [
      "Hot mom",
      "Was head boy in high school but was forced out by the administration",
      "Has a quesadilla review account on X (Twitter)",
    ],
  },
  {
    league_id: "nfl.12345",
    team_key: "449.l.438606.t.8",
    name: "Leapfrog Clause",
    manager: "Matt",
    city: "Superior, CO",
    flavors: [
      "Friends used the code word 'leapfrog' so he'd win video games if he got too angry",
      "Unsuccessfully tried a backflip at a school dance",
      "Paramore/Foo Fighters superfan",
      "hot mom",
    ],
  },
  {
    league_id: "nfl.12345",
    team_key: "449.l.438606.t.9",
    name: "This One's for John",
    manager: "David",
    city: "Maui, HI",
    flavors: [
      "Loves astronomy",
      "Stargazes on Maui",
      "Knows his constellations better than his bench depth",
      "hot mom",
    ],
  },
  {
    league_id: "nfl.12345",
    team_key: "449.l.438606.t.10",
    name: "Super Mega Awesome ✨",
    manager: "Jason",
    city: "Louisville, CO",
    flavors: [
      "Runs marathons",
      "Won 'best smile' in high school",
      "ex-Facebook",
      "hot mom",
    ],
  },
  {
    league_id: "nfl.12345",
    team_key: "449.l.438606.t.11",
    name: "TN Gamblers",
    manager: "TN",
    city: "unknown",
    flavors: [
      "Hot mom",
      "Phi's uncle",
      "No one knows his real name",
      "A mystery",
    ],
  },
  {
    league_id: "nfl.12345",
    team_key: "449.l.438606.t.12",
    name: "BowleyCowley",
    manager: "Kevin",
    city: "Kansas City, MO",
    flavors: [
      "Saintly mom",
      "Worked for Halliburton",
      "Web developer",
      "Played guard for his high school football team",
    ],
  },
  {
    league_id: "nfl.12345",
    team_key: "449.l.438606.t.13",
    name: "O-moss-em",
    manager: "Michael",
    city: "Arkansas",
    flavors: ["Hot mom", "Played lacrosse", "Has big body parts"],
  },
  {
    league_id: "nfl.12345",
    team_key: "449.l.438606.t.14",
    name: "Tebow’s Purity Ring",
    manager: "Ankit",
    city: "Michigan",
    flavors: [
      "Hot mom",
      "Drafted Jason Elam (a kicker) in the 1st round",
      "Lives in Michigan",
      "Too handsome",
      "Could be a Bollywood actor or model",
    ],
  },
];

for (const t of teams) {
  await query(
    `insert into teams (league_id, team_key, name, manager, city, flavors)
     values ($1,$2,$3,$4,$5,$6::jsonb)
     on conflict (team_key)
     do update set name=excluded.name,
                   manager=excluded.manager,
                   city=excluded.city,
                   flavors=excluded.flavors`,
    [
      t.league_id,
      t.team_key,
      t.name,
      t.manager,
      t.city,
      JSON.stringify(t.flavors ?? []),
    ]
  );
}

console.log("✅ Teams seeded");
process.exit(0);
