const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const pathToDist = path.join(__dirname, 'dist');
const debug = process.env.NODE_ENV == 'development';
console.log(process.env.NODE_ENV);
console.log(debug);


module.exports = {
    entry: {
        main: path.join(__dirname, 'app', 'index.js')
    },
    output: {
        filename: debug ? '[name].js' : '[name].[chunkhash].js',
        path: pathToDist
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, 'app'),
                use: ['babel-loader']
            },
            {
                test: /.\tsx?$/,
                use: ['awesome-typescript-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: ['file-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'app', 'index.html'),
            alwaysWriteToDisk: true
        }),
        new HtmlWebpackHarddiskPlugin({
            output: pathToDist
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function(module){
                return module.context && module.context.indexOf('node_modules') != -1;
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime',
            minChunks: Infinity
        })
    ]
};