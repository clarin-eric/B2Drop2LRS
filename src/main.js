import { generateOcsUrl } from '@nextcloud/router'
import { DefaultType, FileAction, FileType, File, Permission, registerFileAction } from '@nextcloud/files'
import { emit } from '@nextcloud/event-bus'

const appid = 'switchboardbridge'
const nextcloudVersionIsGreaterThanOr28 = parseInt(OC.config.version.split('.')[0]) >= 28

/**
 * Handle click on 'Switchboard' option in the file context menu.
 *
 * @param {File} file for which the Switchboard is being called
 */
function handleClick(file) {
	const filePath = file.path
	// console.log(fileName, path, path.dir);
	// use REST API to get the share link for the resource in question
	const xhr = new XMLHttpRequest()
	const url = generateOcsUrl('apps/files_sharing/api/v1/', 4)
		+ 'shares'
		+ '?format=json'
		+ '&path=' + filePath
		+ '&reshares=true'
	// console.log('url', url);
	// console.log('url', path.$file);
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
				const xhr = new XMLHttpRequest()
				const data = {
					path: filePath,
					shareType: 3, // public link
					permissions: 27, // just replicating what pushing the add icon in the UI does...
				}

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
						// file.fileid = response.ocs.data.file_target
						emit('files_sharing:share:created', file)
						// const fileid = response.ocs.data.file_source

						// OCA.Sharing.Util._updateFileActionIcon(file, false, true)
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
}
OCA.SwitchboardBridge = OCA.SwitchboardBridge || {}
if (nextcloudVersionIsGreaterThanOr28) {
	registerFileAction(new FileAction({
		id: appid,
		displayName: () => 'Switchboard',
		default: DefaultType.DEFAULT,
		enabled: (nodes) => {
			if (nodes.length !== 1) {
				return false
			}
			const node = nodes[0]
			return node.type === FileType.File && (node.permissions & Permission.READ)
		},
		iconSvgInline: () => '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-cog" viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" /></svg>',
		async exec(file, view, dir) {
			try {
				handleClick(file)
			} catch (e) {
				// Do nothing if the user cancels
			}
			return true
		},
		inline: () => false,
		order: 22,
	}))
} else {
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
					handleClick(filePath)
				},
			})
		},
	}
}

OC.Plugins.register('OCA.Files.FileList', OCA.SwitchboardBridge.Util)
