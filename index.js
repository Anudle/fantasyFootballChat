// index.js
import express from "express";
import { AuthorizationCode } from "simple-oauth2";
import fs from "fs";
import "dotenv/config";
import './telegram/telegramListener.js';    
import open from "open"; // ✅ the correct ESM import

const config = {
  client: {
    id: process.env.YAHOO_CLIENT_ID,
    secret: process.env.YAHOO_CLIENT_SECRET,
  },
  auth: {
    tokenHost: "https://api.login.yahoo.com",
    authorizePath: "/oauth2/request_auth",
    tokenPath: "/oauth2/get_token",
  },
};


const client = new AuthorizationCode(config);
const app = express();
const redirectUri = "https://fantasyfootballchat.onrender.com/callback";
const PORT = process.env.PORT || 3000;

const authorizationUri = client.authorizeURL({
  redirect_uri: redirectUri,
  scope: "fspt-r",
});

app.get("/auth", (req, res) => {
  res.redirect(authorizationUri);
});

app.get("/callback", async (req, res) => {
  const { code } = req.query;
  const tokenParams = {
    code,
    redirect_uri: redirectUri,
    scope: "fspt-r",
  };

  try {
    const accessToken = await client.getToken(tokenParams);
    console.log("\n✅ Add the following to your .env:");
    console.log(`ACCESS_TOKEN=${accessToken.token.access_token}`);
    console.log(`REFRESH_TOKEN=${accessToken.token.refresh_token}`);

    fs.writeFileSync("auth.json", JSON.stringify(accessToken.token, null, 2));
    res.send(`
      <html>
        <body style="background:#111;color:#fff;font-family:sans-serif;text-align:center;padding-top:40px;">
          Authorization successful! Token stored.
        </body>
      </html>
    `);
    console.log("🔐 Token saved to auth.json");
  } catch (error) {
    console.error("Access Token Error", error.message);
    res.status(500).send(`
      <html>
        <body style="background:#111;color:#fff;font-family:sans-serif;text-align:center;padding-top:40px;">
          Authentication failed
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
