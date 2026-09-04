const webpackConfig = require('@nextcloud/webpack-vue-config')
const path = require('path')
/* eslint no-useless-escape: 0 */
const WebpackShellPluginNext = require('webpack-shell-plugin-next')

webpackConfig.plugins.push(new WebpackShellPluginNext({
	onBuildStart: {
		scripts: [

			'VERSION="${GITHUB_REF##*/}";\
				if [ -n "${VERSION}" ];\
				then\
					echo "Github ref exists -> updating App version number to: "${VERSION}"";\
					NEW_INFO=$(sed -E "s/<version>[0-9]{1,3}\.[0-9]{1,3}(\.[0-9]{1,3})?(-(alpha|beta|RC|dev)[0-9]*)?<\\/version>/<version>${VERSION}<\\/version>/g" appinfo/info.xml);\
					echo "$NEW_INFO" > appinfo/info.xml;\
					cat appinfo/info.xml;\
				else\
					echo "No Github ref -> using HEAD version";\
				fi',
		],
		blocking: true,
		parallel: false,
	},
}))

webpackConfig.entry = {
	main: path.resolve(path.join('src', 'main.js')),
	switchboardpopuplocal: path.resolve(path.join('src', 'lib/switchboardpopuplocal.js')),
}

module.exports = webpackConfig
