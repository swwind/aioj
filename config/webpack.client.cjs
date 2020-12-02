const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

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
    }, {
      test: /\.(png|jpe?g)$/,
      loader: 'file-loader',
    }, {
      test: /\.less$/,
      use: [
        MiniCssExtractPlugin.loader,
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
    new ManifestPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
}