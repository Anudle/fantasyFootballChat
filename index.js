// index.js
const express = require("express");
const { AuthorizationCode } = require("simple-oauth2");
const fs = require("fs");
require("dotenv").config();

(async () => {
  const open = (await import("open")).default;

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
    "https://48c7-2601-601-c01-371b-193c-aa5c-ec87-333f.ngrok-free.app/callback";

  const authorizationUri = client.authorizeURL({
    redirect_uri: redirectUri,
    scope: "fspt-r",
  });

  app.get("/auth", (req, res) => {
    open(authorizationUri);
    res.send("Redirecting to Yahoo login...");
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
      res.send("Authorization successful! Token stored.");
      console.log("🔐 Token saved to auth.json");
      console.log(accessToken.token);
    } catch (error) {
      console.error("Access Token Error", error.message);
      res.status(500).json("Authentication failed");
    }
  });

  app.listen(3000, () =>
    console.log("Listening on http://localhost:3000/auth")
  );
})();
