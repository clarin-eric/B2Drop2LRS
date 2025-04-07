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

use OCA\SwitchboardBridge\Service\ConfigService;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Security\CSP\AddContentSecurityPolicyEvent;

/**
 * Implementation for AddContentSecurityPolicyListener
 * This listener adds 'https://switchboard.clarin.eu/' to the form-action
 * allowed domains of NC CSP.
 * This is needed in order to POST data from NC to the Switchboard
 *
 * @category Nextcloud
 * @package  SwitchboardBridge
 * @author   André Moreira <andre@clarin.eu>
 * @license  https://github.com/clarin-eric/B2Drop2LRS/blob/master/LICENSE AGPL v3
 * @link     https://github.com/clarin-eric/B2Drop2LRS
 */
class AddContentSecurityPolicyListener implements IEventListener
{
    /**
     * Constructor
     *
     * @param ConfigService $configService the configuration service
     * @param ?string $userId the user id
     */
    public function __construct(
        private ConfigService $configService,
        private ?string $userId,
    ) {
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
        if (!($event instanceof AddContentSecurityPolicyEvent)) {
            return;
        }

        $baseUrl = $this->configService->getSwitchboardUrlForUser($this->userId);
        $csp = new ContentSecurityPolicy();
        $csp->addAllowedFormActionDomain($baseUrl);
        $csp->addAllowedFrameDomain($baseUrl);

        $event->addPolicy($csp);
    }
}
