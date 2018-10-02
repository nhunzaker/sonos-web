const express = require("express");
const cookies = require("cookie-parser");
const session = require("cookie-session");
const bodyParser = require("body-parser");
const { oauth, ensureAuthenticated } = require("./oauth");
const config = require("./config");
const path = require("path");

const app = express();

// Parse JSON, used by the Sonos API and our client
app.use(bodyParser.json());

// We need cookies to hide the Sonos auth token
app.use(cookies());

// That requires a session
app.use(
  session({
    name: "token",
    secret: config.secret,
    cookie: {
      secure: false,
      httpOnly: false,
      sameSite: false,
      domain: config.domain,
      path: "/",
      expires: new Date(Date.now() + 60 * 60 * 1000)
    }
  })
);

// Oauth is a custom strategy for Passport, which is configured for Sonos
app.use(oauth);

// All routes are authenticated. We need a token to get any data from the
// Sonos API
//app.use("/", ensureAuthenticated);

app.use("/api", ensureAuthenticated);

module.exports = app;
