const webpack = require("webpack");
const path = require("path");
const vuePlugin = require("vue-loader/lib/plugin-webpack4");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDev = process.env.NODE_ENV === "development";

const config = {
  target: "web",
  entry: path.join(__dirname, "src/index.js"),
  output: {
    filename: "[name]-[hash:8].js",
    path: path.join(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.less$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
            options: {
              importLoaders: 2, // 避免 less 的 @import 嵌套调用
              // modules: true, // 开启 css 的模块化打包，不至于造成全局污染
            },
          },
          "less-loader",
          "postcss-loader",
        ],
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.(woff|woff2|eot|otf|ttf)$/,
        use: "file-loader",
      },
      {
        test: /\.(jpg|png|svg|jpeg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name]_[hash].[ext]", // 采用自定义的图片名称
            outputPath: "static/", // 文件打包输出目录
            limit: 10240, // 当图片文件小于 2k 的时候直接打包成为 base64 编码加入到js 文件中，可以减少 http 请求
          },
        },
      },
    ],
  },
  plugins: [
    new vuePlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new htmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./logo.png",
    }),
  ],
  resolve: {
    alias: {
      // 指定模块的版本
      // 默认使用的是 vue.runtime.esm.js 这个版本使用 template 会报错
      // 指定一个没有 runtime 的就不会报错了
      vue: path.join(__dirname, "./node_modules/vue/dist/vue.esm.js"),
      "@": path.join(__dirname, "src"),
    },
  },
};

if (isDev) {
  config.mode = "development";
  config.devtool = "cheap-module-eval-source-map";
  config.optimization = {
    usedExports: true,
  };
  config.devServer = {
    port: 8081,
    host: "127.0.0.1",
    hot: true,
    open: true,
    noInfo: true, // 隐藏编译信息，只显示错误和警告
    hotOnly: true, // 当 Hot Module Replacement 没有生效的时候，也不要自动刷新页面
  };
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
  config.mode = "production";
  config.devtool = "cheap-module-source-map";
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new CleanWebpackPlugin() // 清除原来生成的内容
  );
}

module.exports = config;
