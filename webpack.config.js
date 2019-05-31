// 由于 webpack 是基于Node进行构建的，所有，webpack的配置文件中，任何合法的Node代码都是支持的
const path = require('path')
// 启用热更新的 第2步
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')//Vue Loader v15 现在需要配合一个 webpack 插件才能正确使用：
// 导入在内存中生成 HTML 页面的 插件
// 只要是插件，都一定要 放到 plugins 节点中去
// 这个插件的两个作用：
//  1. 自动在内存中根据指定页面生成一个内存的页面
//  2. 自动，把打包好的 bundle.js 追加到页面中去
// 如果要配置插件，需要在导出的对象中，挂载一个 plugins 节点
const htmlWebpackPlugin = require('html-webpack-plugin')

// 这个配置文件，其实就是一个 JS 文件，通过 Node 中的模块操作，向外暴露了一个 配置对象
// 当以命令行形式运行webpack或webpack-dev-server的时候，工具会发现，并没有提供要打包的文件的入口和出口文件，
// 此时，他会检查项目根目录中的配置文件，并读取这个文件，就拿到了导出的这个 配置对象，然后根据这个对象，进行打包构建
module.exports = {
    mode: "development",
    // 在配置文件中，需要手动指定 入口 和 出口
    entry: path.join(__dirname, './src/index.js'), // 入口，表示，要使用 webpack 打包哪个文件
    output: { // 输出文件相关的配置
        path: path.join(__dirname, './dist'), // 指定打包好的文件输出到哪个目录中去
        filename: 'bundle.js' // 这是指定 输出的文件的名称
    },
    devServer: { // 这是配置 dev-server 命令参数的第二种形式，相对来说，这种方式麻烦一些
        //  --open --port 3000 --contentBase src --hot
        // open: true, // 自动打开浏览器
        port: 5000, // 设置启动时候的运行端口
        contentBase: './', // 指定托管的根目录
        hot: true // 启用热更新 的 第1步
    },
    plugins: [ // 配置插件的节点
        new webpack.HotModuleReplacementPlugin(), // new 一个热更新的 模块对象， 这是 启用热更新的第 3 步
        new htmlWebpackPlugin({ // 创建一个 在内存中 生成 HTML  页面的插件
            // 指定 模板页面，将来会根据指定的页面路径，去生成内存中的 页面
            template: path.join(__dirname, './src/index.html'),
            filename: 'index.html' // 指定生成的内存页面的名称
        }),
        new VueLoaderPlugin()
    ],
    module: { // 这个节点，用于配置 所有 第三方模块 加载器 
        rules: [ // 所有第三方模块的 匹配规则
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }, //  配置处理 .css 文件的第三方loader 规则
            { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] }, //配置处理 .less 文件的第三方 loader 规则
            { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] }, // 配置处理 .scss 文件的 第三方 loader 规则
            { test: /\.(jpg|png|gif|bmp|jpeg)$/, use: 'url-loader?limit=7631&name=[hash:8]-[name].[ext]' }, // 处理 图片路径的 loader
            // limit 给定的值，是图片的大小，单位是 byte， 如果我们引用的 图片，大于或等于给定的 limit值，则不会被转为base64格式的字符串， 
            // 如果 图片小于给定的 limit 值，则会被转为 base64的字符串
            // name=[hash:8]-[name].[ext] 保留图片名字，并在前面加8位哈希值，如果不加哈希值的话，两个文件夹里有相同名字的图片，会冲突覆盖
            { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader' }, // 处理 字体文件的 loader 
            { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }, // 配置 Babel 来转换高级的ES语法
            { test: /\.vue$/, use: 'vue-loader' } // 处理 .vue 文件的 loader
        ]
    },
    resolve: {
        alias: { // 修改 Vue 被导入时包的路径
            "vue$": "vue/dist/vue.js"
        }
    }
}

// 当我们在 控制台，直接输入 npx webpack 命令执行的时候，webpack 做了以下几步：
//  1. 首先，webpack 发现，我们并没有通过命令的形式，给它指定入口和出口
//  2. webpack 就会去 项目的 根目录中，查找一个叫做 `webpack.config.js` 的配置文件
//  3. 当找到配置文件后，webpack 会去解析执行这个 配置文件，当解析执行完配置文件后，就得到了 配置文件中，导出的配置对象
//  4. 当 webpack 拿到 配置对象后，就拿到了 配置对象中，指定的 入口  和 出口，然后进行打包构建；