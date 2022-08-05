/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

module.exports = (env) => ({
  entry: {
    'index': './src/sdk/index.ts'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      library: 'zamp-sdk',
      libraryTarget: 'umd'
  },

  mode: env.environment || 'development',

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
        test: /\.s(c|a)ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|ico|svg|gif|ttf)?$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.ts', '.js', '.tsx']
  },
  plugins: [
    new Dotenv(),
    new CleanWebpackPlugin(),
    new MergeIntoSingleFilePlugin({
      files: {
        'types/index.d.ts': [
          path.resolve(__dirname, 'src/types/index.ts')
        ]
      }
    }),
    new CopyPlugin({
      patterns: [
        { from: './public', to: './public' }
      ]
    })
  ]
});
