
(function() {
    
    OCA.SwitchboardBridge = OCA.SwitchboardBridge || {};

    /**
     * @namespace
     */
    OCA.SwitchboardBridge.Util = {
        /**
         * Initialize the switchboardbridge plugin.
         *
         * @param {OCA.Files.FileList} fileList file list to be extended
         */
        attach: function(fileList) {
            if (fileList.id === 'trashbin' || fileList.id === 'files.public') {
                return;
            }
            var fileActions = fileList.fileActions;

            fileActions.registerAction({
                name: 'SWITCHBOARD',
                displayName: 'Switchboard',
                mime: 'all',
                permissions: OC.PERMISSION_READ,
                icon: imagePath('switchboardbridge', 'cog.svg'),
                actionHandler: function(fileName,path) {
					//console.log(fileName, path, path.dir);
					var filePath = path.dir + '/' + fileName;
					filePath = filePath.replace('//', '/');
					// use REST API to get the share link for the resource in question
					var xhr = new XMLHttpRequest();
					var url = linkToOCS('apps/files_sharing/api/v1', 4)
						+ 'shares'
						+ '?format=json'
						+ '&path='+filePath
						+ '&reshares=true';
					//console.log('url', url);
					xhr.open('GET', url, true);
					xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
					xhr.setRequestHeader('OCS-APIREQUEST', true);
					xhr.setRequestHeader('requestoken', OC.requestToken);
					xhr.onload = function() {
						if (this.status >= 200 && this.status < 300) {
							var jsonResponse = JSON.parse(this.response);

							// to be configured to global switchboard server, see  "<?php p($_['switchboard_baseurl']) ?>");
							var switchboardBase = '//switchboard.clarin.eu/#/b2drop/'

							// first, check whether we have a shared link
							var data = jsonResponse.ocs.data;
							console.log('jsonResponse', jsonResponse, data);
							var shareOfInterest = undefined;
							for (var i = 0; i < data.length; i++) {
								if (data[i].share_type == 3) { // a shared link
									shareOfInterest = data[i];
									console.log('share', shareOfInterest);
								}
							}
							// call the switchboard when there is a shared link, otherwise alert the user
							if (shareOfInterest === undefined) {
								var url = '/ocs/v2.php/apps/files_sharing/api/v1/shares?format=json';
								var data = {
									'path': filePath,
									'shareType': 3,    // public link
									'permissions': 27,  // just replicating what pushing the add icon in the UI does...
								};
								var xhr = new XMLHttpRequest();
								xhr.open('POST', url, true);
								xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
								xhr.setRequestHeader('Accept', 'application/json, text/javascript');
								xhr.setRequestHeader('OCS-APIREQUEST', true);
								xhr.setRequestHeader('requestToken', OC.requestToken);
								xhr.onload = function (data) {
									if(this.status >= 200 && this.status < 300) {
										var response = JSON.parse(this.response);
										var fileLink = response.ocs.data.url + '/download';
									    var clrsCall = switchboardBase + encodeURIComponent(fileLink);
									    console.log('clrsCall/share', clrsCall);
										window.open(clrsCall, '_blank');
										OCA.Sharing.Util._updateFileActionIcon(path.$file, false, true);
									}
								};
								xhr.send(JSON.stringify(data));

							} else {
								var fileLink = shareOfInterest.url + '/download';
							    var clrsCall = switchboardBase + encodeURIComponent(fileLink);
									    console.log('clrsCall/noshare', clrsCall);
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
        },
    };

})();

OC.Plugins.register('OCA.Files.FileList', OCA.SwitchboardBridge.Util);
