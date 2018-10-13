const express = require("express");
const config = require("config");
const bodyParser = require("body-parser");

const { authenticated } = require("sonos-oauth");

const { encrypt } = require("./encryption");
const { pusher } = require("./pusher-client");
const { subscribe } = require("./sonos-subscriptions");

exports.pusherAuth = function() {
  const app = express();
  const path = config.get("pusher.authCallbackPath");

  // Following instructions for Pusher auth integration
  // https://pusher.com/docs/authenticating_users
  app.use(bodyParser.urlencoded({ extended: false }));

  app.post(path, authenticated, identify);

  return app;
};

/**
 * There isn't a great way to identify a user for subscribing/unsubscribing
 * callbacks when Pusher tells us someone has joined/left a room.
 *
 * This method sets up an encrypted user ID for Pusher authentication using
 * a salt of the authentication token.
 */
function identify(request, response) {
  const { socket_id, channel_name } = request.body;

  var auth = pusher.authenticate(socket_id, channel_name, {
    // request.user.token comes from sonos-oauth.authenticated
    user_id: encrypt(request.user.token)
  });

  response.send(auth);

  // For the reconnect case, start subscribing to the related channel. If a
  // user is reconnecting, we need to subscribe again
  subscribe(channel_name, request.user.token);
}
