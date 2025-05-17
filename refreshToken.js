// refreshToken.js
const fs = require('fs');
const { create } = require('simple-oauth2');

const config = {
  client: {
    id: 'YOUR_CLIENT_ID',
    secret: 'YOUR_CLIENT_SECRET',
  },
  auth: {
    tokenHost: 'https://api.login.yahoo.com',
    tokenPath: '/oauth2/get_token',
  },
};

const client = create(config);

async function refreshAccessToken() {
  const tokenData = JSON.parse(fs.readFileSync('auth.json'));
  const token = client.accessToken.create(tokenData);

  try {
    const refreshed = await token.refresh();
    console.log('✅ Refreshed Access Token:', refreshed.token.access_token);

    // Save new token to file
    fs.writeFileSync('auth.json', JSON.stringify(refreshed.token, null, 2));
    console.log('💾 Token updated in auth.json');
    return refreshed.token;
  } catch (err) {
    console.error('❌ Token refresh failed:', err.message);
  }
}

refreshAccessToken();
