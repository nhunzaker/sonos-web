const { encrypt, decrypt } = require("../encryption");

jest.mock("config", () => {
  const { randomBytes } = require("crypto");

  let map = new Map();

  map.set("pusher.decryptSecret", randomBytes(16).toString('hex'))

  return map
});

test("is reproduceable", function() {
  expect(decrypt(encrypt("test"))).toBe("test");
});
