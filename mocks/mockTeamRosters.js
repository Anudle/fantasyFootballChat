// mockTeamRosters.js

export async function teamRosters() {
  return [
    {
      teamName: "Leapfrog Clause",
      funFacts: [
        "friends created the code word leapfrog to let him win at video games in middle school if he got too angry ",
        "unsuccesfully tried a backflip at a school dance",
        "loves Paramore band",
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
          status: null,
          selected_position: [null, { position: "RB" }],
        },
      ],
    },
    {
      teamName: "This One's for John",
      funFacts: ["Like Astronomy", "Lives in Hawaii"],
      players: [
        {
          name: { full: "Calvin Ridley" },
          bye_weeks: { week: 5 },
          status: "O",
          selected_position: [null, { position: "WR" }],
        },
      ],
    },
    {
      teamName: "Super Mega Awesome ✨",
      funFacts: [
        "runs marathons",
        "won best smile in high school",
        "worked at fb",
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
  ];
}
