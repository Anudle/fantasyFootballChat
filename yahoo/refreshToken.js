// refreshToken.js
import axios from "axios";
import "dotenv/config";

const TOKEN_URL = "https://api.login.yahoo.com/oauth2/get_token";

export async function refreshYahooToken() {
  const refreshToken = process.env.REFRESH_TOKEN;

  if (!refreshToken) {
    console.error("❌ No REFRESH_TOKEN found in environment.");
    return null;
  }

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
    const expiresAt = new Date(Date.now() + newToken.expires_in * 1000);

    // 🔒 Log so you can copy-paste into .env or Render
    console.log("\n✅ New tokens (update your .env or Render environment):");
    // console.log(`ACCESS_TOKEN=${newToken.access_token}`);
    // console.log(`REFRESH_TOKEN=${newToken.refresh_token}`);
    console.log(`Expires at: ${expiresAt.toISOString()}`);

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
