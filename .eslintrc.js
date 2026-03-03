module.exports = {
	extends: [
		'@nextcloud',
	],
	settings: {
		'import/resolver': {
			webpack: {
				config: 'webpack.js'
			}
		}
	}
}
