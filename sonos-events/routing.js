const { toChannel } = require("./channels");
const { pusher } = require("./pusher-client");

exports.router = function router(request, response) {
  // Other fields:
  //
  // id: request.headers["x-sonos-event-seq-id"],
  // household: request.headers["x-sonos-household-id"]

  const targetType = request.headers["x-sonos-target-type"];
  const targetValue = request.headers["x-sonos-target-value"];

  const body = {
    type: request.headers["x-sonos-type"],
    payload: request.body
  };

  const name = toChannel(targetType, targetValue);

  pusher.trigger(name, body.type, request.body);

  // Let Sonos know everything is okay
  response.status(200).send(null);
};
