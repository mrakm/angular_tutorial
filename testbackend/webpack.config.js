const path = require("path");
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');

const config = {
    optimization: {
        minimize: true
    },
    entry: {
        index: "./src/index.ts",
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: ['ts-loader', ]
        }]
    },
    externals: [nodeExternals()],
    plugins: [
        new WebpackShellPlugin({
            onBuildEnd: ['npm run run:dev']
        }),

    ]

}

module.exports = (env, argv) => {

    if (argv.mode === 'development') {
        config.watch = true;
        config.watchOptions = {
            ignored: /uploads/
        }
    }

    if (argv.mode === 'production') {
        config.plugins[0].options.onBuildEnd = ['npm run:prod']
    }

    return config;
};