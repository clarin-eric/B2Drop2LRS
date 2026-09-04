import { recommended } from '@nextcloud/eslint-config'

export default [
	...recommended,
	{
		files: ['webpack.js'],
		languageOptions: {
			globals: {
				require: 'readonly',
				module: 'readonly',
				__dirname: 'readonly',
				process: 'readonly',
			},
		},
	},
	{
		ignores: [
			'js/',
			'src/lib/',
		],
	},
]
