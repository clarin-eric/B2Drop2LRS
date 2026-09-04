<template>
	<div class="wrapper">
		<h4 id="title">
			Switchboard settings
		</h4>
		<NcTextField
			v-model="switchboardUrl"
			label="Switchboard URL"
			:helperText="helpText"
			type="url"
			placeholder="e.g. https://switchboard.clarin.eu"
			trailingButtonIcon="undo"
			trailingButtonLabel="Reset to default"
			:showTrailingButton="switchboardUrl !== switchboardDefaultUrl"
			:error="invalid"
			:success="submitted"
			@trailingButtonClick="reset"
			@update:modelValue="updateUI">
			<template #icon>
				<LinkEdit :size="20" />
			</template>
		</NcTextField>
		<NcActions :forceName="true">
			<NcActionButton :disabled="submitDisabled" @click="submit">
				<template #icon>
					<ContentSaveOutline :size="20" />
				</template>
				Save
			</NcActionButton>
		</NcActions>
		<div id="popupbox">
			<NcCheckboxRadioSwitch :modelValue="usePopUp" :loading="loading" @update:modelValue="togglePopUp">
				Use Switchboard on-screen pop-up to open single files
			</NcCheckboxRadioSwitch>
		</div>
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { emit } from '@nextcloud/event-bus'
import { generateUrl } from '@nextcloud/router'
import { NcActionButton, NcActions, NcCheckboxRadioSwitch, NcTextField } from '@nextcloud/vue'
import ContentSaveOutline from 'vue-material-design-icons/ContentSaveOutline.vue'
import LinkEdit from 'vue-material-design-icons/LinkEdit.vue'

const defaultHelpText = 'The URL of the CLARIN Language Resource Switchboard'

export default {
	name: 'FilesSettings',
	components: {
		NcTextField,
		NcActions,
		NcActionButton,
		NcCheckboxRadioSwitch,
		LinkEdit,
		ContentSaveOutline,
	},

	data() {
		return {
			switchboardUrl: OCA.SwitchboardBridge.SwitchboardUrl,
			switchboardSavedUrl: OCA.SwitchboardBridge.SwitchboardUrl,
			switchboardDefaultUrl: OCA.SwitchboardBridge.SwitchboardDefaultUrl,
			usePopUp: OCA.SwitchboardBridge.UsePopUp,
			submitted: false,
			invalid: false,
			loading: false,
			submitDisabled: true,
			helpText: defaultHelpText,
		}
	},

	methods: {
		reset() {
			this.switchboardUrl = this.switchboardDefaultUrl
			this.setValid()
			this.submitDisabled = this.switchboardUrl.trim() === this.switchboardSavedUrl.trim()
		},

		submit() {
			if (this.switchboardUrl) {
				axios.post(generateUrl('/apps/switchboardbridge/settings'), {
					key: 'switchboard_url',
					value: this.switchboardUrl,
				}).then((response) => {
					emit('SwitchboardBridge::sbUrlChanged', {
						newUrl: this.switchboardUrl,
					})

					this.switchboardSavedUrl = this.switchboardUrl
					this.submitted = true
					this.helpText = 'Success!'
					this.submitDisabled = true
				})
			}
		},

		updateUI() {
			this.submitted = false
			if (this.switchboardSavedUrl === this.switchboardUrl) {
				this.submitDisabled = true
				return
			}
			this.validate()
		},

		validate() {
			if (this.isValidUrl(this.switchboardUrl)) {
				this.setValid()
			} else {
				this.setInvalid()
			}
		},

		setValid() {
			this.helpText = defaultHelpText
			this.invalid = false
			this.submitDisabled = false
		},

		setInvalid() {
			this.helpText = 'Must be a valid URL in the form: "https://..."'
			this.invalid = true
			this.submitDisabled = true
		},

		isValidUrl(string) {
			let url
			try {
				url = new URL(string)
			} catch (_) {
				return false
			}
			return url.protocol === 'https:' && string.startsWith('https://')
		},

		togglePopUp() {
			this.loading = true
			this.usePopUp = !this.usePopUp
			axios.post(generateUrl('/apps/switchboardbridge/settings'), {
				key: 'use_switchboard_popup',
				value: this.usePopUp ? '1' : '0',
			}).then((response) => {
				emit('SwitchboardBridge::usePopUpToggled')
				this.loading = false
			})
		},
	},

	order: -99,
}

</script>

<style lang="css" scoped>
	.wrapper {
		margin-top: 15px;
		margin-bottom: 5px;
		display: flex;
		align-items: flex-end;
		flex-direction: column;
	}
	#title, #popupbox {
		align-self: start;
	}
</style>
