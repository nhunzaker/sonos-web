const axios = require("axios");
const { ApolloServer } = require("apollo-server-express");

const app = require("./server");
const config = require("./config");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const loaders = require("./loaders");
const { SonosError } = require("./sonos-error");

exports.authenticated = require("./oauth").ensureAuthenticated;

exports.Api = function() {
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    graphiql: true,
    context({ req }) {
      const sonos = axios.create({
        baseURL: "https://api.ws.sonos.com/control/api/v1",
        headers: {
          Authorization: `Bearer ${req.user.token}`
        }
      });

      return { sonos, loaders: loaders(sonos) };
    }
  });

  apollo.applyMiddleware({ app, path: "/api" });

  /**
   * This is pretty hacky, but a great way to test Sonos API endpoints
   */
  app.get("/rest/*", exports.authenticated, async (req, res, next) => {
    const sonos = axios.create({
      baseURL: "https://api.ws.sonos.com/control/api/v1",
      headers: {
        Authorization: `Bearer ${req.user.token}`
      }
    });

    let path = req.path.slice("/rest".length);

    try {
      let { data } = await sonos.get(path);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/rest/*", exports.authenticated, async (req, res) => {
    const sonos = axios.create({
      baseURL: "https://api.ws.sonos.com/control/api/v1",
      headers: {
        Authorization: `Bearer ${req.user.token}`
      }
    });

    let path = req.path.slice("/rest".length);

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

  return app;
};
