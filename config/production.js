const path = require("path");

// Environment variables configured on deploy
const env = process.env

module.exports = {
  hostname: env.HOSTNAME,
  port: env.PORT,
  secret: env.COOKIE_SECRET,
  isProduction: env.NODE_ENV === "production",
  // Populate these credentials by creating a Sonos controller app:
  // https://integration.sonos.com/integrations
  sonos: {
    clientId: env.SONOS_CLIENT_ID,
    clientSecret: env.SONOS_CLIENT_SECRET,
    authCallbackPath: env.SONOS_AUTH_CALLBACK,
    eventCallbackPath: env.SONOS_EVENT_CALLBACK
  },
  // Populate these credentials by creating a Pusher app:
  // https://pusher.com/docs/javascript_quick_start
  pusher: {
    appId: env.PUSHER_APP_ID,
    key: env.PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    cluster: env.PUSHER_CLUSTER,
    encrypted: true,
    presenceCallbackPath: env.PUSHER_PRESENCE_CALLBACK,
    authCallbackPath: env.PUSHER_AUTH_CALLBACK,
    decryptSecret: env.PUSHER_DECRYPT_SECRET
  }
};
