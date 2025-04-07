<?php

namespace OCA\SwitchboardBridge\Listener;

use OCA\SwitchboardBridge\AppInfo\Application;
use OCA\SwitchboardBridge\Service\InitialStateProvider;
use OCA\SwitchboardBridge\Service\ConfigService;
use OCA\Viewer\Event\LoadViewer;
use OCP\Collaboration\Reference\RenderReferenceEvent;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

/** @implements IEventListener<Event|LoadViewer> */
class LoadViewerListener implements IEventListener
{
    private InitialStateProvider $initialStateProvider;
    private IEventDispatcher $eventDispatcher;

    public function __construct(
        InitialStateProvider $initialStateProvider,
        IEventDispatcher $eventDispatcher,
        private ConfigService $configService,
        private ?string $userId,
    ) {
        $this->initialStateProvider = $initialStateProvider;
        $this->eventDispatcher = $eventDispatcher;
    }

    public function handle(Event $event): void
    {
        if (!$event instanceof LoadViewer) {
            return;
        }

        Util::addScript(Application::APP_NAME, 'switchboardbridge-main');

        if ($this->configService->getSwitchboardUsePopUpForUser($this->userId)) {
            Util::addScript(Application::APP_NAME, 'switchboardbridge-switchboardpopuplocal');
        }

        $this->eventDispatcher->dispatchTyped(new RenderReferenceEvent());
        $this->initialStateProvider->provideState();
    }
}
