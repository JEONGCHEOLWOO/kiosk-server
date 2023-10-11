const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

const BASE_JS = "./src/client/js/";

// const fs = require("fs");
// const jsFiles = fs.readdirSync(BASE_JS).filter((file) => file !== "main.js");

// const entry = jsFiles.reduce((entries, file) => {
//   const entryName = file.replace(".js", "");
//   entries[entryName] = BASE_JS + file;
//   return entries;
// }, {});

module.exports = {
  entry: {
    // ...entry,
    main: BASE_JS + "main",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/client/img/favicon.ico",
          to: "img",
        },
      ],
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
