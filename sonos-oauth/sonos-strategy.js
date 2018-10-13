const { randomBytes } = require("crypto");
const { Strategy } = require("passport-oauth2");
const { resolve } = require("url");
const { updateUser } = require("./authenticate");

const config = require("config");

function sonosAuthorization(clientId, clientSecret) {
  return {
    Authorization:
      "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  };
}

function callback(token, refreshToken, user, done) {
  updateUser(user, token, refreshToken);
  done(null, user);
}

class SonosStrategy extends Strategy {
  constructor() {
    const clientId = config.get("sonos.clientId");
    const clientSecret = config.get("sonos.clientSecret");
    const callbackURL = resolve(
      config.get("hostname"),
      config.get("sonos.authCallbackPath")
    );

    super(
      {
        authorizationURL: "https://api.sonos.com/login/v3/oauth",
        tokenURL: "https://api.sonos.com/login/v3/oauth/access",
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: callbackURL,
        scope: "playback-control-all",
        state: randomBytes(64).toString("hex"),
        customHeaders: sonosAuthorization(clientId, clientSecret)
      },
      callback
    );
  }
}

module.exports = { SonosStrategy };
