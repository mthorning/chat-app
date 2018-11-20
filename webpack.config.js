const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const prod = process.env.PRODUCTION
console.log(`Building in ${prod ? 'production' : 'development'} mode`)
const env = prod ? 'dist' : 'dev'

const mode = prod ? 'production' : 'development'
const devtool = prod ? 'inline-sourcemap' : false

let optimization
if (prod) {
    // optimization = {
    //     minimizer: [
    //         new UglifyJsPlugin({
    //             test: /\.js(\?.*)?$/i,
    //             parallel: true,
    //             cache: true,
    //             uglifyOptions: {
    //                 compress: true,
    //                 output: {
    //                     comments: false
    //                 }
    //             }
    //         })
    //     ]
    // }
    //UglifyPlugin doesn't work with React Hooks atm.
}
module.exports = {
    entry: {
        main: ['@babel/polyfill', './chatbox/index.js']
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'build/' + env),
        publicPath: '/'
    },
    mode,
    devtool,
    optimization,
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
                            disabled: true
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
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Esmae Chat App',
            filename: 'index.html',
            inject: false,
            hash: true,
            template: 'index.html'
        }),
        new HtmlWebpackPlugin({
            title: 'login',
            filename: 'login.html',
            inject: false,
            hash: true,
            template: './login/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css'
        }),
        new WebpackMd5Hash()
    ]
}
