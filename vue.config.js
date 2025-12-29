const path = require('path');

process.env.VUE_APP_ALINA_INFO = 'Служебная информация';

module.exports = {
    outputDir: process.env.VUE_APP_ALINA_DIST
        ? path.resolve(process.env.VUE_APP_ALINA_DIST)
        : path.resolve(__dirname, 'dist'),
    parallel: false,
    publicPath: process.env.VUE_APP_PUBLIC_PATH || '/apps/vue/',
    productionSourceMap: process.env.NODE_ENV === 'development',

    devServer: {
        host: 'localhost',
        port: 8082,
        https: true,
        clientLogLevel: 'error',
        contentBase: path.join(
            __dirname,
            process.env.VUE_APP_PUBLIC_FOLDER || 'public'
        ),
    },

    pluginOptions: {
        svgSprite: {
            dir: 'src/assets/svg',
            test: /\.(svg)(\?.*)?$/,
            loaderOptions: {
                extract: true,
                filenameHashing: true,
                spriteFilename: 'alina-sprite.[hash:8].svg',
            },
            pluginOptions: {
                plainSprite: false,
            },
        },
    },

    configureWebpack: {
        output: {
            chunkFilename: '[name].[contenthash].js',
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'initial',
                    },
                },
            },
        },
    },

    chainWebpack: (config) => {
        const publicFolder = process.env.VUE_APP_PUBLIC_FOLDER || 'public';
        const outputPath = process.env.VUE_APP_ALINA_DIST
            ? path.resolve(process.env.VUE_APP_ALINA_DIST)
            : path.resolve(__dirname, 'dist');

        // Extend default copy plugin (don't delete it)
        config.plugin('copy').tap((args) => {
            args[0].push({
                from: path.resolve(__dirname, publicFolder),
                to: outputPath,
                toType: 'dir',
            });
            return args;
        });

        // Update HTML template path
        config
            .plugin('html')
            .tap((args) => {
                args[0].template = path.resolve(__dirname, publicFolder, 'index.html');
                return args;
            });
    },
};
