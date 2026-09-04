import { recommended } from '@nextcloud/eslint-config'

export default [
	...recommended,
	{
		ignores: [
			'js/',
			'src/lib/',
		],
	},
]
