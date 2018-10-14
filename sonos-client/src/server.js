import express from "express";
import morgan from "morgan";
import config from "config";
import helmet from "helmet";
import { Store } from "svelte/store.js";

import { Api } from "sonos-server";
import { authenticated } from "sonos-oauth";
import { Events } from "sonos-events";

import * as sapper from "../__sapper__/server.js";

const sonos = config.get("sonos");
const hostname = config.get("hostname");
const pusher = config.get("pusher");

const app = express();

const sapperMiddleware = sapper.middleware({
  store: request => {
    const store = new Store({
      pusher: {
        key: pusher.key,
        cluster: pusher.cluster,
        authCallback: pusher.authCallbackPath
      }
    });

    // We need to pass the cookie but don't want to serialize it
    store.cookie = request.headers.cookie;

    return store;
  }
});

// Before enabling this, I need to figure out why cookies are required
// to serve main content.
// app.use(helmet());

app.use(morgan("dev"));

app.use(express.static("static"));

app.use(Events());

app.use(Api());

app.use(authenticated, sapperMiddleware);

app.listen(config.get("port"), error => {
  if (error) {
    throw error;
  }
});
