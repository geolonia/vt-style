const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src", "vt-style.ts"),
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "vt-style.min.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public", to: "" }],
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "docs"),
    compress: true,
    port: 9000,
    open: true,
  },
};
