const isProd = process.env.NODE_ENV === "production";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CompressionPlugin = require('compression-webpack-plugin');

const ROOT_DIR = path.resolve(__dirname);
const SRC_DIR = path.resolve(ROOT_DIR, "src");
const config = {
  mode: "development",
  devtool: "source-map",
  entry: {
    index: './src/index.tsx',
  },
  output: {
    filename: "[name]-[contenthash:8].js",
    chunkFilename: "[name]-[contenthash:8].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },

  resolve: {
    extensions: [".js", ".ts", ".tsx", ".scss", ".css", ".jsx"],
    modules: ["node_modules"],
  },
  optimization: {
    chunkIds: 'total-size',
    runtimeChunk: "single",
    minimize: true,
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace("@", "")}`;
          },
        },
      },
    },
    usedExports: true,
    minimizer: [
      // new TerserPlugin({
      //   extractComments: false,
      //   terserOptions: { sourceMap: false },
      // }),
      // new UglifyJsPlugin({
      //   cache: true,
      //   parallel: true
      // })
      // new HtmlMinimizerPlugin(),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "DropEngine",
      favicon: "./src/favicon.ico",
      template: path.resolve(__dirname, "./src/index.html"), // template file
      filename: "index.html", // output file
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new webpack.HotModuleReplacementPlugin(),

  ],
  module: {
    rules: [
      {
        // this is so that we can compile any React,
        // ES6 and above into normal ES5 syntax
        test: /\.(ts|js)x?$/,
        // we do not want anything from node_modules to be compiled
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(css|scss|sass)$/i,
        use: [
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)/,
        loader: "ignore-loader",
      },

      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg|ico)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
      {
        test: /\.(txt|md)$/i,
        use: "raw-loader",
      },
    ],
  },
  devServer: {

  },
};

// config.devServer = {
//   client: {
//     progress: true,
//     reconnect: true,
//     overlay: {
//       errors: false, warnings: false
//     }
//   },
//   hot: true,
//   port: 3001,
//   compress: true
// };


module.exports = config;
