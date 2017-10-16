const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJs = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AddHtmlAssetPlugin = require('add-asset-html-webpack-plugin');

const pathToDist = path.join(__dirname, 'dist');

module.exports = merge(common, {
    devtool: 'source-map',
    plugins: [
        new CleanWebpackPlugin([pathToDist]),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./dll/manifest.json')
        }),
        new AddHtmlAssetPlugin({
            filepath: path.join(__dirname, 'dll', 'dll.vendor.js'),
            includeSourcemap: false,
            hash: true
        }),
        new UglifyJs({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
});