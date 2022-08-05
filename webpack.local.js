// TODO: To be removed
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackWatchPlugin = require('webpack-watch-files-plugin').default;
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const WebpackDevServer = require("webpack-dev-server");

const common = {
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|ico|svg|gif|ttf)?$/,
        use: 'file-loader'
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      }
    ]
  },

  mode: 'development',
  devtool: 'source-map',
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.ts', '.js', '.tsx']
  }
};

const config = [{
  entry: {
    'index': './src/index.ts',
    'merchant': './src/demo/index.js'
  },
  output: {
    filename: '[name].js'
  },
  ...common,
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: './src/demo/pages/custom-recharge.html',
      inject: 'head',
      scriptLoading: 'blocking',
      filename: 'custom-recharge'
    }),
    new HtmlWebpackPlugin({
      template: './src/demo/pages/recharge.html',
      inject: 'head',
      scriptLoading: 'blocking',
      filename: 'recharge'
    }),
    new HtmlWebpackPlugin({
      template: './src/demo/pages/checkout.html',
      inject: 'head',
      scriptLoading: 'blocking',
      filename: 'checkout'
    }),
    new HtmlWebpackPlugin({
      template: './src/demo/pages/completed.html',
      inject: 'head',
      scriptLoading: 'blocking',
      filename: 'completed'
    }),
    new HtmlWebpackPlugin({
      template: './src/demo/pages/failed.html',
      inject: 'head',
      scriptLoading: 'blocking',
      filename: 'failed'
    }),
    new HtmlWebpackPlugin({
      template: './src/demo/pages/damac-checkout.html',
      inject: 'head',
      scriptLoading: 'blocking',
      filename: 'damac-checkout'
    }),
    new CopyPlugin({
      patterns: [
        { from: './public', to: './public' },
        { from: './src/demo/assets', to: './public' }
      ]
    }),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackWatchPlugin({
      files: [path.resolve(__dirname, './src/index.ts')],
      verbose: true
    })
  ]
}, {
  entry: {
    'index': './src/zamp/core/index.tsx'
  },
  output: {
    filename: '[name].js'
  },
  ...common,
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: './src/sdk/index.html',
      inject: 'head',
      scriptLoading: 'blocking'
    }),
    new CopyPlugin({
      patterns: [
        { from: './public', to: './public' },
        { from: './src/demo/assets', to: './public' },
        { from: './src/sdk/styles.css', to: './' },
        { from: './src/demo/pages/completed.html', to: './demo' },
        { from: './src/demo/pages/failed.html', to: './demo' }
      ]
    }),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackWatchPlugin({
      files: [path.resolve(__dirname, './src/zamp/core/index.tsx')],
      verbose: true
    })
  ]
}];

const compiler = webpack(config);

const server1 = new WebpackDevServer(compiler.compilers[0], {
  contentBase: __dirname,
  hot: true,
  historyApiFallback: false,
  compress: false
});

const server2 = new WebpackDevServer(compiler.compilers[1], {
  contentBase: __dirname,
  hot: true,
  historyApiFallback: false,
  compress: false
});

server1.listen(4000);
server2.listen(5000);
