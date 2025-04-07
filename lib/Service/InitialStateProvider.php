<?php

namespace OCA\SwitchboardBridge\Service;

use OCP\AppFramework\Services\IInitialState;
use OCP\TaskProcessing\IManager;

class InitialStateProvider
{
    public function __construct(
        private IInitialState $initialState,
        private ConfigService $configService,
        private IManager $taskProcessingManager,
        private ?string $userId,
    ) {
    }

    public function provideState(): void
    {
        $this->initialState->provideInitialState(
            'switchboard_url',
            $this->configService->getSwitchboardUrlForUser($this->userId)
        );
        $this->initialState->provideInitialState(
            'use_switchboard_popup',
            $this->configService->getSwitchboardUsePopUpForUser($this->userId)
        );
    }
}
