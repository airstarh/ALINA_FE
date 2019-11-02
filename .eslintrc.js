module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		"plugin:vue/recommended",
		"eslint:recommended",
		"prettier/vue",
		"plugin:prettier/recommended",
		//"prettier"
	],
	rules: {
		"vue/component-name-in-template-casing": ["error", "PascalCase"],
		"no-console": process.env.NODE_ENV === "production" ? "error" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "off" : "off"
	},
	parserOptions: {
		parser: "babel-eslint"
	}
};
