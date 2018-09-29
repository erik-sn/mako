/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const VERSION = require('./package.json').version;
/* eslint-enable */

module.exports = {
  /**
    generate full source maps so errors/debugging
    from minified code can be related back to the
    source code
  */
  devtool: 'source-map',
  entry: ['./src/index.tsx'],
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.min.[hash].js',
    publicPath: '/static/',
  },
  plugins: [
    /**
      set the production flag in the node environment
      variables. This flag tells React to disable warnings
      and generate a compressed, production ready version
      of the library

      https://facebook.github.io/react/docs/optimizing-performance.html#webpack
    */
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        ENVIRONMENT: JSON.stringify('production'),
        // eslint-disable-next-line
        VERSION: JSON.stringify('[hash]'),
        STATIC_URL: JSON.stringify('/static'),
        API_ENDPOINT: JSON.stringify('/api/v1'),
        BASE_URL: JSON.stringify(''),
      },
    }),
    /**
      After the scss/css is processed and bundle generated
      move it to the webpack output directory
    */
    new ExtractTextPlugin({
      filename: 'bundle.min.[hash].css',
      allChunks: true,
    }),
    /**
      Process the output css file - minify, remove comments,
      remove duplicate code
    */
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: { discardComments: { removeAll: true } },
    }),
    /**
      inject the compiled css/js files into the
      index.html file to be served to the user
    */
    new HtmlWebpackPlugin({
      template: 'dist/template.html',
      filename: 'index.html',
    }),
    /**
      display the resulting js bundle with a visualization
      chart in a web browser. This is for checking the size
      of the bundle. Browse to file:///srv/mip/assets/report.html
      in a web browser.
      */
    new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
  ],
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              plugins: ['react-hot-loader/babel'],
            },
          },
          {
            loader: 'ts-loader',
          },
        ],
        include: [path.resolve(__dirname, 'src')],
      },
      {
        test: /\.json$/,
        exclude: /(node_modules)/,
        loader: 'json-loader',
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader'],
        }),
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                data: `$STATIC_URL: ${JSON.stringify(process.env.STATIC_URL)};`,
                includePaths: [require('path').resolve(__dirname, 'node_modules')],
              },
            },
          ],
        }),
      },

      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'file-loader?name=img/[name].[ext]',
      },
    ],
  },
  resolve: {
    extensions: ['*', '.json', '.', '.js', '.jsx', '.ts', '.tsx'],
    alias: { '@': path.resolve(__dirname, 'src') },
  },
};
