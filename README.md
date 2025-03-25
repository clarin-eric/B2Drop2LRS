# CLARIN Language Resource Switchboard integration for Nextcloud and EUDAT-B2DROP
A Nextcloud application that integrates the CLARIN Language Resources Switchboard into the native
[Nextcloud Files app](https://nextcloud.com/files/).
This app is available for use within [EUDAT-B2DROP](https://b2drop.eudat.eu) but is developed
and tested generically against vanilla NextCloud and should be fully compatible with it.

# Module Description

This Nextcloud app allows users to connect their resources from their personal cloud store in
Nextcloud/B2DROP to the CLARIN Language Resource Switchboard.  It extends the user interface of
[Nextcloud Files](https://nextcloud.com/files/) browser app, providing options to call the Switchboard
for the desired resources.
For each file, the '...' menu is extended to contain a menu item poiting to the CLARIN Language
Resource Switchboard. Once activated, a new browser tab opens with the Switchboard pre-loaded with
the desired resource. It fetches the file from the cloud, and processes it as usual.
When selecting multiple files from the Nextcloud/B2DROP cloud space, an option button is also
made available in the files-batch option section. This option will open a new tab with the Switchboard
for each selected resource following the process decribed above for each file.

# Install

1. on your Nextcloud/B2DROP server go to the `<nextcloud_dir>/apps` directory
2. 
   a) git clone this repository using

   ```git clone https://github.com/clarin-eric/B2Drop2LRS.git switchboardbridge ```

   **or**

   b) download and extract a release package


   ```curl -L -O https://github.com/clarin-eric/B2Drop2LRS/archive/refs/tags/<release_tag>.tar.gz```

   ```tar xvf <release_tag>.tar.gz```

   ```mv B2Drop2LRS-<release_tag> switchboardbridge```

3. enable the app on the Nextcloud/B2DROP web interface. The menu item for
   managing the apps is hidden in the collapsible menu under the avatar icon on
   the top-right corner. ALTERNATIVELY, go back to the `<nextcloud_dir>` directory and use:

	```php occ app:enable switchboardbridge ```


# Website

The official B2Drop cloud space:

[https://b2drop.eudat.eu/](https://b2drop.eudat.eu)

CLARIN Language Resource Switchboard:

[https://switchboard.clarin.eu](https://switchboard.clarin.eu)


# Status

The code is inspired by the B2Drop plugin b2sharebridge, see

[https://github.com/EUDAT-B2DROP/b2sharebridge.git](https://github.com/EUDAT-B2DROP/b2sharebridge.git)

The software is continuously being updated for newer versions of Nextcloud.
