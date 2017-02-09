
(function() {
    
    OCA.lrswitchboardBridge = OCA.lrswitchboardBridge || {};

    /**
     * @namespace
     */
    OCA.lrswitchboardBridge.Util = {
        /**
         * Initialize the lrswitchboardbridge plugin.
         *
         * @param {OCA.Files.FileList} fileList file list to be extended
         */
        attach: function(fileList) {
            if (fileList.id === 'trashbin' || fileList.id === 'files.public') {
                return;
            }
            var fileActions = fileList.fileActions;

            fileActions.registerAction({
                name: 'LRSWITCHBOARD',
                displayName: 'Switchboard',
                mime: 'all',
                permissions: OC.PERMISSION_READ,
                icon: OC.imagePath('lrswitchboardbridge', 'filelisticon.png'),
                actionHandler: function(fileName) {

		    // use REST API to get the share link for the resource in question
		    var xhr = new XMLHttpRequest();
		    var url = OC.linkToOCS('apps/files_sharing/api/v1', 4) + 'shares' + '?format=json' + '&path=/'.concat(fileName) + '&reshares=true';		    
		    xhr.open('GET', url, true);
		    xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
		    xhr.setRequestHeader('OCS-APIREQUEST', true);
		    xhr.setRequestHeader('requesttoken', oc_requesttoken); // "<?php p($_['requesttoken']) ?>");
                    console.log('shared link for the file in question (to be transferred to the LRSwitchboard!', fileName);
		    xhr.onload = function() {
		    	if (xhr.status >= 200 && xhr.status < 300) {
		    	    console.log('XMLHttpRequest: Success in getting shares', xhr.response, xhr.status);
			    var jsonResponse = JSON.parse(xhr.response);

			    // to be configured to global switchboard server (not open to b2drop users)
			    var switchboardBase = 'http://localhost/clrs/#/b2drop/'
			    
			    // fetch the share link, plus at download postfix
			    // TODO, of data[0] is undefined, the link has not been shared
			    var sharedP = jsonResponse.ocs.data[0];
			    if (sharedP === undefined) {
				alert('You need to share the file, before calling the switchboard');
			    } else {
				var fileLink = jsonResponse.ocs.data[0].url.concat('/download');
				// create URL to call for invoking switchboard 
				var clrsCall = switchboardBase.concat( encodeURIComponent(fileLink));
				window.open(clrsCall, '_blank');
				window.focus();
			    }
		    	} else {
		    	    console.log('XMLHttpRequest: Error in uploading document!', xhr.response, xhr.status);
		    	}
		    };
		    xhr.send();
                },
            });
        }
    };

})();

OC.Plugins.register('OCA.Files.FileList', OCA.lrswitchboardBridge.Util);
