const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    background: path.resolve(__dirname, "./src/background.js"),
    content: path.resolve(__dirname, "./src/scripts/content.js"),
    popup: path.resolve(__dirname, "./src/popup/popup.js"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js",
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/manifest.json"),
          to: "manifest.json",
        },
        {
          from: path.resolve(__dirname, "src/popup"),
          to: "popup",
        },
        { from: path.resolve(__dirname, "src/sidepanel"), to: "sidepanel" },
        { from: path.resolve(__dirname, "src/assets"), to: "assets" },
      ],
    }),
  ],
};
