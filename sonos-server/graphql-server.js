const { ApolloServer } = require("apollo-server-express");
const { sonosClient } = require("networking");

const loaders = require("./loaders");
const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");

class GraphQLServer extends ApolloServer {
  constructor() {
    super({
      typeDefs,
      resolvers,
      graphiql: true,
      context: buildContext
    });
  }
}

function buildContext({ req }) {
  const sonos = sonosClient(req.user.token);

  return {
    sonos,
    loaders: loaders(sonos)
  };
}

module.exports = { GraphQLServer };
