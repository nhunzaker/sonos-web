const express = require("express");
const bodyParser = require("body-parser");
const { verify } = require("./verify");
const { router } = require("./routing");
const { sonos } = require('sonos-server/config');

exports.Events = function() {
  const app = express();

  app.set("clientId", sonos.clientId);
  app.set("clientSecret", sonos.clientSecret);

  app.use(bodyParser.json());

  app.post(sonos.eventCallbackPath, verify, router);

  return app;
};
