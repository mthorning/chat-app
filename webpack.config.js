const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const workboxPlugin = require("workbox-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const prod = process.env.PRODUCTION;
console.log(`Building in ${prod ? "production" : "development"} mode`);
const env = prod ? "dist" : "dev";

const mode = prod ? "production" : "development";
const devtool = prod ? false : "eval-source-map";

module.exports = {
  entry: {
    main: ["@babel/polyfill", "./chatbox/index.js"],
  },
  output: {
    filename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "build/" + env),
    publicPath: "/",
  },
  mode,
  devtool,
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      components: path.resolve(__dirname, "chatbox/components/"),
      assets: path.resolve(__dirname, "assets/"),
      contexts: path.resolve(__dirname, "chatbox/contexts/"),
      hooks: path.resolve(__dirname, "chatbox/hooks/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              disabled: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Esmae Chat App",
      filename: "index.html",
      inject: false,
      hash: true,
      template: "index.html",
    }),
    new workboxPlugin.GenerateSW({
      swDest: "sw.js",
      clientsClaim: true,
      skipWaiting: true,
    }),
    new MiniCssExtractPlugin({
      filename: "style.[contenthash].css",
    }),
    new CopyPlugin([
      { from: "manifest.json", to: "manifest.json" },
      { from: "icons", to: "icons" },
    ]),
    new WebpackMd5Hash(),
  ],
};
