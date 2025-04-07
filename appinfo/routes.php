<?php

namespace OCA\SwitchboardBridge\AppInfo;

use OCA\SwitchboardBridge\Controller;

return [
    'routes' => [
        /** @see Controller\SettingsController::updateConfig() */
        ['name' => 'Settings#updateConfig', 'url' => '/settings', 'verb' => 'POST'],
        /** @see Controller\RedirectController::redirectClient() */
        ['name' => 'Redirect#redirectClient', 'url' => '/redirect2switchboard', 'verb' => 'POST'],
    ]
];