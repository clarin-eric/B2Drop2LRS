module.exports = {
	extends: [
		'@nextcloud',
	],
	settings: {
		'import/resolver': {
			alias: {
				map: [
					['@nextcloud/files-v4', './node_modules/@nextcloud/files-v4']
				],
				extensions: ['.js', '.jsx', '.ts', '.tsx']
			}
		}
	}
}
