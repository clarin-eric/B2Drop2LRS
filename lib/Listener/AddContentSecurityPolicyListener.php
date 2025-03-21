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

use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Security\CSP\AddContentSecurityPolicyEvent;

/**
 * @template-implements IEventListener<Event>
 */
class AddContentSecurityPolicyListener implements IEventListener {

    public function handle(Event $event): void {
        if (!($event instanceof AddContentSecurityPolicyEvent)) {
            return;
        }
        $csp = new ContentSecurityPolicy();
        $baseUrl = 'https://switchboard.clarin.eu/';
        $csp->addAllowedFormActionDomain($baseUrl);
        $event->addPolicy($csp);
    }
}