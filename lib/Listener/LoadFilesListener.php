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

namespace OCA\SwitchboardBridge\Listener;

use OCA\SwitchboardBridge\AppInfo\Application;
use OCA\SwitchboardBridge\Service\InitialStateProvider;
use OCA\SwitchboardBridge\Service\ConfigService;
use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

/**
 * Implementation for LoadFilesListener
 * This listener is triggered when the files app main screen is loaded and
 * loads our app
 *
 * @category   Nextcloud
 * @package    SwitchboardBridge
 * @author     André Moreira <andre@clarin.eu>
 * @license    https://github.com/clarin-eric/B2Drop2LRS/blob/master/LICENSE AGPL v3
 * @link       https://github.com/clarin-eric/B2Drop2LRS
 * @implements IEventListener<Event|LoadViewer>
 */
class LoadFilesListener implements IEventListener
{
    private InitialStateProvider $initialStateProvider;

    /**
     * Counstructor
     *
     * @param InitialStateProvider $initialStateProvider InitialStateprovider.php
     * @param ConfigService        $configService        the configuration service
     * @param ?string              $userId               the user id
     */
    public function __construct(
        InitialStateProvider $initialStateProvider,
        private ConfigService $configService,
        private ?string $userId,
    ) {
        $this->initialStateProvider = $initialStateProvider;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Handle event
     *
     * @param Event $event The triggering event
     *
     * @return void
     */
    public function handle(Event $event): void
    {
        if (!$event instanceof LoadAdditionalScriptsEvent) {
            return;
        }

        Util::addScript(Application::APP_NAME, 'switchboardbridge-main');

        if ($this->configService->getSwitchboardUsePopUpForUser($this->userId)) {
            Util::addScript(
                Application::APP_NAME,
                'switchboardbridge-switchboardpopuplocal'
            );
        }

        $this->initialStateProvider->provideState();
    }
}
