import { generateOcsUrl } from '@nextcloud/router'
import { FileAction, FileType, File, Permission, registerFileAction, davGetDefaultPropfind } from '@nextcloud/files'
import { getClient, resultToNode } from '@nextcloud/files/dav'
import { emit } from '@nextcloud/event-bus'

const nextcloudVersionIsGreaterThanOr28 = parseInt(OC.config.version.split('.')[0]) >= 28
const switchboardBase = 'https://switchboard.clarin.eu/'

// Get the DAV client for the default remote
const client = getClient()

/**
 * Helper function to open a publicly shared resource in the Switchboard using a new browser tab
 *
 * @param {string} resourceURI the URI of the resource to open in the Switchboard
 */
function openInSwitchboard(resourceURI) {
	const data = {
		origin: 'nc-switchboard-bridge',
		url: resourceURI,
	}
	const form = document.createElement('form')
	form.target = '_blank'
	form.method = 'POST'
	form.action = switchboardBase
	form.enctype = 'multipart/form-data'
	form.style.display = 'none'

	for (const key in data) {
		const input = document.createElement('input')
		input.type = 'hidden'
		input.name = key
		input.value = data[key]
		form.appendChild(input)
	}
	document.body.appendChild(form)
	form.submit()
	document.body.removeChild(form)
}

/**
 * Helper function to get a resource public share link (if existing)
 *
 * @param {File} resource file to get the share link of
 */
async function getResourcePublicLink(resource) {
	const url = generateOcsUrl('apps/files_sharing/api/v1/', 4)
		+ 'shares'
		+ '?format=json'
		+ '&path=' + resource.path
		+ '&reshares=true'

	try {
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'OCS-APIREQUEST': 'true',
				requestoken: OC.requestToken,
			},
		})

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`)
		}

		const json = await response.json()
		const data = json.ocs.data
		let shareOfInterest
		for (let i = 0; i < data.length; i++) {
			if (data[i].share_type === 3) { // a shared link
				shareOfInterest = data[i]
			}
		}
		return shareOfInterest.url
	} catch (error) {
		console.error(error.message)
	}
}

/**
 * Helper function to share a resource file pubicly and return its share link
 *
 * @param {File} resource file to share
 */
async function shareResourcePublicly(resource) {
	const shareUrl = generateOcsUrl('/apps/files_sharing/api/v1/shares')
	const data = {
		path: resource.path,
		shareType: 3, // public link
		permissions: 1, // read
	}

	try {
		const response = await fetch(shareUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				Accept: 'application/json, text/javascript',
				'OCS-APIREQUEST': true,
				requestoken: OC.requestToken,
			},
			body: JSON.stringify(data),
		})
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`)
		}

		client.stat(resource.data.attributes.filename, {
			details: true,
			data: davGetDefaultPropfind(),
		}).then((result) => {
			// Refresh files list
			const node = resultToNode(result.data)
			emit('files:node:updated', node)
			// Refresh tab if open
			const file = OCA.Files.Sidebar.state.file
			if (file.length > 0) {
				OCA.Files.Sidebar.close()
				OCA.Files.Sidebar.open(file)
			}
		})

		const json = await response.json()

		return json.ocs.data.url
	} catch (error) {
		console.error(error.message)
	}
}

/**
 * Handle click on 'Switchboard' option in the file context menu.
 *
 * @param {File} resource file for which the Switchboard is being called
 */
async function handleClick(resource) {
	let resourceURI
	let shareType = resource.data.attributes['share-types']['share-type']

	if (!Array.isArray(shareType)) {
		shareType = [shareType]
	}

	if (shareType.some((value) => value === 3)) {
		resourceURI = await getResourcePublicLink(resource)
	} else {
		// There is currently no public share for the selected file
		// -> ask the user if it is OK to create it
		let createShare = false
		await OC.dialogs.confirmHtml(
			'<p>In order to open the resource in the CLARIN Language Resource Switchboard, the resource must first be sharred publicly via a link.</p><br/><p> Do you really want to publicly share this file?</p>',
			'Create public share link for file?',
			(decision) => {
				if (!decision) {
					return
				}
				createShare = decision
			}, false)
		if (createShare !== true) {
			return
		}

		// We have OK from the user -> create public share link for resource
		resourceURI = await shareResourcePublicly(resource)
	}

	openInSwitchboard(resourceURI + '/download')
}

export const openSwitchboardAction = new FileAction({
	id: 'switchboardbridge-action',
	title(nodes) {
		return 'Open file with CLARIN Language Resource Switchboard'
	},
	displayName: () => 'Switchboard',
	enabled: (nodes) => {
		if (nodes.length >= 1) {
			return !nodes.some(node => node.type === FileType.Folder) && nodes.every(node => node.permissions & Permission.READ)
		}
		return false
	},
	iconSvgInline: () => '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-cog" viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" /></svg>',
	async exec(node, view, dir) {
		try {
			await handleClick(node)
		} catch (e) {
			// Do nothing if the user cancels
		}
		return true
	},
	async execBatch(nodes, view, dir) {
		try {
			for await (const node of nodes) {
			 handleClick(node)
			}
		} catch (e) {
			// Do nothing if the user cancels
		}
		return Promise.all(nodes.map(node => true))
	},
	inline: () => false,
	order: 22,
})

if (nextcloudVersionIsGreaterThanOr28) {
	registerFileAction(openSwitchboardAction)
} else {
	OCA.SwitchboardBridge = OCA.SwitchboardBridge || {}
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
	OC.Plugins.register('OCA.Files.FileList', OCA.SwitchboardBridge.Util)
}
