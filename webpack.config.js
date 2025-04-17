const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
  mode: "development",
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
        { from: "/src/manifest.json", to: "manifest.json" },
        { from: "/src/popup/popup.html", to: "popup.html" },
        { from: "/src/popup/popup.css", to: "popup.css" },
        { from: "/src/images", to: "images" },
      ],
    }),
  ],
};
