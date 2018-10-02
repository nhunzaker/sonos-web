const crypto = require("crypto");
const { urlsafeEncode64 } = require("text/lib/text");

/**
 * Player information comes in the form of subscription callbacks.
 * Every callback contents should be verified. This function produces
 * that verification.
 *
 * See https://developer.sonos.com/build/direct-control/connect/
 */
exports.verify = function verify(request, response, next) {
  let values = [
    request.headers["x-sonos-event-seq-id"],
    request.headers["x-sonos-namespace"],
    request.headers["x-sonos-type"],
    request.headers["x-sonos-target-type"],
    request.headers["x-sonos-target-value"],
    request.app.get("clientId"),
    request.app.get("clientSecret")
  ].join("");

  let sha = crypto.createHash("sha256");

  sha.update(values);

  if (signature(sha) !== request.headers["x-sonos-event-signature"]) {
    response.send("Digest mismatch", 422);
  } else {
    next();
  }
};

/**
 * Sonos signatures have no padding; "=" at the end of a base64 encoded
 * signatures. It must be removed from our signatures.
 */
function noPadding(base64String) {
  return base64String.replace(/=*$/, "");
}

/**
 * NodeJS digests are not URL safe. As far as I can find, we have to
 * pull in a library for it.
 */
function signature(sha) {
  return noPadding(urlsafeEncode64(sha.digest("latin1")));
}
