import { Store } from "svelte/store.js";
import * as sapper from "../__sapper__/client.js";

sapper.start({
  target: document.querySelector("#layout"),
  store: state => {
    return new Store({
      ...state,
      socket: new Pusher(state.pusher.key, {
        cluster: state.pusher.cluster,
        authEndpoint: state.pusher.authCallback
      })
    });
  }
});
