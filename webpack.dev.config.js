const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: {
        main: ['@babel/polyfill', './chatbox/index.js']
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    mode: 'development',
    devtool: 'inline-sourcemap',
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            components: path.resolve(__dirname, 'chatbox/components/'),
            assets: path.resolve(__dirname, 'assets/'),
            contexts: path.resolve(__dirname, 'chatbox/contexts/')
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            disable: true
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
            // {
            //     test: /\.scss$/,
            //     use: ExtractTextPlugin.extract({
            //         fallback: 'style-loader',
            //         use: [
            //             {
            //                 loader: 'css-loader',
            //                 options: {
            //                     modules: true,
            //                     importLoaders: 1,
            //                     localIdentName: '[hash:base64:10]',
            //                     sourceMap: false
            //                 }
            //             },
            //             {
            //                 loader: 'postcss-loader',
            //                 options: {
            //                     config: {
            //                         path: `${__dirname}/postcss.config.js`
            //                     }
            //                 }
            //             }
            //         ]
            //     })
            // }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Esmae Chat App',
            filename: 'chat.html',
            inject: false,
            hash: true,
            template: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css'
        }),
        new WebpackMd5Hash(),
        new CleanWebpackPlugin('dist', {})
        // new ExtractTextPlugin({
        //     filename: 'style.[hash].css',
        //     disable: false,
        //     allChunks: true
        // })
        // new CopyWebpackPlugin([
        //     {
        //         to: 'assets/images/',
        //         from: './assets/images/',
        //         toType: 'dir'
        //     }
        // ]),
    ]
}
