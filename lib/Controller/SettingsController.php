<?php

namespace OCA\SwitchboardBridge\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\IConfig;
use OCP\IRequest;

class SettingsController extends Controller
{
    public const ACCEPTED_KEYS = [
        'switchboard_url',
        'use_switchboard_popup'
    ];

    /**
     * Counstructor
     *
     * @param string $appName this app name
     * @param IRequest $request the request
     * @param IConfig $config the configuration object
     * @param ?string $userId the user id
     */
    public function __construct(
        string $appName,
        IRequest $request,
        private IConfig $config,
        private ?string $userId,
    ) {
        parent::__construct($appName, $request);
    }

    /**
     * Store configuration value sent from the client
     * 
     * @param string $key the configuration option
     * @param string $value the value of the configuration option
     * @throws \OCP\PreConditionNotMetException
     *
     * @return DataResponse<key, value>
     * @psalm-return DataResponse<200>
     */
    #[NoAdminRequired]
    public function updateConfig(string $key, int|string $value): DataResponse
    {
        if (!in_array($key, self::ACCEPTED_KEYS, true)) {
            return new DataResponse(['message' => 'Invalid config key'], Http::STATUS_BAD_REQUEST);
        }
        $this->config->setUserValue($this->userId, $this->appName, $key, (string)$value);
        return new DataResponse([
            $key => $value
        ]);
    }
}
