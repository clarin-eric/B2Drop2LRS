const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const webpackConfig = require('@nextcloud/webpack-vue-config')

webpackConfig.plugins.push(
    new WebpackShellPluginNext({
      onBuildStart:{
        scripts: [
            'VERSION="${GITHUB_REF##*/}";\
            if [ -n "VERSION" ];\
            then\
                echo "Github ref exists -> updating App version number to: "${VERSION}"";\
                NEW_INFO=$(sed -E "s/<version>[0-9]{1,3}\.[0-9]{1,3}(\.[0-9]{1,3})?<\\/version>/<version>${VERSION}<\\/version>/g" appinfo/info.xml);\
                echo "$NEW_INFO" > appinfo/info.xml;\
            else\
                echo "No Github ref -> using HEAD version";\
            fi'
        ],
        blocking: true,
        parallel: false
      }
    })
) 

module.exports = webpackConfig
