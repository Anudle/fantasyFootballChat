// index.js
import express from "express";
import { AuthorizationCode } from "simple-oauth2";
import fs from "fs";
import "dotenv/config";
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
const redirectUri =
  "https://38a2-2601-601-c01-371b-e8ca-3db5-ee6b-7b08.ngrok-free.app/callback";

const authorizationUri = client.authorizeURL({
  redirect_uri: redirectUri,
  scope: "fspt-r",
});

app.get("/auth", (req, res) => {
  open(authorizationUri);
  res.send(`
    <html>
      <body style="background:#111;color:#fff;font-family:sans-serif;text-align:center;padding-top:40px;">
        Redirecting to Yahoo login...
      </body>
    </html>
  `);
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

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000/auth");
});
