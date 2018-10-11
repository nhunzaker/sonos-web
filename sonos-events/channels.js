// Pusher doesn't allow ':' in names, so we base64 encode it

export function toChannel(type, id) {
  return 'presence-' + Buffer.from(`${type}_${id}`).toString("base64");
}

export function fromChannel(string) {
  const [namespace, data] = string.split("-", 2);

  const [object, id] = Buffer.from(data, "base64")
    .toString()
    .split("_", 2);

  return { object, id };
}
