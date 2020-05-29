module.exports = {
    root:          true,
    env:           {
        node:    true,
        browser: true
    },
    extends:       [
        "plugin:vue/recommended",
        "eslint:recommended",
        // "prettier/vue",
        // "plugin:prettier/recommended",
        // "prettier"
    ],
    rules:         {
        "vue/component-name-in-template-casing": ["error", "PascalCase"],
        "no-console":                            process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger":                           process.env.NODE_ENV === "production" ? "off" : "off",
        "no-unused-vars":                        "off",
    },
    parserOptions: {
        parser:     "babel-eslint",
        sourceType: "module"
    }
};
