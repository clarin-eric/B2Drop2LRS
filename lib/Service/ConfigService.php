<?php

/**
 * Nextcloud - SwitchboardBridge App
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

namespace OCA\SwitchboardBridge\Service;

use OCA\SwitchboardBridge\AppInfo\Application;
use OCP\IAppConfig;
use OCP\IConfig;

/**
 * Configuration service - used to retrieve user app settings
 *
 * @category Nextcloud
 * @package  SwitchboardBridge
 * @author   André Moreira <andre@clarin.eu>
 * @license  https://github.com/clarin-eric/B2Drop2LRS/blob/master/LICENSE AGPL v3
 * @link     https://github.com/clarin-eric/B2Drop2LRS
 */
class ConfigService
{

    /**
     * Counstructor
     *
     * @param IAppConfig $appConfig app configuration
     * @param IConfig $config the configuration object
     */
    public function __construct(
        private IAppConfig $appConfig,
        private IConfig $config,
    ) {

    }

    /**
     * Return the Switchboard URL for the user
     *
     * @param ?string $userId the user id
     *
     * @return string the URL of the Switchboard
     */
    public function getSwitchboardUrlForUser(?string $userId): string
    {
        if ($userId === null) {
            return Application::SB_DEFAULT_URL;
        }
        return $this->config->getUserValue($userId, Application::APP_NAME, 'switchboard_url',
            Application::SB_DEFAULT_URL);
    }

    /**
     * Return the wether to use the Switchboard pop up
     *
     * @param ?string $userId the user id
     *
     * @return string wether to use the Switchboard pop-up
     */
    public function getSwitchboardUsePopUpForUser(?string $userId): string
    {
        if ($userId === null) {
            return false;
        }
        return $this->config->getUserValue($userId, Application::APP_NAME,
            'use_switchboard_popup', false);
    }
}
