/**
 * Bridge between Pusher and Sonos to propagate state updates
 * to clients.
 */

const express = require("express");

const { OAuth, authenticated } = require("sonos-oauth");
const { pusherAuth } = require("./pusher-auth");
const { pusherCallback } = require("./pusher-callback");
const { sonosCallback } = require("./sonos-callback");

exports.Events = function() {
  const events = express();

  events.use(OAuth());
  events.use(sonosCallback());
  events.use(pusherAuth());
  events.use(pusherCallback());

  return events;
};
