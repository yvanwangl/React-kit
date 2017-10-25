const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const pathToDist = path.join(__dirname, '../webapp/dist');
let entries = {};
let chunks = ['en-US', 'zh-Hans-CN','index'];
chunks.map(filename=> entries[filename] = path.join(__dirname, 'src', `${filename}.js`));

module.exports = {
    entry: entries,
    output: {
        path: pathToDist,
        filename: '[name].[chunkhash].js',
        publicPath: '/agent-web/dist/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader'
                }],
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                }),
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                }),
                include: /node_modules/
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract(['css-loader', 'less-loader'])
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash].[ext]'
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([pathToDist], {
                root: path.resolve(__dirname , '..'),
                verbose: true
            }
        ),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de|zh-cn/),
        new ExtractTextPlugin("css/[name].[chunkhash].css"),
        new OptimizeCssPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        new BundleAnalyzerPlugin({
            // Can be `server`, `static` or `disabled`.
            // In `server` mode analyzer will start HTTP server to show bundle report.
            // In `static` mode single HTML file with bundle report will be generated.
            // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
            analyzerMode: 'server',
            // Host that will be used in `server` mode to start HTTP server.
            analyzerHost: '127.0.0.1',
            // Port that will be used in `server` mode to start HTTP server.
            analyzerPort: 8888,
            // Path to bundle report file that will be generated in `static` mode.
            // Relative to bundles output directory.
            reportFilename: 'report.html',
            // Module sizes to show in report by default.
            // Should be one of `stat`, `parsed` or `gzip`.
            // See "Definitions" section for more information.
            defaultSizes: 'parsed',
            // Automatically open report in default browser
            openAnalyzer: true,
            // If `true`, Webpack Stats JSON file will be generated in bundles output directory
            generateStatsFile: false,
            // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
            // Relative to bundles output directory.
            statsFilename: 'stats.json',
            // Options for `stats.toJson()` method.
            // For example you can exclude sources of your modules from stats file with `source: false` option.
            // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
            statsOptions: null,
            // Log level. Can be 'info', 'warn', 'error' or 'silent'.
            logLevel: 'info'
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
            filename: 'index.html',
            chunks: ['runtime', 'vendor', ...chunks],
            chunksSortMode: 'manual',
            excludeChunks: ['zh-Hans-CN']
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index-zh.html'),
            filename: 'index-zh.html',
            chunks: ['runtime', 'vendor', ...chunks],
            chunksSortMode: 'manual',
            excludeChunks: ['en-US']
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DefinePlugin({ // <-- key to reducing React's size
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function(module){
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime',
            minChunks: Infinity
        })
    ]
};
