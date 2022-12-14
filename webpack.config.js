/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EslintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

const config = {
    entry: path.resolve(__dirname, './src/index'),
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.ts$/i,
                use: 'ts-loader',
            },
            {
                test: /\.(svg|png|jpe?g|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: './assets/[hash][ext]',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, './dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/template.html'),
            filename: 'index.html',
        }),
        new CleanWebpackPlugin(),
        new EslintPlugin({ extensions: 'ts' }),
    ],
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';

        config.plugins.push(
            new MiniCssExtractPlugin({
                filename: '[name].css',
            })
        );
    } else {
        config.mode = 'development';
    }
    return config;
};
