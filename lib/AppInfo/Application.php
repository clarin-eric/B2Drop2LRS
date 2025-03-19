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
    /**
     * Create a nextcloud application
     *
     * @param array(string) $urlParams a list of url parameters
     */
    public function __construct(array $urlParams = array())
    {
        parent::__construct('switchboardbridge', $urlParams);
        $container = $this->getContainer();
        $server = $container->getServer();
    }

    /**
     * Register Settings pages
     *
     * @return null
     */
    public function registerSettings()
    {
        return;
    }

    /**
     * Load additional javascript files
     *
     * @return null
     */
    public static function loadScripts()
    {
        Util::addScript('switchboardbridge', 'switchboardbridge-main');
        Util::addStyle('switchboardbridge', 'settings');
        return;
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
            LoadSidebar::class,
            LoadSidebarListener::class
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
        $this->loadScripts();
        $this->registerSettings();
    }

}
