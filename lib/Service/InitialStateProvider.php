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

use OCP\AppFramework\Services\IInitialState;
use OCP\TaskProcessing\IManager;

/**
 * Initial State Provider - provides the initial app settings values
 *
 * @category Nextcloud
 * @package  SwitchboardBridge
 * @author   André Moreira <andre@clarin.eu>
 * @license  https://github.com/clarin-eric/B2Drop2LRS/blob/master/LICENSE AGPL v3
 * @link     https://github.com/clarin-eric/B2Drop2LRS
 */
class InitialStateProvider
{

    /**
     * Constructor
     *
     * @param IInitialState $initialState the initial state
     * @param ConfigService $configService the configuration service
     * @param IManager $taskProcessingManager task manager
     * @param ?string $userId the user id
     */
    public function __construct(
        private IInitialState $initialState,
        private ConfigService $configService,
        private IManager $taskProcessingManager,
        private ?string $userId,
    ) {
    }

    /**
     * Handle event
     *
     * @return void
     */
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
