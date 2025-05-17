const fs = require("fs");
const fetch = require("node-fetch");

const tokenData = JSON.parse(fs.readFileSync("auth.json"));
const accessToken = tokenData.access_token;

const leagueKey = "449.l.438606";
const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/scoreboard;week=1?format=json`;


async function getLeagueData() {
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
  } catch (err) {
    console.error("❌ Error fetching league data:", err.message);
  }
}

getLeagueData();
