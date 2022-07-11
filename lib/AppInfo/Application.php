<?php
/**
 * Nextcloud - switchboardBridge App
 *
 * PHP Version 5-7
 *
 * @category  Nextcloud
 * @package   switchboardBridge
 * @author    claus.zinn@uni-tuebingen.de
 * @copyright 2015- EUDAT/CLARIN
 * @license  AGPL3 https://github.com/clarin-eric/B2Drop2LRSwitchboard/blob/master/LICENSE
 * @link     https://github.com/clarin-eric/B2Drop2LRSwitchboard
 */

namespace OCA\switchboardBridge\AppInfo;


use OCP\AppFramework\App;
use OCP\IContainer;
use OCP\Util;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;

class Application extends App implements IBootstrap
{
    /**
     * Create a nextcloud application
     *
     * @param array(string) $urlParams a list of url parameters
     */
    public function __construct(array $urlParams = array())
    {
        parent::__construct('switchboardBridge', $urlParams);
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
        Util::addScript('switchboardBridge', 'switchboardBridge');
        Util::addStyle('switchboardBridge', 'settings');
        return;
    }

    public function register(IRegistrationContext $context): void {
        $context->registerEventListener(
            LoadSidebar::class,
            LoadSidebarListener::class
        );
    }

    public function boot(IBootContext $context): void {
      // $this->registerNavigationEntry();
         $this->loadScripts();
         $this->registerSettings();
    }

}

