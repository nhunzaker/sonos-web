/**
 * Rest helpers for debugging
 */

const { authenticated } = require("sonos-oauth");
const { sonosClient } = require("networking");
const { SonosError } = require("./sonos-error");

exports.restRoutes = function(app) {
  app.get("/rest/*", authenticated, async (req, res, next) => {
    const sonos = sonosClient(req.user.token);
    const path = req.path.slice("/rest".length);

    try {
      let { data } = await sonos.get(path);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/rest/*", authenticated, async (req, res) => {
    const sonos = sonosClient(req.user.token);
    const path = req.path.slice("/rest".length);

    try {
      let { data } = await sonos.post(path, req.body);
      res.json(data);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        res
          .status(error.response.status)
          .send(new SonosError(error.response.data));
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        throw error.request;
      } else {
        res.status(500).send(error.message);
      }
    }
  });
};
