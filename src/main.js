import { generateOcsUrl, generateFilePath } from '@nextcloud/router'
import { DefaultType, FileAction, FileType, Permission, registerFileAction } from '@nextcloud/files'
import { emit } from '@nextcloud/event-bus'

const appid = 'switchboardbridge'
const nextcloudVersionIsGreaterThanOr28 = parseInt(OC.config.version.split('.')[0]) >= 28

function formatDateToString(date) {
	// Force utc time. Drop time information to be timezone-less
	const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
	// Format to YYYY-MM-DD
	return utcDate.toISOString().split('T')[0]
}

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
						//file.fileid = response.ocs.data.file_target
						emit('files:node:updated', file)
						//const fileid = response.ocs.data.file_source

						//OCA.Sharing.Util._updateFileActionIcon(filePath.$file, false, true)
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
		displayName: () => t('Open in Language Resource Switchboard', 'Switchboard'),
		default: DefaultType.DEFAULT,
		enabled: (nodes) => {
			if (nodes.length !== 1) {
				return false
			}
			const node = nodes[0]
			return node.type === FileType.File && (node.permissions & Permission.READ)
		},
		//iconSvgInline() {return CogPlay},
		iconSvgInline: () => '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-cog-clockwise" viewBox="0 0 24 24"><path d="M12 3C7.03 3 3 7.03 3 12S7.03 21 12 21C14 21 15.92 20.34 17.5 19.14L16.06 17.7C14.87 18.54 13.45 19 12 19C8.13 19 5 15.87 5 12S8.13 5 12 5 19 8.13 19 12H16L20 16L24 12H21C21 7.03 16.97 3 12 3M7.71 13.16C7.62 13.23 7.59 13.35 7.64 13.45L8.54 15C8.6 15.12 8.72 15.12 8.82 15.12L9.95 14.67C10.19 14.83 10.44 14.97 10.7 15.09L10.88 16.28C10.9 16.39 11 16.47 11.1 16.47H12.9C13 16.5 13.11 16.41 13.13 16.3L13.31 15.12C13.58 15 13.84 14.85 14.07 14.67L15.19 15.12C15.3 15.16 15.42 15.11 15.47 15L16.37 13.5C16.42 13.38 16.39 13.26 16.31 13.19L15.31 12.45C15.34 12.15 15.34 11.85 15.31 11.55L16.31 10.79C16.4 10.72 16.42 10.61 16.37 10.5L15.47 8.95C15.41 8.85 15.3 8.81 15.19 8.85L14.07 9.3C13.83 9.13 13.57 9 13.3 8.88L13.13 7.69C13.11 7.58 13 7.5 12.9 7.5H11.14C11.04 7.5 10.95 7.57 10.93 7.67L10.76 8.85C10.5 8.97 10.23 9.12 10 9.3L8.85 8.88C8.74 8.84 8.61 8.89 8.56 9L7.65 10.5C7.6 10.62 7.63 10.74 7.71 10.81L8.71 11.55C8.69 11.7 8.69 11.85 8.71 12C8.7 12.15 8.7 12.3 8.71 12.45L7.71 13.19M12 13.5H12C11.16 13.5 10.5 12.82 10.5 12C10.5 11.17 11.17 10.5 12 10.5S13.5 11.17 13.5 12 12.83 13.5 12 13.5" /></svg>',
		async exec(file) {
			try {
				handleClick(file)
			} catch (e) {
					// Do nothing if the user cancels
			}
		},
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
					handleClick(path)
				},
			})
		},
	}
}
