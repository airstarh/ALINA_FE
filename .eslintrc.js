module.exports = {
	root:          true,
	env:           {
		node: true
	},
	extends:       ["plugin:vue/essential", "@vue/prettier"],
	rules:         {
		"no-console":      process.env.NODE_ENV === "production" ? "error" : "off",
		"no-debugger":     process.env.NODE_ENV === "production" ? "error" : "off",
		"space-unary-ops": "off",
		"no-multi-spaces": "off",
		"indent":          ["error", "tab"],
	},
	parserOptions: {
		parser: "babel-eslint"
	}
};
