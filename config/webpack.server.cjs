const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
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
    nodeExternals()
  ],
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
      options: {
        appendTsSuffixTo: [/\.vue$/]
      }
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          less: 'vue-style-loader!css-loader!less-loader',
        }
      }
    }, {
      test: /\.(png|jpe?g)$/,
      loader: 'file-loader',
    }, {
      test: /\.less$/,
      use: [
        'vue-style-loader',
        'css-loader',
        'less-loader'
      ]
    }]
  },
  resolve: {
    extensions: ['.ts', '.vue', '.js'],
    plugins: [
      new TsconfigPathsPlugin({ configFile: path.resolve(rootdir, 'tsconfig.json') })
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
  ]
}