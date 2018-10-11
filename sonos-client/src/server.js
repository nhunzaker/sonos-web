import express from "express";
import morgan from "morgan";
import { Store } from "svelte/store.js";
import { Api, authenticated } from "sonos-server";
import { Events } from "../../sonos-events";
import { port, sonos, domain, pusher } from "config";
import * as sapper from "../__sapper__/server.js";

const app = express();

const sapperMiddleware = sapper.middleware({
  store: request => {
    return new Store({
      Cookie: request.headers.cookie,
      pusher: {
        key: pusher.key,
        cluster: pusher.cluster,
        authCallback: pusher.authCallbackPath
      }
    });
  }
});

app.use(morgan("dev"));

app.use(express.static("static"));

app.use(Api());

app.use(Events(sonos, pusher));

app.use(authenticated, sapperMiddleware);

app.listen(port, err => {
  if (err) {
    throw err;
  }
});
