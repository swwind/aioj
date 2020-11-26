const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const rootdir = path.dirname(__dirname);

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(rootdir, 'dist'),
    filename: '[name].js',
  },
  externals: {
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
    'element-plus': 'ElementPlus',
  },
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
        'style-loader',
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