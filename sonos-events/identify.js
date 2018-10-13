/**
 * There isn't a great way to identify a user for subscribing/unsubscribing
 * callbacks when Pusher tells us someone has joined/left a room.
 *
 * This method sets up an encrypted user ID for Pusher authentication using
 * a salt of the authentication token.
 */

const { pusher } = require("./pusher-client");

const crypto = require("crypto");
const config = require("config");

const algorithm = "aes-256-ctr";
const password = config.pusher.decryptSecret;

function identify(request, response) {
  const { socket_id, channel_name } = request.body;

  var auth = pusher.authenticate(socket_id, channel_name, {
    user_id: encrypt(request.user.token)
  });

  response.send(auth);
}

function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, "utf8", "hex");

  crypted += cipher.final("hex");

  return crypted;
}

function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, "hex", "utf8");

  dec += decipher.final("utf8");

  return dec;
}

module.exports = { identify, encrypt, decrypt };
