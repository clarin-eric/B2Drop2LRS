import { generateOcsUrl } from '@nextcloud/router'
import { FileAction, FileType, File, Permission, registerFileAction } from '@nextcloud/files'
import { loadState } from '@nextcloud/initial-state'
import { subscribe } from '@nextcloud/event-bus'
import axios from '@nextcloud/axios'
/* global setSwitchboardURL, showSwitchboardPopup */

const nextcloudVersionIsGreaterThanOr28 = parseInt(OC.config.version.split('.')[0]) >= 28
const switchboardDefaultUrl = 'https://switchboard.clarin.eu'

let switchboardUrl = loadState('switchboardbridge', 'switchboard_url')
let useSwitchboardPopUp = loadState('switchboardbridge', 'use_switchboard_popup') === '1'
let isSwitchboardUrlDirty = false

/**
 * Helper function to open a resource using the Switchboard pop-up on an iframe.
 * See: https://github.com/clarin-eric/switchboard-doc/blob/master/documentation/IntegrationProvider.md#1-integrated-switchboard-popup
 *
 * @param {string} resourceURI the URI of the resource to open in the Switchboard
 * @param {string} mime the media type of the resource
 */
function openInSwitchboardPopUp(resourceURI, mime = '') {
	setSwitchboardURL(switchboardUrl)
	showSwitchboardPopup(
		{ alignSelector: 'button[title^="Size"]', alignRight: true },
		{ url: resourceURI, mimetype: mime },
	)
}

/**
 * Helper function to open a resource in the Switchboard using a new browser tab
 *
 * @param {string} resourceURI the URI of the resource to open in the Switchboard
 * @param {string} mime the mimetpe of the resource to open in the Switchboard (optional)
 */
function openInSwitchboard(resourceURI, mime = '') {
	const data = {
		origin: 'nc-switchboard-bridge',
		url: resourceURI,
		mimetype: mime,
	}
	const form = document.createElement('form')
	form.target = '_blank'
	form.method = 'POST'

	// If the user reconfigured the Switchboard URL in the files' settings modal, we cannot directly
	// call the Swtichbord as this would be prevented by the CSP. Despite the new CSP being already
	// active on the server side, the browser did not go through any location change at his point, so
	// it is still not aware of the new CSP. In this case the hop to the Switchbord via the redirect2switchboard
	// route
	form.action = isSwitchboardUrlDirty ? '/apps/switchboardbridge/redirect2switchboard' : switchboardUrl
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
 * Handler for when the user update the Switchboard server URL via the file settings menu
 *
 * @param {Event} event The event to handle
 */
function sbUrlChanged(event) {
	switchboardUrl = event.newUrl
	isSwitchboardUrlDirty = true

	// if using popup, we need to reload the page immediately for the browser to be aware of the new CSP
	if (useSwitchboardPopUp) {
		alert('When changing the Switchboard URL while using the Switchboard pop-up it is necessary to reload the page for the new URL to take effect')
		window.location.reload()
	}
}

/**
 * Handler for when the user update the toggle to use the Switchboard pop-up
 *
 * @param {Event} event The event to handle
 */
function usePopUpToggled(event) {
	useSwitchboardPopUp = !useSwitchboardPopUp

	// When enabling the Switchboard pop-up for the first time on a session, we still do not have the popUp JS code
	// so we reload the page immediately for the browser to fetch it
	if (useSwitchboardPopUp && (typeof window.setSwitchboardURL === 'undefined' || isSwitchboardUrlDirty)) {
		alert('When enabling the Switchboard pop-up for the first time on a session, it is necessary to reload the page for the pop-up to be available')
		window.location.reload()
	}
}

/**
 * Helper function to generate a temporary public share link
 * see:
 * https://docs.nextcloud.com/server/30/developer_manual/client_apis/OCS/ocs-api-overview.html#direct-download
 *
 * @param {File} resource file to get the link for
 */
async function generateDirectDownloadLink(resource) {
	const response = await axios.post(generateOcsUrl('apps/dav/api/v1/direct'), {
		fileId: resource.data.id,
	}, {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			Accept: 'application/json, text/javascript',
			'OCS-APIREQUEST': true,
			requestoken: OC.requestToken,
		},
	})
		.then(response => {
			return response.data.ocs.data.url
		})
		.catch(error => {
			throw new Error(`Failed to create direct download link: ${error.message}`)
		})
	return response
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

	const response = await axios.get(url, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'OCS-APIREQUEST': 'true',
			requestoken: OC.requestToken,
		},
	})
		.then(response => {
			const data = response.data.ocs.data
			let shareOfInterest
			for (let i = 0; i < data.length; i++) {
				if (data[i].share_type === 3) { // a shared public link
					shareOfInterest = data[i]
				}
			}
			return shareOfInterest.url
		})
		.catch(error => {
			throw new Error(`Failed to get file share link: ${error.message}`)
		})
	return response
}

/**
 * Handle click on 'Switchboard' option in the file context menu.
 *
 * @param {File} resource file for which the Switchboard is being called
 * @param {boolean} batch wether the click came from the "batch" button or the option in front of each file
 */
