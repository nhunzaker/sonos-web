/**
 * We should be good citizens with the Sonos API. It was graciously given
 * to us.
 *
 * So only subscribe to callbacks when we have them, and delete them when
 * no-one cares.
 */

const { fromChannel } = require("./channels");
const axios = require("axios");

export function subscription(request, response) {
  const { time, events } = request.body;

  console.log("----------------------------------")
  console.dir(request.body, { colors: true });
  console.log("----------------------------------")

  response.status(204).send();
}

function processEvent({ name, channel }) {
  const { object, id } = fromChannel(channel).split("-");

  // https://pusher.com/docs/webhooks#channel-existence
  switch (name) {
    case "channel_existence":
      break;
    case "channel_vacated":
      break;
  }
}
