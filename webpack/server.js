const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const rootdir = path.dirname(__dirname);

module.exports = {
  entry: './index.ts',
  target: 'node',
  output: {
    path: path.resolve(rootdir, 'build'),
    filename: '[name].js',
  },
  experiments: {
    topLevelAwait: true,
  },
  externals: [
    nodeExternals(),
    ({ context, request }, callback) => {
      if (request.endsWith('/build/ssr/js/app.js')) {
        return callback(null, 'commonjs ' + request);
      }

      callback();
    }
  ],
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
    }]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({ configFile: path.resolve(rootdir, 'tsconfig.json') })
    ],
  },
  optimization: {
    minimize: false,
  }
}
