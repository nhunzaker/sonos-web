/**
 * We should be good citizens with the Sonos API. It was graciously given
 * to us.
 *
 * So only subscribe to callbacks when we have them, and delete them when
 * no-one cares.
 */

const { sonosClient } = require("networking");

const { pusher } = require("./pusher-client");
const { fromChannel } = require("./channels");
const { decrypt } = require("./identify");

export function subscription(request, response) {
  // TODO: This is important because we need to run a checksum
  // to verify the contents, but express doesn't support request.rawBody
  // with the body-parser module :(
  //  const webhook = pusher.webhook(request)
  //
  // if (webhook.isValid() === false) {
  //   response.status(422).send();
  //   return
  // }
  response.status(204).send();

  const { time, events } = request.body;

  for (let event of events) {
    switch (event.name) {
      case "member_added":
        subscribe(event);
        break;
      case "member_removed":
        unsubscribe(event);
        break;
    }
  }
}

async function subscribe(event) {
  const { object, id, type } = fromChannel(event.channel);

  const client = sonosClient(decrypt(event.user_id));
  const url = subscriptionUrl(object, id, type);

  try {
    await client.post(url);
    console.log("Subscribed to %s", url);
  } catch (error) {
    console.log("Unable to subscribe to %s. %s.", url, error.message);
  }
}

async function unsubscribe(event) {
  const { object, id, type } = fromChannel(event.channel);

  const client = sonosClient(decrypt(event.user_id));
  const url = subscriptionUrl(object, id, type);

  try {
    await client.delete(url);
    console.log("Unsubscribed from %s", url);
  } catch (error) {
    console.log("Unable to unsubscribe from %s. %s.", url, error.message);
  }
}

function subscriptionUrl(object, id, type) {
  return `/${mapObject(object)}/${id}/${mapType(type)}/subscription`;
}

function mapObject(object) {
  switch (object) {
    case "groupId":
      return "groups";
    case "playerId":
      return "players";
    case "householdId":
      return "households";
    default:
      return object.replace(/Id%/, s);
  }

  return object;
}

function mapType(type) {
  switch (type) {
    case "metadataStatus":
      return "playbackMetadata";
    case "playbackStatus":
      return "playback";
    default:
      return type.replace(/Status$/, "");
  }
}
