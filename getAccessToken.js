import { refreshYahooToken } from "./refreshToken.js";

export async function getAccessToken() {
  return await refreshYahooToken();
}
