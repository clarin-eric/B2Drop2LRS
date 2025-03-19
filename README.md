# LR SWITCHBOARD -- EUDAT/B2DROP integration
Code Repository for the B2DROP application bridge to the CLARIN Language Resources Switchboard.
Although this app is intended to be used with [B2Drop](https://b2drop.eudat.eu), it is developed
and tested generically against vanilla NextCloud and should be deployable on it.

# Module Description

This Nextcloud plugin allows users to connect their resources from their personal cloud store to the
CLARIN Language Resource Switchboard.  It extends the user interface of the B2DROP resources
list. For each resource, the '...' menu is extended to contain a menu item poiting to the LR
Switchboard. Once activated, a new browser tab opens with the Switchboard; it fetches the resource
from the cloud, and processes it as usual.

# Install

1. on your B2DROP server go to the <nextcloud>/apps directory
2. 
   a) git clone this repository using

   ```git clone https://github.com/clarin-eric/B2Drop2LRS.git switchboardbridge ```

   or

   b) download and extract a release package


   ```curl -L -O https://github.com/clarin-eric/B2Drop2LRS/archive/refs/tags/<release tag>.tar.gz```

   ```tar xvf <release tag>.tar.gz```
      
   ```mv B2Drop2LRS-<release tag> switchboardbridge```

3. enable the app on the B2DROP/nextcloud web interface. The menu item for
   managing the apps is hidden in the collapsible menu under the avatar icon on
   the top-right corner. ALTERNATIVELY, use:

	```php occ app:enable switchboardbridge ```
   

# Website

The official B2Drop cloud space is served at:

```https://b2drop.eudat.eu/ ```

The switchboard is being served at:

```https://switchboard.clarin.eu ```


# Status

The code is inspired by the B2Drop plugin b2sharebridge, see

```https://github.com/EUDAT-B2DROP/b2sharebridge.git ```.

The software is continuously being updated for newer versions of Nextcloud.
