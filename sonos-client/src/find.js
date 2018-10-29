export function first(list) {
  return list[0];
}

export function firstPlaying(list, stateKey = "playbackState") {
  return list.find(item => item.isPlaying) || first(list);
}

export function firstById(list, id) {
  return list.find(item => item.id == id) || first(list);
}

export function firstByIdOrPlaying(list, id) {
  return list.find(item => item.id == id) || firstPlaying(list);
}
