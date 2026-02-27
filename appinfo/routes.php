<?php

/**
 * Nextcloud - SwitchboardBridge App routes
 *
 * PHP Version 8
 *
 * @category  Nextcloud
 * @package   SwitchboardBridge
 * @author    André Moreira <andre@clarin.eu>
 * @copyright 2025 EUDAT/CLARIN
 * @license   https://github.com/clarin-eric/B2Drop2LRS/blob/master/LICENSE AGPL v3
 * @link      https://github.com/clarin-eric/B2Drop2LRS
 */

namespace OCA\SwitchboardBridge\AppInfo;

use OCA\SwitchboardBridge\Controller;

return [
    'routes' => [
        /** 
         * Manage app user settings
         *
         * @see Controller\SettingsController::updateConfig() 
*/
        ['name' => 'Settings#updateConfig', 'url' => '/settings', 'verb' => 'POST'],
        /**
         * Redirect the user to the switchboard to avoid CSP issues 
         *
         * @see Controller\RedirectController::redirectClient()
*/
        ['name' => 'Redirect#redirectClient', 'url' => '/redirect2switchboard',
         'verb' => 'POST'],
    ]
];