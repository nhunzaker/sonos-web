const crypto = require("crypto");
const express = require("express");
const bodyParser = require("body-parser");
const { urlsafeEncode64 } = require("text/lib/text");

const config = require("config");

const { toChannel } = require("./channels");
const { pusher } = require("./pusher-client");

exports.sonosCallback = function() {
  const app = express();
  const path = config.get("sonos.eventCallbackPath");

  app.use(bodyParser.json());

  app.post(path, verify, sendUpdate);

  return app;
};

/**
 * Player information comes in the form of subscription callbacks.
 * Every callback contents should be verified. This function produces
 * that verification.
 *
 * See https://developer.sonos.com/build/direct-control/connect/
 */
function verify(request, response, next) {
  let values = [
    request.headers["x-sonos-event-seq-id"],
    request.headers["x-sonos-namespace"],
    request.headers["x-sonos-type"],
    request.headers["x-sonos-target-type"],
    request.headers["x-sonos-target-value"],
    config.get("sonos.clientId"),
    config.get("sonos.clientSecret")
  ].join("");

  let sha = crypto.createHash("sha256");

  sha.update(values);

  if (signature(sha) !== request.headers["x-sonos-event-signature"]) {
    response.send("Digest mismatch", 422);
  } else {
    next();
  }
}

/**
 * Other fields:
 *   id: request.headers["x-sonos-event-seq-id"],
 *   household: request.headers["x-sonos-household-id"]
 */
function sendUpdate(request, response) {
  // Let Sonos know everything is okay
  response.status(200).send(null);

  const { channel, object, type, id } = relatedChannel(request);

  pusher.trigger(channel, "update", request.body);

  console.log("EMIT - %s-%s to %s", object, type, channel)
}

/**
 * Sonos signatures have no padding; "=" at the end of a base64 encoded
 * signatures. It must be removed from our signatures.
 */
function noPadding(base64String) {
  return base64String.replace(/=*$/, "");
}

/**
 * NodeJS digests are not URL safe. As far as I can find, we have to
 * pull in a library for it.
 */
function signature(sha) {
  return noPadding(urlsafeEncode64(sha.digest("latin1")));
}

/**
 * We can derive the related channel to emit to pusher from the headers
 * given to us from sonos
 */
function relatedChannel(request) {
  const object = request.headers["x-sonos-target-type"];
  const type = request.headers["x-sonos-type"];
  const id = request.headers["x-sonos-target-value"];

  return { object, type, id, channel: toChannel(object, type, id) };
}
