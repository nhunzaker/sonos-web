const { toChannel } = require("./channels");
const { pusher } = require("./pusher-client");

exports.router = function router(request, response) {
  // Other fields:
  //
  // id: request.headers["x-sonos-event-seq-id"],
  // household: request.headers["x-sonos-household-id"]

  const object = request.headers["x-sonos-target-type"];
  const type = request.headers["x-sonos-type"];
  const id = request.headers["x-sonos-target-value"];

  const name = toChannel(object, type, id);

  pusher.trigger(name, "update", request.body);

  // Let Sonos know everything is okay
  response.status(200).send(null);
};
