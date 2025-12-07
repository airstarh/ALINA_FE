const path = require('path');

process.env.VUE_APP_ALINA_INFO = 'Служебная информация';

module.exports = {
    outputDir: path.resolve(process.env.VUE_APP_ALINA_DIST),
    parallel: false,
    publicPath: '/apps/vue/',
    devServer: {
        public: 'https://localhost:8082',
        https: true,
        clientLogLevel: 'error',
        disableHostCheck: true,
        contentBase: path.join(__dirname, process.env.VUE_APP_PUBLIC_FOLDER),
    },
    pluginOptions: {
        // ##################################################
        //region vue-cli-plugin-svg-sprite
        svgSprite: {
            /**
             * The directory containing your SVG files.
             */
            dir: 'src/assets/svg',
            /**
             * The regex that will be used for the Webpack rule.
             */
            test: /\.(svg)(\?.*)?$/,
            /**
             * @see https://github.com/kisenka/svg-sprite-loader#configuration
             */
            loaderOptions: {
                extract: true,
                filenameHashing: false, //spriteFilename:  'img/icons.[hash:8].svg' // or 'img/icons.svg' if filenameHashing == false
                spriteFilename: 'alina-sprite.svg',
            },
            /**
             * @see https://github.com/kisenka/svg-sprite-loader#configuration
             */
            pluginOptions: {
                plainSprite: false
            }
        }
        //endregion vue-cli-plugin-svg-sprite
        // ##################################################
    },
    // #####
    configureWebpack: {
        plugins: []
    },
    chainWebpack: config => {
        // ##################################################// ##################################################
        // region vue-svg-loader
        //---svgRule = config.module.rule('svg');
        // очищаем все существующие загрузчики.
        // если вы этого не сделаете, загрузчик ниже будет добавлен
        // к уже существующим загрузчикам для этого правила.
        //--svgRule.uses.clear();
        // добавляем загрузчик для замены
        // svgRule
        // .use('babel-loader')
        // .loader('babel-loader')
        // .end()
        // .use('vue-svg-loader')
        // .loader('vue-svg-loader');
        // endregion vue-svg-loader
        // ##################################################// ##################################################
        // region vue-cli-plugin-svg-sprite
        config.module
            .rule('svg-sprite')
            .use('svgo-loader')
            .loader('svgo-loader');
        // endregion vue-cli-plugin-svg-sprite
        // ##################################################// ##################################################
        // region PUBLIC
        // Set public folder based on environment variable

        // Remove the default copy plugin
        config.plugins.delete('copy');

        // Add custom copy plugin
        config.plugin('copy')
            .use(require('copy-webpack-plugin'), [[{
                from: path.resolve(__dirname, process.env.VUE_APP_PUBLIC_FOLDER),
                to: path.resolve(process.env.VUE_APP_ALINA_DIST),
                toType: 'dir',
                // ignore: ['.*']
            }]]);

        config
            .plugin('html')
            .tap(args => {
                args[0].template = path.resolve(__dirname, process.env.VUE_APP_PUBLIC_FOLDER, 'index.html');
                return args;
            });
        // endregion PUBLIC
        // ##################################################// ##################################################
    }
};
//#####