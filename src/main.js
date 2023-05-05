import { generateOcsUrl } from '@nextcloud/router'

(function() {

	OCA.SwitchboardBridge = OCA.SwitchboardBridge || {}

	/**
	 * @namespace
	 */
	OCA.SwitchboardBridge.Util = {
		/**
		 * Initialize the switchboardbridge plugin.
		 *
		 * @param {OCA.Files.FileList} fileList file list to be extended
		 */
		attach(fileList) {
			if (fileList.id === 'trashbin' || fileList.id === 'files.public') {
				return
			}
			const fileActions = fileList.fileActions

			fileActions.registerAction({
				name: 'SWITCHBOARD',
				displayName: 'Switchboard',
				mime: 'all',
				permissions: OC.PERMISSION_READ,
				iconClass: 'icon-settings-dark',
				actionHandler(fileName, path) {
					// console.log(fileName, path, path.dir);
					let filePath = path.dir + '/' + fileName
					filePath = filePath.replace('//', '/')
					// use REST API to get the share link for the resource in question
					const xhr = new XMLHttpRequest()
					const url = generateOcsUrl('apps/files_sharing/api/v1/', 4)
						+ 'shares'
						+ '?format=json'
						+ '&path=' + filePath
						+ '&reshares=true'
					// console.log('url', url);
					xhr.open('GET', url, true)
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
					xhr.setRequestHeader('OCS-APIREQUEST', true)
					xhr.setRequestHeader('requestoken', OC.requestToken)
					xhr.onload = function() {
						if (this.status >= 200 && this.status < 300) {
							const jsonResponse = JSON.parse(this.response)

							// to be configured to global switchboard server, see  "<?php p($_['switchboard_baseurl']) ?>");
							const switchboardBase = '//switchboard.clarin.eu/#/b2drop/'

							// first, check whether we have a shared link
							const data = jsonResponse.ocs.data
							// console.log('jsonResponse', jsonResponse, data)
							let shareOfInterest
							for (let i = 0; i < data.length; i++) {
								if (data[i].share_type === 3) { // a shared link
									shareOfInterest = data[i]
									// console.log('share', shareOfInterest)
								}
							}
							// call the switchboard when there is a shared link, otherwise alert the user
							if (shareOfInterest === undefined) {
								const url = '/ocs/v2.php/apps/files_sharing/api/v1/shares?format=json'
								const data = {
									path: filePath,
									shareType: 3, // public link
									permissions: 27, // just replicating what pushing the add icon in the UI does...
								}
								const xhr = new XMLHttpRequest()
								xhr.open('POST', url, true)
								xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
								xhr.setRequestHeader('Accept', 'application/json, text/javascript')
								xhr.setRequestHeader('OCS-APIREQUEST', true)
								xhr.setRequestHeader('requestToken', OC.requestToken)
								xhr.onload = function(data) {
									if (this.status >= 200 && this.status < 300) {
										const response = JSON.parse(this.response)
										const fileLink = response.ocs.data.url + '/download'
									    const clrsCall = switchboardBase + encodeURIComponent(fileLink)
									    // console.log('clrsCall/share', clrsCall)
										window.open(clrsCall, '_blank')
										OCA.Sharing.Util._updateFileActionIcon(path.$file, false, true)
									}
								}
								xhr.send(JSON.stringify(data))

							} else {
								const fileLink = shareOfInterest.url + '/download'
							    const clrsCall = switchboardBase + encodeURIComponent(fileLink)
								// console.log('clrsCall/noshare', clrsCall)
								window.open(clrsCall, '_blank')
								window.focus()
							}
						} else {
							// console.log('XMLHttpRequest: Error in uploading document!', xhr.response, xhr.status)
						}
					}
					xhr.send()
				},
			})
		},
	}

})()

OC.Plugins.register('OCA.Files.FileList', OCA.SwitchboardBridge.Util)
