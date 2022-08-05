// TODO: To be removed
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
var HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

module.exports = (env) => ({
  entry: {
    'sdk/index': './src/index.ts',
    'sdk/sdk': './src/zamp/core/index.tsx',
    'demo/merchant': './src/demo/index.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        test: /\.(s(a|c)ss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|ico|svg|gif|ttf)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      }
    ]
  },

  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.ts', '.mjs', '.js', '.tsx']
  },

  plugins: [
    new Dotenv(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: 'head',
      minify: false,
      chunks: ['main'],
      filename: path.join(__dirname, './dist/sdk/index.html'),
      template: path.join(__dirname, './src/sdk/index.html')
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      minify: false,
      chunks: ['main'],
      filename: path.join(__dirname, './dist/demo/custom-recharge/index.html'),
      template: path.join(__dirname, './src/demo/pages/custom-recharge.html')
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      minify: false,
      chunks: ['main'],
      filename: path.join(__dirname, './dist/demo/checkout/index.html'),
      template: path.join(__dirname, './src/demo/pages/checkout.html')
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      minify: false,
      chunks: ['main'],
      filename: path.join(__dirname, './dist/demo/recharge/index.html'),
      template: path.join(__dirname, './src/demo/pages/recharge.html')
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      minify: false,
      chunks: ['main'],
      filename: path.join(__dirname, './dist/demo/damac-checkout/index.html'),
      template: path.join(__dirname, './src/demo/pages/damac-checkout.html')
    }),
    new HtmlWebpackTagsPlugin({
      scripts: [`https://${env}/v1/index.js`],
      usePublicPath: false
    }),
    new CopyPlugin({
      patterns: [
        { from: './public', to: './sdk/public' },
        { from: './src/demo/assets', to: './public' },
        { from: './src/sdk/styles.css', to: './sdk' },
        { from: './src/demo/pages/completed.html', to: './demo/completed/index.html' },
        { from: './src/demo/pages/failed.html', to: './demo/failed/index.html' }
      ]
    })
  ]
});
