const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'main.js',
    },
    mode: 'development',
    devServer: {
        static: path.resolve(__dirname, './dist'),
        compress: true,
        port: 8080,
        open: true,
    },
    module: {
        rules: [
            {
                test: '/\.js$/',
                use: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test:/\.(FBX|jpg|fbx|png)/,
                type: 'asset/resource',
            },
        ]
    },
    
    plugins: [
        new HtmlWebpackPlugin({
            template:'./src/index.html',
        }),
        new CleanWebpackPlugin(),
    ]
}