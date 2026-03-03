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

namespace OCA\SwitchboardBridge\AppInfo;

use OCP\AppFramework\App;
use OCA\SwitchboardBridge\Listener\LoadFilesListener;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\Security\CSP\AddContentSecurityPolicyEvent;
use OCA\SwitchboardBridge\Listener\AddContentSecurityPolicyListener;
use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCP\Util;

/**
 * Implement a NextCloud Application for our switchboardbridge
 *
 * @category Nextcloud
 * @package  SwitchboardBridge
 * @author   André Moreira <andre@clarin.eu>
 * @license  https://github.com/clarin-eric/B2Drop2LRS/blob/master/LICENSE AGPL v3
 * @link     https://github.com/clarin-eric/B2Drop2LRS
 */
class Application extends App implements IBootstrap
{
    public const APP_NAME = 'switchboardbridge';
    public const SB_DEFAULT_URL = 'https://switchboard.clarin.eu';

    /**
     * Create a nextcloud application
     *
     * @param array(string) $urlParams a list of url parameters
     */
    public function __construct(array $urlParams = array())
    {
        parent::__construct(self::APP_NAME, $urlParams);
    }

    /**
     * Register the composer autoloader for packages shipped by this app,
     * if applicable
     *
     * @param IRegistrationContext $context The registration context
     *
     * @return void
     **/
    public function register(IRegistrationContext $context): void
    {
        $context->registerEventListener(
            LoadAdditionalScriptsEvent::class,
            LoadFilesListener::class
        );

        $context->registerEventListener(
            AddContentSecurityPolicyEvent::class,
            AddContentSecurityPolicyListener::class
        );
    }

    /**
     * Boot logic
     *
     * @param IBootContext $context The boot context
     *
     * @return void
     */
    public function boot(IBootContext $context): void
    {
    }
}
