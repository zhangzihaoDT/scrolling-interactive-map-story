# d3-webpack-babel-tutorial

本项目主要借鉴了[如何从零开始为基本网站配置Webpack 4](https://github.com/pixelgoo/simple_webpack_boilerplate) 和[如何使用Webpack和Babel设置D3.js](https://github.com/maecapozzi/d3-webpack-babel-tutorial)构建的。
[webpack官方文档](https://webpack.js.org/guides/development/)

## Install
```
git clone git@github.com:zhangzihaoDT/d3-webpack-babel-tutorial.git your-app # change your-app to the name of your project
cd your-app
git remote remove origin
# edit the package.json, then continue on
npm install
npm start
```
## 实践路径
1.安装Webpack
`npm i --save-dev webpack webpack-cli`

2.创建基本文件
1. src
   - fonts
   - images
   - javascripts
     - index.js
   - sass
     - styles.scss
   - index.html
2. webpack.config.js

3.Loaders
1. babel-loader
`npm i --save-dev babel-loader @babel/core @babel/preset-env`
在webpack.config.js中设置
```
rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
]
```
2.sass-loader
将sass导入javascript/index.js`import '../sass/styles.scss';`
添加解析依赖路径`npm i --save-dev sass sass-loader postcss-loader css-loader`并设置：
```
rules: [
    {
      test: /\.js$/,
      /* ... */
    },
    {
      // Apply rule for .sass, .scss or .css files
      test: /\.(sa|sc|c)ss$/,

      // Set loaders to transform files.
      // Loaders are applying from right to left(!)
      // The first loader will be applied after others
      use: [
             {
               // This loader resolves url() and @imports inside CSS
               loader: "css-loader",
             },
             {
               // Then we apply postCSS fixes like autoprefixer and minifying
               loader: "postcss-loader"
             },
             {
               // First we transform SASS to standard CSS
               loader: "sass-loader"
               options: {
                 implementation: require("sass")
               }
             }
           ]
    }
]
```
设置PostCSS`npm i --save-dev autoprefixer cssnano`和post.config.css
```
// It is handy to not have those transformations while we developing
if(process.env.NODE_ENV === 'production') {
    module.exports = {
        plugins: [
            require('autoprefixer'),
            require('cssnano'),
            // More postCSS modules here if needed
        ]
    }
}
```
压缩插件：MiniCssExtractPlugin`npm i --save-dev mini-css-extract-plugin`，在webpack.config中设置
```
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
```
在`module.rules`后面接上`plugins`
```
module: {
  rules: [
    /* ... */
  ]
},
plugins: [

  new MiniCssExtractPlugin({
    filename: "bundle.css"
  })

]
```
现在我们可以将此插件链接到我们的CSS加载器中：
```
{
      test: /\.(sa|sc|c)ss$/,
      use: [
             {
               // After all CSS loaders we use plugin to do his work.
               // It gets all transformed CSS and extracts it into separate
               // single bundled file
               loader: MiniCssExtractPlugin.loader
             }, 
             {
               loader: "css-loader",
             },
             /* ... Other loaders ... */
           ]
}
```
3.文件类预处理
- images
- fonts
安装`npm i --save-dev file-loader`并更新webpack.config.js

4.输出管理
- 动态生成Html
设置HtmlWebpackPlugin；首先安装插件并调整webpack.config.js文件：`npm install --save-dev html-webpack-plugin`;webpack.config.js
```
 const path = require('path');
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js',
    },
+   plugins: [
+     new HtmlWebpackPlugin({
+       title: 'Output Management',
+     }),
+   ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
```
- 清理Html/dist的缓存
一个流行的插件可以管理它，`clean-webpack-plugin`所以让我们安装和配置它。`npm install --save-dev clean-webpack-plugin` 
webpack.config.js
```
 const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
+ const { CleanWebpackPlugin } = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js',
    },
    plugins: [
+     new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Output Management',
      }),
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
```
5.设置开发环境
- [x] 设置 source map
```
+   devtool: 'inline-source-map',
```
- [ ] 设置 mode:'development'
```
module.exports = {
+   mode: 'development',
    entry: {
      app: './src/index.js',
      print: './src/print.js',
    },
```
- [ ] 设置 webpack-dev-server`npm install --save-dev webpack-dev-server`
更改配置文件，以告知开发服务器在哪里查找文件：
webpack.config.js
```
devtool: 'inline-source-map',
+   devServer: {
+     contentBase: './dist',
+   },
    plugins: [
      // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Development',
      }),
    ],
```
添加一个脚本来轻松地运行开发服务器：
package.json
```
"scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "watch": "webpack --watch",
+     "start": "webpack-dev-server --open",
      "build": "webpack"
    },
```
6.安装d3，并import使用
- `npm install d3`
- 在index.js中设置
```
import * as d3 from 'd3';
const square = d3.selectAll("rect");
square.style("fill", "orange");
```
7.同步项目到git-pages
-将本地项目 push 到远程
```
git init
git add .
git commit -m 'create app'
git remote add origin <git url>
git push -u origin master
```
-添加npm-scripts：
```
"scripts": {
    "gh": "gh-pages -d dist"
}
```
-修改publickPath
```
module.exports = {
    ...
    build: {
        ...
        assetsPublicPath: '', // 此处原来是assetsPublicPath: '/'
        ...
    }
```
-生成生产版本，并部署到Github Page

@octocat :+1: 这个 PR 看起来很棒 - 可以合并了！ :shipit:
