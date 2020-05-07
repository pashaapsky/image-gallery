const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

require('babel-polyfill');

module.exports = {
  // папка main файла .js
  entry: ['babel-polyfill', './src/index.js'],

  // папка куда собираем и название файла
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },

  // правила для модулей
  module: {
    rules: [
      // создание новой html страницы
      {
        test: /\.(html)$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },

      // транспиляция babel + файл .babelrc
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },

      // экспорт файлов .css привязанных к index.js через import или link
      {
        test: /\.css$/,
        use: [
          // MiniCssExtractPlugin.loader,  //создает общий файл стилей css
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'img',
        },
      },

    ],
  },
  plugins: [
    // плагин для создания новой html страницы
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),

    // плагин для создания нового общего css файла из всех
    // new MiniCssExtractPlugin(),
  ],
  // стартовая папка webpack-dev-server
  devServer: {
    historyApiFallback: true,
  },
};
