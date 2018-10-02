const { pusher } = require('sonos-server/config');

const Pusher = require("pusher");

const client = new Pusher({
  appId: pusher.appId,
  key: pusher.key,
  secret: pusher.secret,
  cluster: "us2",
  encrypted: true
});

function toChannel(string) {
  return Buffer.from(string).toString("base64");
}

exports.router = function router(request, response) {
  // Let Sonos know everything is okay
  response.status(200).send(null);

  const body = {
    id: request.headers["x-sonos-event-seq-id"],
    type: request.headers["x-sonos-type"],
    targetType: request.headers["x-sonos-target-type"],
    targetValue: request.headers["x-sonos-target-value"],
    household: request.headers["x-sonos-household-id"],
    payload: request.body
  };

  // Pusher doesn't allow ':' in names, so we base64 encode it
  const name = toChannel(`${body.targetType}-${body.targetValue}`);

  console.log("PUSH", body.type, name);

  client.trigger(name, body.type, request.body);
};
