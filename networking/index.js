const axios = require("axios");
const config = require("config");

export function sonosClient(token) {
  return axios.create({
    baseURL: "https://api.ws.sonos.com/control/api/v1",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
