// Pusher doesn't allow ':' in names, so we base64 encode it

const DELIMETER = "-";

function toChannel(object, type, id) {
  return (
    "presence-" +
    Buffer.from([object, type, id].join(DELIMETER)).toString("base64")
  );
}

function fromChannel(string) {
  const [namespace, data] = string.split(DELIMETER, 2);

  const normalized = Buffer.from(data, "base64").toString();

  const [object, type, ...id] = normalized.split(DELIMETER);

  return { object, type, id: id.join(DELIMETER) };
}

module.exports = { toChannel, fromChannel };
