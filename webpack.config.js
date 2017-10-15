const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

const debug = process.env.NODE_ENV === 'development';
const pathToDist = path.join(__dirname, './app/dist');

const commonPlugins = [
    new CleanWebpackPlugin([pathToDist]),
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
            return module.context && module.context.indexOf('node_modules') !== -1;
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity
    }),
    // new ChunkManifestPlugin({
    //     filename:'chunk-manifest.json',
    //     manifestVariable: 'webpackManifest',
    //     inlineManifest: false
    // })
];
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
    devServer: {
        inline: true,
        open: true,
        contentBase: pathToDist,
        historyApiFallback: {
            index: '/index.html'
        }
    },
    devtool: debug ? 'inline-source-map':'source-map',
    module: {
        rules: [
            {
                test: /\.js|\.jsx$/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(jpg|png|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: debug ? [
        ...commonPlugins,
        new webpack.HotModuleReplacementPlugin()
    ]: [
        ...commonPlugins,
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'node.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
};