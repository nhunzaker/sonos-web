/**
 * We should be good citizens with the Sonos API. Only subscribe to
 * callbacks when we have them, and delete them when no-one cares.
 */

const express = require("express");
const bodyParser = require("body-parser");

const config = require("config");
const { sonosClient } = require("networking");

const { pusher } = require("./pusher-client");
const { fromChannel } = require("./channels");
const { decrypt } = require("./encryption");
const { subscribe, unsubscribe } = require("./sonos-subscriptions");

exports.pusherCallback = function() {
  let app = express();
  let path = config.get("pusher.presenceCallbackPath");

  app.post(path, bodyParser.raw({ type: "application/json" }), handleCallback);

  return app;
};

function handleCallback(request, response) {
  // Pusher webhook parsing requires a raw body. This is important to verify
  // the contents of the payload to avoid man-in-the-middle attacks
  //
  // https://github.com/pusher/pusher-http-node#webhooks-1
  let webhook = pusher.webhook({
    headers: request.headers,
    rawBody: request.body
  });

  if (webhook.isValid() === false) {
    response.status(422).send("Invalid webhook");
    return;
  }

  response.status(204).send();

  for (let event of webhook.getEvents()) {
    let token = decrypt(event.user_id);

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

/**
 * Pusher webhook validation requires a rawBody field. That doesn't
 * appear to be a thing with express requests. It could be because of
 * the body-parser, but I haven't investigated too thoroughly.
 *
 * This middleware adds the field back, following the example from the
 * pusher repo:
 *
 * https://github.com/pusher/pusher-http-node/blob/5436ea48715f6bb98f0a07bc07c5b04752fcf2e5/examples/webhook_endpoint.js
 */
