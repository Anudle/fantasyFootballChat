// mockTeamRosters.js

export async function teamRosters() {
  return [
    {
      teamName: "Leapfrog Clause",
      firstName: "Matt",
      funFacts: [
        "friends created the code word leapfrog to let him win at video games in middle school if he got too angry",
        "unsuccesfully tried a backflip at a school dance",
        "loves Paramore band",
        "Hot mom",
      ],
      players: [
        {
          name: { full: "Josh Allen" },
          bye_weeks: { week: 12 },
          status: null,
          selected_position: [null, { position: "QB" }],
        },
        {
          name: { full: "Kareem Hunt" },
          bye_weeks: { week: 6 },
          status: "O",
          selected_position: [null, { position: "RB" }],
        },
      ],
      roster: [
        "Baker Mayfield",
        "Deebo Samuel",
        "Adam Thielen",
        "Bijan Robinson",
        "Isaac Guerendo",
        "Chig Okonkwo",
        "Davante Adams",
        "Ameer Abdullah",
        "Kendre Miller",
        "Rome Odunze",
        "Brandin Cooks",
        "Chris Boswell",
        "Indianapolis",
      ],
    },
    {
      firstName: "David",
      teamName: "This One's for John",
      funFacts: ["Like Astronomy", "Lives in Hawaii", "Hot mom"],
      players: [
        {
          name: { full: "Calvin Ridley" },
          bye_weeks: { week: 5 },
          status: null,
          selected_position: [null, { position: "WR" }],
        },
      ],
    },
    {
      firstName: "Jason",
      teamName: "Super Mega Awesome ✨",
      funFacts: [
        "runs marathons",
        "won best smile in high school",
        "worked at fb",
        "Hot mom",
      ],
      players: [
        {
          name: { full: "CeeDee Lamb" },
          bye_weeks: { week: 7 },
          status: null,
          selected_position: [null, { position: "WR" }],
        },
      ],
    },
    {
      firstName: "Phi",
      teamName: "Garipp Bowls",
      funFacts: [
        "Hot mom",
        "commishiner",
        "was in a screamo band Sound of Speed",
      ],
      players: [],
    },
    {
      teamName: "Calvins Cutthroats",
      funFacts: ["Hot mom"],
      players: [],
    },
    {
      teamName: "The Baker Mayfields",
      funFacts: ["Hot mom"],
      players: [],
    },
    {
      teamName: "Anubis",
      funFacts: ["Hot mom"],
      players: [],
    },
    {
      teamName: "GlennAgain",
      funFacts: ["Hot mom"],
      players: [],
    },
    {
      teamName: "LUCAS'S LUCKY LIONS",
      funFacts: ["Hot mom"],
      players: [],
    },
    {
      teamName: "TN Gamblers",
      funFacts: ["Hot mom"],
      players: [],
    },
    {
      teamName: "BowleyCowley",
      funFacts: ["saintly mom"],
      players: [],
    },
    {
      teamName: "O-moss-em",
      funFacts: ["Hot mom"],
      players: [],
    },
    {
      teamName: "Tebow’s Purity Ring",
      funFacts: ["Hot mom", "drafted a Jason Elem (a kicker) in the 1st round"],
      players: [],
    },
  ];
}
