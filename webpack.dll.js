const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: [
        'react', 'react-dom'
    ],
    output: {
        filename: 'dll.vendor.js',
        path: path.join(__dirname, 'dll'),
        library: "[name]_[hash]"
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]_[hash]',
            path: path.resolve(__dirname, 'dll', 'manifest.json'),
            context: __dirname
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    ]
};