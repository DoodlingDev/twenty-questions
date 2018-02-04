const path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: "./public/index.html",
    filename: "index.html",
    inject: "body",
  });

module.exports = {
  entry: ["babel-polyfill", "./public/example.js"],
  target: "web",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "lib"),
  },
  module: {
    loaders: [
      {
        test: /.js/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    watchOptions: {
      aggregateTimeout: 600,
      poll: 1000,
      ignored: /node_modules/,
    },
  },
  plugins: [HtmlWebpackPluginConfig],
  resolve: {
    modules: [path.resolve("./src"), path.resolve("./node_modules")],
  },
};
