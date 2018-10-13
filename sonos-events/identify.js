/**
 * There isn't a great way to identify a user for subscribing/unsubscribing
 * callbacks when Pusher tells us someone has joined/left a room.
 *
 * This method sets up an encrypted user ID for Pusher authentication using
 * a salt of the authentication token.
 */

const { pusher } = require("./pusher-client");
const { subscribe } = require("./subscription");
const { encrypt } = require("./encryption");

function identify(request, response) {
  const { socket_id, channel_name } = request.body;

  var auth = pusher.authenticate(socket_id, channel_name, {
    user_id: encrypt(request.user.token)
  });

  response.send(auth);

  // For the reconnect case, start subscribing to the related channel
  setTimeout(function() {
    subscribe(channel_name, request.user.token);
  }, 1000);
}

module.exports = { identify };
