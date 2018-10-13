const { fromChannel, toChannel } = require("../channels");

test("converts back and forth underscores", () => {
  let object = "group";
  let type = "playback";
  let id = "RINCON_949F3E8E862401400:3923752931";

  let channel = toChannel(object, type, id);
  let back = fromChannel(channel);

  expect(back.object).toBe(object);
  expect(back.type).toBe(type);
  expect(back.id).toBe(id);
});

test("converts back and forth dashes", () => {
  let object = "group";
  let type = "playback";
  let id = "RINCON-949F3E8E862401400:3923752931";

  let channel = toChannel(object, type, id);
  let back = fromChannel(channel);

  expect(back.object).toBe(object);
  expect(back.type).toBe(type);
  expect(back.id).toBe(id);
});
