/**
 * We should be good citizens with the Sonos API. Only subscribe to
 * callbacks when we have them, and delete them when no-one cares.
 */

const express = require("express");
const config = require("config");

const { sonosClient } = require("networking");

const { pusher } = require("./pusher-client");
const { fromChannel } = require("./channels");
const { decrypt } = require("./encryption");
const { subscribe, unsubscribe } = require("./sonos-subscriptions");

exports.pusherCallback = function() {
  const app = express();

  app.post(config.get("pusher.presenceCallbackPath"), handleCallback);

  return app;
};

function handleCallback(request, response) {
  const webhook = pusher.webhook(request);

  if (webhook.isValid() === false) {
    response.status(422).send();
    return;
  }

  response.status(204).send();

  const { time, events } = request.body;

  for (let event of events) {
    const token = decrypt(event.user_id);

    switch (event.name) {
      case "member_added":
        subscribe(event.channel, token);
        break;
      case "member_removed":
        unsubscribe(event.channel, token);
        break;
    }
  }
}
