<?php

namespace OCA\SwitchboardBridge\Service;

use OCA\SwitchboardBridge\AppInfo\Application;
use OCP\IAppConfig;
use OCP\IConfig;

class ConfigService
{
    public function __construct(
        private IAppConfig $appConfig,
        private IConfig $config,
    ) {

    }

    public function getSwitchboardUrlForUser(?string $userId): string
    {
        if ($userId === null) {
            return Application::SB_DEFAULT_URL;
        }
        return $this->config->getUserValue($userId, Application::APP_NAME, 'switchboard_url', Application::SB_DEFAULT_URL);
    }

    public function getSwitchboardUsePopUpForUser(?string $userId): string
    {
        if ($userId === null) {
            return false;
        }
        return $this->config->getUserValue($userId, Application::APP_NAME, 'use_switchboard_popup', false);
    }
}
