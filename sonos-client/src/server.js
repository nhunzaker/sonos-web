import express from "express";
import morgan from "morgan";
import { Store } from "svelte/store.js";
import { Api } from "sonos-server";
import { Events } from "sonos-events";
import { port, sonos, domain, pusher } from "sonos-server/config";
import * as sapper from "../__sapper__/server.js";

const app = express();

app.use(morgan("dev"));

app.use(express.static("static"));

app.use(Api());

app.use(Events(sonos, pusher));

app.use(
  sapper.middleware({
    store: request => {
      return new Store({
        Cookie: request.headers.cookie,
        pusher: {
          key: pusher.key,
          cluster: pusher.cluster,
          forceTLS: pusher.encrypted
        }
      });
    }
  })
);

app.listen(port, err => {
  if (err) {
    throw err;
  }
});
