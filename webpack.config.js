const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    path.resolve(__dirname, 'src/ts/index.ts')
  ],
  devtool: 'inline-source-map',
  watch: true,

  resolve: {
    extensions: ['.ts', '.js'],
  },

  output: {
    filename: 'js/index.js',
    path: path.resolve(__dirname, 'dist'),
  },

  devServer: {
    writeToDisk: true
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        output: {
          comments: false,
        },
      },
      extractComments: false,
    }), new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: {
        map: {
          inline: true
        }
      }
    })],
  },

  /* plugins: [
    new MiniCssExtractPlugin({
      filename: "css/app.css",
      chunkFilename: "[id].css"
    })
  ], */

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      /* {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
        exclude: /node_modules/
      } */
    ],
  },
};
