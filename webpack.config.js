/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const slsw = require("serverless-webpack");

const isLocal = slsw.lib.webpack.isLocal;

module.exports = {
  mode: isLocal ? "development" : "production",
  devtool: isLocal ? "source-map" : false,
  entry: slsw.lib.entries,
  target: "node",
  resolve: {
    alias: {
      lib: path.resolve(__dirname, "src/lib/"),
    },
    extensions: [".mjs", ".ts", ".js"],
  },
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
    ],
  },
  externals: {
    bufferutil: "bufferutil",
    "utf-8-validate": "utf-8-validate",
  },
};
