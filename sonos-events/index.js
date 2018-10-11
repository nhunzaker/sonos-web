const express = require("express");
const bodyParser = require("body-parser");
const { sonos, pusher } = require("config");

const { verify } = require("./verify");
const { router } = require("./routing");
const { subscription } = require("./subscription");
const { ensureAuthenticated } = require("sonos-server/oauth");
const { identify } = require('./identify')

exports.Events = function() {
  const app = express();

  // Following instructions for Pusher auth integration
  // https://pusher.com/docs/authenticating_users
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.post(sonos.eventCallbackPath, verify, router);

  app.post(pusher.presenceCallbackPath, subscription);

  app.post(pusher.authCallbackPath, ensureAuthenticated, identify);

  return app;
};
