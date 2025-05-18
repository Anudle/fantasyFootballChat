// refreshToken.js
import fs from "fs";
import axios from "axios";
import "dotenv/config";

const TOKEN_URL = "https://api.login.yahoo.com/oauth2/get_token";

export async function refreshYahooToken() {
  const tokenData = JSON.parse(fs.readFileSync("auth.json"));
  const refreshToken = tokenData.refresh_token;

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  try {
    const response = await axios.post(TOKEN_URL, params, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.YAHOO_CLIENT_ID}:${process.env.YAHOO_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const newToken = response.data;
    newToken.expires_at = new Date(Date.now() + newToken.expires_in * 1000);

    fs.writeFileSync("auth.json", JSON.stringify(newToken, null, 2));
    console.log("🔄 Refreshed access token saved to auth.json");
    return newToken.access_token;
  } catch (error) {
    console.error("❌ Failed to refresh Yahoo token:", error.message);
    return null;
  }
}

// Run directly
if (process.argv[1].includes("refreshToken.js")) {
  refreshYahooToken();
}
