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
        /** @see Controller\SettingsController::updateConfig() location
         * to manage app user settings */
        ['name' => 'Settings#updateConfig', 'url' => '/settings', 'verb' => 'POST'],
        /** @see Controller\RedirectController::redirectClient() location to
         * redirect the user to the switchboard to avoid CSP issues*/
        ['name' => 'Redirect#redirectClient', 'url' => '/redirect2switchboard',
         'verb' => 'POST'],
    ]
];