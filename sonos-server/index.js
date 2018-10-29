/**
 * Sonos API GraphQL layer
 */

const express = require("express");

const { OAuth, authenticated } = require("sonos-oauth");
const { GraphQLServer } = require("./graphql-server");
const { restRoutes } = require("./rest");

exports.Api = function() {
  const app = express();
  const graphql = new GraphQLServer();

  app.use(OAuth());
  app.use("/api", authenticated);

  graphql.applyMiddleware({ app, path: "/api" });

  restRoutes(app);

  return app;
};
