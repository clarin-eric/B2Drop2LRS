module.exports = {
	extends: [
		'@nextcloud',
	],
	settings: {
		'import/resolver': {
			'custom-alias': {
				alias: {
					'@nextcloud/files-v4': './node_modules/@nextcloud/files-v4'
				},
				onlyModule: ['@nextcloud/files-v4'],
				extensions: ['.js', '.vue']
			}
		}
	}
}
