<?php
/**
 * Nextcloud - SwitchboardBridge App
 *
 * PHP Version 5-8
 *
 * @category  Nextcloud
 * @package   SwitchboardBridge
 * @author    André Moreira <andre@clarin.eu>
 * @author    Claus Zinn <claus.zinn@uni-tuebingen.de>
 * @copyright 2015 EUDAT/CLARIN
 * @license   https://github.com/clarin-eric/B2Drop2LRS/blob/master/LICENSE AGPL v3
 * @link      https://github.com/clarin-eric/B2Drop2LRS
 */

namespace OCA\SwitchboardBridge\AppInfo;

/**
 * Implement a ownCloud Application for our b2sharebridge
 *
 * @category Nextcloud
 * @package  SwitchboardBridge
 * @author   André Moreira <andre@clarin.eu>
 * @author   Claus Zinn <claus.zinn@uni-tuebingen.de>
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
     * Register Navigation Entry
     *
     * @return null
     */

    /* todo
    public function registerNavigationEntry()
    {
        $c = $this->getContainer();
        $server = $c->getServer();

        $navigationEntry = function () use ($c, $server) {
            return [
                'id' => $c->getAppName(),
                'order' => 100,
                'name' => 'B2SHARE',
                'href' => $server->getURLGenerator()
                    ->linkToRoute('b2sharebridge.View.depositList'),
                'icon' => $server->getURLGenerator()
                    ->imagePath('b2sharebridge', 'appbrowsericon.svg'),
            ];
        };
        $server->getNavigationManager()->add($navigationEntry);
        return;
    }

    */

    /**
     * Register Settings pages
     *
     * @return null
     */
    public function registerSettings()
    {
        return;
    }

    // todo?
    /* public function registerSettings()
    {
        \OCP\App::registerAdmin('lrswitchboardbridge', 'lib/settings/admin');
        \OCP\App::registerPersonal('lrswitchboardbridge', 'lib/settings/personal');
    }
    */

    /**
     * Register Jobs
     *
     * @return null
     */

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
        // $this->registerNavigationEntry();
        $this->loadScripts();
        $this->registerSettings();
    }

}
