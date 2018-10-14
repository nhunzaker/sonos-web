const crypto = require("crypto");
const config = require("config");

const ALGORITHM = "aes-256-ctr";
const KEY = config.get("pusher.decryptSecret")
const IV = crypto.randomBytes(16);

exports.encrypt = function encrypt(text) {
  let cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  let crypted = cipher.update(text, "utf8", "hex");

  crypted += cipher.final("hex");

  return crypted;
};

exports.decrypt = function decrypt(text) {
  let decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
  let dec = decipher.update(text, "hex", "utf8");

  dec += decipher.final("utf8");

  return dec;
};
