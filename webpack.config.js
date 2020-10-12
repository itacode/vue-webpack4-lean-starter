const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const config = {
    entry: {
      main: './src/app/main.js',
    },
    output: {
      filename: 'js/app.[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.vue$/,
          use: 'vue-loader',
        },
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: (file) =>
            /node_modules/.test(file) && !/\.vue\.js/.test(file),
        },
        {
          test: /\.css$/,
          use: [
            argv.mode !== 'production'
              ? 'vue-style-loader'
              : {
                  loader: MiniCssExtractPlugin.loader,
                  options: { esModule: false },
                },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                // needed after updating to css-loader 4.0.0 (default changed to true)
                esModule: false,
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.scss$/,
          use: [
            argv.mode !== 'production'
              ? 'vue-style-loader'
              : {
                  loader: MiniCssExtractPlugin.loader,
                  options: { esModule: false },
                },
            {
              loader: 'css-loader',
              options: {
                // needed after updating to css-loader 4.0.0 (default changed to true)
                esModule: false,
              },
            },
            'postcss-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        },
      ],
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js',
      },
    },
    plugins: [new VueLoaderPlugin()],
    devtool: 'source-map', // enum
    devServer: {
      contentBase: './src',
      // When starting server via the CLI with --watch-content-base
      watchOptions: {
        ignored: ['**/*.scss'],
      },
      hot: true,
      host: process.env.HOST, // Defaults to `localhost`
      port: process.env.PORT, // Defaults to 8080
      stats: 'minimal',
      overlay: true,
    },
  };

  if (argv.mode === 'development') {
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
      })
    );
  }

  if (argv.mode === 'production') {
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'css/app.[name].bundle.css',
      }),
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: 'src',
            globOptions: {
              ignore: ['**/app/**', '**/*.scss', '**/index.html'],
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
      })
    );
  }

  return config;
};
