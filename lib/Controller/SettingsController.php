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

    public function __construct(
        string $appName,
        IRequest $request,
        private IConfig $config,
        private ?string $userId,
    ) {
        parent::__construct($appName, $request);
    }

    /**
     * @throws \OCP\PreConditionNotMetException
     *
     * @psalm-return DataResponse<200|400, array{switchboard_url?: mixed, message?: 'Invalid config key'}, array<never, never>>
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
