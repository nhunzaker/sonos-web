/**
 * OAUTH2 Token Aquisition for Sonos
 * https://developer.sonos.com/build/direct-control/authorize/
 */

const config = require("config");
const express = require("express");
const passport = require("passport");
const refresh = require("passport-oauth2-refresh");
const cookies = require("cookie-parser");
const session = require("cookie-session");

const { authenticated } = require("./authenticate");
const { SonosStrategy } = require("./sonos-strategy");

function OAuth() {
  const app = express();

  // We need cookies to hide the Sonos auth token
  app.use(cookies());

  // That requires a session
  app.use(
    session({
      name: "token",
      secret: config.get("secret"),
      cookie: {
        domain: config.get("hostname"),
        expires: new Date(Date.now() + 60 * 60 * 1000),
        httpOnly: true,
        sameSite: true,
        secure: config.get("isProduction")
      }
    })
  );

  const strategy = new SonosStrategy();

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  passport.use(strategy);
  refresh.use(strategy);

  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/login", (req, res, next) => {
    // Someone should answer... but always configure this first
    next();
  });

  app.get(
    "/auth",
    passport.authenticate("oauth2", {
      failureRedirect: "/login"
    })
  );

  app.get(
    config.get("sonos.authCallbackPath"),
    passport.authenticate("oauth2"),
    (req, res) => res.redirect("/")
  );

  return app;
}

exports.OAuth = OAuth;

exports.authenticated = authenticated;
