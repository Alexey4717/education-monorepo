module.exports = {
	plugins: [
		'@stylistic/stylelint-plugin',
		'stylelint-use-logical',
		'stylelint-prettier',
	],
	extends: ['stylelint-config-standard-scss', 'stylelint-config-tailwindcss'],
	rules: {
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: ['use', 'theme'],
			},
		],
		'scss/at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: ['theme'],
			},
		],
		'prettier/prettier': true,
	},
};
