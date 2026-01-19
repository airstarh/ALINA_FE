// vetur.config.js
module.exports = {
    settings: {
        'vetur.experimental.templateInterpolationService': true,
        'vetur.validation.template': true
    },
    projects: [
        {
            root: './',
            package: './package.json',
            tsconfig: './tsconfig.json',
            // Map aliases for HTML attributes
            aliases: {
                '@': 'src'
            }
        }
    ]
};
