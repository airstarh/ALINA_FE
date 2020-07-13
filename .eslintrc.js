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
        "vue/component-name-in-template-casing":       ["error", "PascalCase"],
        "no-debugger":                                 process.env.NODE_ENV === "production" ? "off" : "off",
        "no-unused-vars":                              "off",
        "no-prototype-builtins":                       "off",
        "vue/html-indent":                             "off",
        "vue/max-attributes-per-line":                 "off",
        "vue/attributes-order":                        "off",
        "vue/singleline-html-element-content-newline": "off",
        "vue/attribute-hyphenation":                   "off",
        "vue/no-unused-vars":                          "off",
        " vue/mustache-interpolation-spacin":          "off",
        "vue/no-v-html":                               "off",
        "vue/no-unused-components":                    "off",
        "vue/html-self-closing":                       "off",
        "vue/v-bind-style":                            "off",
        "vue/mustache-interpolation-spacing":          "off",
        "vue/multiline-html-element-content-newline":  "off",
        "vue/order-in-components":                     "off",
        "vue/require-prop-type-constructor":           "off",
        "vue/prop-name-casing":                        "off",
        "vue/no-parsing-error":                        "off",
        "no-cond-assign":                              "off",
        "no-console":                                  "off",
        "vue/html-closing-bracket-newline":            "off",
        "vue/name-property-casing":                    "off",
        "no-empty":                                    "off",
    },
    parserOptions: {
        parser:     "babel-eslint",
        sourceType: "module"
    }
};
