const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        inline: true,
        open: true,
        contentBase: path.join(__dirname, 'dist')
    }
});