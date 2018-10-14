const webpack = require("webpack");
const config = require("sapper/config/webpack.js");
const pkg = require("./package.json");
const serverConfig = require("config");
const mode = process.env.NODE_ENV;
const dev = mode === "development";

module.exports = {
  client: {
    entry: config.client.entry(),
    output: config.client.output(),
    resolve: {
      extensions: [".js", ".json", ".html"],
      mainFields: ["svelte", "module", "browser", "main"]
    },
    module: {
      rules: [
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: "graphql-tag/loader"
        },
        {
          test: /\.html$/,
          use: {
            loader: "svelte-loader",
            options: {
              dev,
              hydratable: true,
              hotReload: true
            }
          }
        }
      ]
    },
    mode,
    plugins: [
      dev && new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
        "process.env.PUSHER_KEY": JSON.stringify(serverConfig.get("pusher.key"))
      })
    ].filter(Boolean),
    devtool: dev && "inline-source-map"
  },

  server: {
    entry: config.server.entry(),
    output: config.server.output(),
    target: "node",
    resolve: {
      extensions: [".js", ".json", ".html"],
      mainFields: ["svelte", "main"]
    },
    externals: [
      "express",
      "helmet",
      "morgan",
      "encoding",
      "node-gyp-build",
      "pusher",
      "sonos-server",
      "sonos-oauth",
      "sonos-events",
      "config"
    ],
    module: {
      rules: [
        {
          test: /\.html$/,
          use: {
            loader: "svelte-loader",
            options: {
              css: false,
              generate: "ssr",
              dev
            }
          }
        }
      ]
    },
    mode: process.env.NODE_ENV,
    performance: {
      hints: false // it doesn't matter if server.js is large
    }
  },

  serviceworker: {
    entry: config.serviceworker.entry(),
    output: config.serviceworker.output(),
    mode: process.env.NODE_ENV
  }
};
