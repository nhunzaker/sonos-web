/**
 * OAUTH2 Token Aquisition for Sonos
 * https://developer.sonos.com/build/direct-control/authorize/
 */

const express = require("express");
const passport = require("passport");
const refresh = require("passport-oauth2-refresh");
const { Strategy } = require("passport-oauth2");
const url = require("url");
const config = require("config");

const oauth = express();

function authorization() {
  const { clientId, clientSecret } = config.sonos;
  return (
    "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  );
}

class SonosStrategy extends Strategy {
  constructor(callback) {
    super(
      {
        authorizationURL: "https://api.sonos.com/login/v3/oauth",
        tokenURL: "https://api.sonos.com/login/v3/oauth/access",
        clientID: config.sonos.clientId,
        clientSecret: config.sonos.clientSecret,
        callbackURL: url.resolve(config.domain, "auth/callback"),
        scope: "playback-control-all",
        state: Buffer.from(`${Math.random()}`).toString("base64"),
        customHeaders: {
          Authorization: authorization()
        }
      },
      callback
    );
  }
}

const authStrategy = new SonosStrategy(function(
  token,
  refreshToken,
  user,
  done
) {
  updateUser(user, token, refreshToken);
  done(null, user);
});

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
passport.use(authStrategy);

refresh.use(authStrategy);

oauth.use(passport.initialize());
oauth.use(passport.session());

oauth.get("/login", (req, res, next) => {
  // Someone should answer...
  next();
});

oauth.get(
  "/auth",
  passport.authenticate("oauth2", {
    failureRedirect: "/login"
  })
);

oauth.get("/auth/callback", passport.authenticate("oauth2"), (req, res) => {
  res.redirect("/");
});

function ensureAuthenticated(req, res, next) {
  const user = req.user || {};
  const refreshToken = user.refresh;
  const expired = userExpired(req.user);

  // Avoid redirect loops trying to authenticate...
  if (req.path === '/login') {
    return next()
  }

  if (req.isAuthenticated() && !expired) {
    return next();
  } else if (expired && refreshToken) {
    refresh.requestNewAccessToken(
      "oauth2",
      refreshToken,
      null,
      (_, token, refreshToken, results) => {
        const session = req.session;
        if (session) {
          const user =
            (session && session.passport && session.passport.user) || {};
          updateUser(user, token, refreshToken);
          session.save(err => console.error(err));
        }
        return next();
      }
    );
  } else {
    res.redirect("/login");
  }
}

function updateUser(user, token, refreshToken) {
  user.token = token;
  user.refresh = refreshToken;
  user.expire = new Date();
  user.expire.setTime(user.expire.getTime() + 55 * 60 * 1000);

  return user;
}

function userExpired(user) {
  if (!(user && user.expire)) {
    return true;
  }

  const expire =
    typeof user.expire === "string"
      ? new Date(Date.parse(user.expire))
      : user.expire;

  const now = new Date();

  return expire < now;
}

exports.oauth = oauth;
exports.ensureAuthenticated = ensureAuthenticated;
