const path                  = require('path');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const {styles}              = require('@ckeditor/ckeditor5-dev-utils');
module.exports              = {
    // Deprecated since Vue CLI 3.3, please use publicPath instead
    //baseUrl: '.',
    //publicPath:            '.',
    publicPath:            '/apps/vue/',
    devServer:             {
        public:           'https://localhost:8082',
        https:            true,
        clientLogLevel:   'error',
        disableHostCheck: true
    },
    // The source of CKEditor is encapsulated in ES6 modules. By default, the code
    // from the node_modules directory is not transpiled, so you must explicitly tell
    // the CLI tools to transpile JavaScript files in all ckeditor5-* modules.
    transpileDependencies: [
        /ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/,
    ],
    configureWebpack:      {
        plugins: [
            // ##################################################// ##################################################
            //region CkEditor Plugin
            // CKEditor needs its own plugin to be built using webpack.
            new CKEditorWebpackPlugin({
                // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
                language: 'en',
                // Additional languages that will be emitted to the `outputDirectory`.
                // This option can be set to an array of language codes or `'all'` to build all found languages.
                // The bundle is optimized for one language when this option is omitted.
                //additionalLanguages:                    ['ru'],
                // Optional directory for emitted translations. Relative to the webpack's output.
                // Defaults to `'translations'`.
                //outputDirectory:                        'translations',
                // Whether the build process should fail if an error occurs.
                // Defaults to `false`.
                //strict:                                 true,
                // Whether to log all warnings to the console.
                // Defaults to `false`.
                //verbose:                                true,
                // addMainLanguageTranslationsToAllAssets: true,
                // buildAllTranslationsToSeparateFiles:    true,
            })
            //endregion CkEditor Plugin
            // ##################################################// ##################################################
        ]
    },
    chainWebpack:          config => {
        // ##################################################// ##################################################
        //region CkEditor
        // Vue CLI would normally use its own loader to load .svg and .css files, however:
        //	1. The icons used by CKEditor must be loaded using raw-loader,
        //	2. The CSS used by CKEditor must be transpiled using PostCSS to load properly.
        // (1.) To handle editor icons, get the default rule for *.svg files first:
        const svgRule = config.module.rule('svg');
        // Then you can either:
        //
        // * clear all loaders for existing 'svg' rule:
        //
        //		svgRule.uses.clear();
        //
        // * or exclude ckeditor directory from node_modules:
        svgRule.exclude.add(path.join(__dirname, 'node_modules', '@ckeditor'));
        // Add an entry for *.svg files belonging to CKEditor. You can either:
        //
        // * modify the existing 'svg' rule:
        //
        //		svgRule.use( 'raw-loader' ).loader( 'raw-loader' );
        //
        // * or add a new one:
        config.module
        .rule('cke-svg')
        .test(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
        .use('raw-loader')
        .loader('raw-loader');
        // (2.) Transpile the .css files imported by the editor using PostCSS.
        // Make sure only the CSS belonging to ckeditor5-* packages is processed this way.
        config.module
        .rule('cke-css')
        .test(/ckeditor5-[^/\\]+[/\\].+\.css$/)
        .use('postcss-loader')
        .loader('postcss-loader')
        .tap(() => {
            return styles.getPostCssConfig({
                themeImporter: {
                    themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
                },
                minify:        true
            });
        });
        //endregion CkEditor
        // ##################################################// ##################################################
        //region vue-svg-loader
        //---svgRule = config.module.rule('svg');
        // очищаем все существующие загрузчики.
        // если вы этого не сделаете, загрузчик ниже будет добавлен
        // к уже существующим загрузчикам для этого правила.
        svgRule.uses.clear();
        // добавляем загрузчик для замены
        svgRule
        .use('vue-svg-loader')
        .loader('vue-svg-loader')
        //endregion vue-svg-loader
        // ##################################################// ##################################################
    }
};
//#####