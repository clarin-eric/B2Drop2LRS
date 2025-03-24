# CLARIN Language Resource Switchboard integration for Nextcloud and EUDAT-B2DROP
A Nextcloud application that integrates the CLARIN Language Resources Switchboard into the native
[Nextcloud Files app](https://nextcloud.com/files/).
This app is available for usage within [EUDAT-B2DROP](https://b2drop.eudat.eu) but is developed
and tested generically against vanilla NextCloud and should be fully compatible with it.

# Module Description

This Nextcloud app allows users to connect their resources from their personal cloud store to the
CLARIN Language Resource Switchboard.  It extends the user interface of [Nextcloud Files browser](https://nextcloud.com/files/).
For each file, the '...' menu is extended to contain a menu item poiting to the CLARIN Language
Resource Switchboard. Once activated, a new browser tab opens with the Switchboard pre-loaded with
the desired fire; it fetches the file from the cloud, and processes it as usual.

# Install

1. on your B2DROP server go to the `<nextcloud>/apps` directory
2. 
   a) git clone this repository using

   ```git clone https://github.com/clarin-eric/B2Drop2LRS.git switchboardbridge ```

   or

   b) download and extract a release package


   ```curl -L -O https://github.com/clarin-eric/B2Drop2LRS/archive/refs/tags/<release tag>.tar.gz```

   ```tar xvf <release tag>.tar.gz```

   ```mv B2Drop2LRS-<release tag> switchboardbridge```

3. enable the app on the B2DROP/Nextcloud web interface. The menu item for
   managing the apps is hidden in the collapsible menu under the avatar icon on
   the top-right corner. ALTERNATIVELY, go back to the `<nextcloud>` directory and use:

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
