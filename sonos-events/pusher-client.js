const Pusher = require("pusher");
const config = require("config");

exports.pusher = new Pusher(config.pusher)
