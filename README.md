# 🏈 MUFF Bot

This project is a Telegram-integrated fantasy football bot that:
- Authenticates with the Yahoo Fantasy Sports API
- Detects questionable lineup decisions
- Generates witty predictions and roast messages using the Groq API (LLM)
- Sends alerts and commentary into a Telegram group chat

---

## 🔧 Features
- 🧠 LLM-generated Tuesday roasts and Thursday projections
- ✅ Yahoo OAuth + token refresh
- 📊 Lineup validation: detects bye week players or injured starters
- 📬 Sends updates directly into Telegram
- 🕒 Cron-ready architecture for automation
- 👥 Fun facts per manager for custom trash talk

---

## 📁 Project Structure
```bash
fantasyFootballChat/
├── cron/                    # Weekly runners (roast + prediction)
│   ├── runTuesdayRoast.mjs
│   ├── runThursdayPrediction.mjs
│   └── runMockWeek.mjs
├── mocks/                  # Mock data for local testing
│   ├── mockTeamRosters.js
│   └── mockMatchups.js
├── telegram/               # Telegram bot integration
│   ├── sendTelegramMessage.js
│   └── getChatId.js
├── utils/                  # Helper functions and generators
│   ├── generateGroqPrediction.js
│   ├── generatePrediction.js
│   └── detectLineupOffenders.js
├── yahoo/                  # Yahoo Fantasy API auth + data
│   ├── getAccessToken.js
│   ├── refreshToken.js
│   └── getLeagueInfo.js
├── .env                    # API keys and tokens (not committed)
├── auth.json               # Yahoo tokens (local dev only, gitignored)
├── index.js                # Express Yahoo auth callback
├── package.json
└── README.md
```

---

## 🛠️ Setup
1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   YAHOO_CLIENT_ID=your_yahoo_app_client_id
   YAHOO_CLIENT_SECRET=your_yahoo_app_secret
   GROQ_API_KEY=your_groq_api_key
   TELEGRAM_BOT_TOKEN=your_telegram_token
   TELEGRAM_CHAT_ID=your_group_chat_id
   ```
4. Start the Yahoo OAuth flow (first time only):
   ```bash
   node index.js
   # Then visit http://localhost:3000/auth
   ```

---

## 🧪 Scripts
Run a full weekly simulation:
```bash
node cron/runMockWeek.mjs
```
Run just a Tuesday roast:
```bash
node cron/runTuesdayRoast.mjs
```
Run Thursday matchup predictions:
```bash
node cron/runThursdayPrediction.mjs
```

---

## 📦 Deployment
- Deployed to [Render](https://render.com/) for Yahoo OAuth endpoint
- Cron jobs can be scheduled in Render or run manually
- Auth tokens refresh automatically via `refreshToken.js`

---

## 🧠 Credit
Created with help from OpenAI + Groq for dynamic content.
Inspired by years of fantasy football overreaction.

---

## 🔒 Note
Keep `.env` and `auth.json` out of Git.
Use `.gitignore` to avoid pushing sensitive info.

