export const playbackStatus = groupId =>
  "presence-" + btoa(`groupId-playbackStatus-${groupId}`);

export const metadataStatus = groupId =>
  "presence-" + btoa(`groupId-metadataStatus-${groupId}`);