async function handleClick(resource, batch = false) {
	let resourceURI
	let shareType = resource.data.attributes['share-types']['share-type']

	if (!Array.isArray(shareType)) {
		shareType = [shareType]
	}

	if (shareType.some((value) => value === 3)) {
		resourceURI = await getResourcePublicLink(resource) + '/download'
	} else {
		// There is currently no public share link -> generate direct dowload link
		resourceURI = await generateDirectDownloadLink(resource)
	}

	if (useSwitchboardPopUp && !batch) {
		openInSwitchboardPopUp(resourceURI, resource.data.mime)
	} else {
		openInSwitchboard(resourceURI, resource.data.mime)
	}

}

export const openSwitchboardAction = new FileAction({
	id: 'switchboardbridge-action',
	title: (nodes) => 'Switchboard',
	displayName: (nodes) => 'Switchboard',
	enabled: (nodes) => {
		if (nodes.length >= 1) {
			return !nodes.some(node => node.type === FileType.Folder) && nodes.every(node => node.permissions & Permission.READ)
		}
		return false
	},
	iconSvgInline: () => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.9,18.45C17.25,18.45 18.35,17.35 18.35,16C18.35,14.65 17.25,13.55 15.9,13.55C14.54,13.55 13.45,14.65 13.45,16C13.45,17.35 14.54,18.45 15.9,18.45M21.1,16.68L22.58,17.84C22.71,17.95 22.75,18.13 22.66,18.29L21.26,20.71C21.17,20.86 21,20.92 20.83,20.86L19.09,20.16C18.73,20.44 18.33,20.67 17.91,20.85L17.64,22.7C17.62,22.87 17.47,23 17.3,23H14.5C14.32,23 14.18,22.87 14.15,22.7L13.89,20.85C13.46,20.67 13.07,20.44 12.71,20.16L10.96,20.86C10.81,20.92 10.62,20.86 10.54,20.71L9.14,18.29C9.05,18.13 9.09,17.95 9.22,17.84L10.7,16.68L10.65,16L10.7,15.31L9.22,14.16C9.09,14.05 9.05,13.86 9.14,13.71L10.54,11.29C10.62,11.13 10.81,11.07 10.96,11.13L12.71,11.84C13.07,11.56 13.46,11.32 13.89,11.15L14.15,9.29C14.18,9.13 14.32,9 14.5,9H17.3C17.47,9 17.62,9.13 17.64,9.29L17.91,11.15C18.33,11.32 18.73,11.56 19.09,11.84L20.83,11.13C21,11.07 21.17,11.13 21.26,11.29L22.66,13.71C22.75,13.86 22.71,14.05 22.58,14.16L21.1,15.31L21.15,16L21.1,16.68M6.69,8.07C7.56,8.07 8.26,7.37 8.26,6.5C8.26,5.63 7.56,4.92 6.69,4.92A1.58,1.58 0 0,0 5.11,6.5C5.11,7.37 5.82,8.07 6.69,8.07M10.03,6.94L11,7.68C11.07,7.75 11.09,7.87 11.03,7.97L10.13,9.53C10.08,9.63 9.96,9.67 9.86,9.63L8.74,9.18L8,9.62L7.81,10.81C7.79,10.92 7.7,11 7.59,11H5.79C5.67,11 5.58,10.92 5.56,10.81L5.4,9.62L4.64,9.18L3.5,9.63C3.41,9.67 3.3,9.63 3.24,9.53L2.34,7.97C2.28,7.87 2.31,7.75 2.39,7.68L3.34,6.94L3.31,6.5L3.34,6.06L2.39,5.32C2.31,5.25 2.28,5.13 2.34,5.03L3.24,3.47C3.3,3.37 3.41,3.33 3.5,3.37L4.63,3.82L5.4,3.38L5.56,2.19C5.58,2.08 5.67,2 5.79,2H7.59C7.7,2 7.79,2.08 7.81,2.19L8,3.38L8.74,3.82L9.86,3.37C9.96,3.33 10.08,3.37 10.13,3.47L11.03,5.03C11.09,5.13 11.07,5.25 11,5.32L10.03,6.06L10.06,6.5L10.03,6.94Z" /></svg>',

	async exec(node, view, dir) {
		try {
			await handleClick(node, false)
		} catch (e) {
			// Do nothing if the user cancels
		}
		return null
	},
	async execBatch(nodes, view, dir) {
		try {
			for await (const node of nodes) {
			 handleClick(node, true)
			}
		} catch (e) {
			// Do nothing if the user cancels
		}
		return Promise.all(nodes.map(node => null))
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

document.addEventListener('DOMContentLoaded', async () => {
	if (switchboardUrl && OCA && OCA?.Files?.Settings) {
		const { default: Vue } = await import('vue')
		const { default: FilesSettings } = await import('./views/FilesSettings.vue')

		const vm = new Vue({
			render: h => h(FilesSettings, {}),
		})
		const el = vm.$mount().$el
		OCA.Files.Settings.register(new OCA.Files.Settings.Setting('switchboardbridge', {
			el: () => { return el },
		}))
	}
})

OCA.SwitchboardBridge = {
	SwitchboardUrl: switchboardUrl,
	SwitchboardDefaultUrl: switchboardDefaultUrl,
	UsePopUp: useSwitchboardPopUp,
}

subscribe('SwitchboardBridge::sbUrlChanged', sbUrlChanged)
subscribe('SwitchboardBridge::usePopUpToggled', usePopUpToggled)
