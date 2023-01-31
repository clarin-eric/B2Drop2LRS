# LR SWITCHBOARD -- EUDAT/B2DROP integration
Code Repository for the B2DROP plugin to bridge to the CLARIN Language Resources Switchboard.

# Module Description

This nextcloud plugin allows users to connect their resources from their personal cloud store to the
CLARIN Language Resource Switchboard.  It extends the user interface of the B2DROP resources
list. For each resource, the '...' menu is extended to contain a menu item poiting to the LR
switchboard. Once activated, a new browser tab opens with the switchboard; it fetches the resource
from the cloud, and processes it as usual.

# Install

1. on your B2DROP server go to the <nextcloud>/apps directory
2. git clone this repository using

   ```git clone https://github.com/clarin-eric/B2Drop2LRSwitchboard.git switchboardBridge ```

3. enable the app on the B2DROP/nextcloud web interface. The menu item for
   managing the apps is hidden in the collapsible menu under the avatar icon on
   the top-right corner. ALTERNATIVELY, use:

	```php occ app:enable switchboardBridge ```
   

# Website

The official B2Drop cloud space is served at:

```https://b2drop.eudat.eu/ ```

The switchboard is being served at:

```https://switchboard.clarin.eu ```


# Status

The code is inspired by the B2Drop plugin b2sharebridge, see

```https://github.com/EUDAT-B2DROP/b2sharebridge.git ```.

Given the radical changes / deletions from the b2sharebridge code, its git log history has been
deleted.

The software is currently being updated for newer version of Nextcloud.



