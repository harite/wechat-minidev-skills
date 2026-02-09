const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'game.js',
    path: path.resolve(__dirname, 'dist/miniprogram'),
    clean: false,
    environment: {
      arrowFunction: false,
      const: false
    }
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: path.resolve(__dirname, 'build/logger-transform-loader.js'),
            options: {
              // 启用needLog检查以提升性能(避免不必要的参数计算)
              enableNeedLogCheck: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __GAME_NAME__: JSON.stringify(require('./package.json').name),
      __GAME_VERSION__: JSON.stringify(require('./package.json').version),
      __BUILD_TIME__: JSON.stringify(new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }))
    })
  ],
  optimization: {
    usedExports: true
  },
  ignoreWarnings: [
    {
      module: /weapp-adapter/
    }
  ]
};
