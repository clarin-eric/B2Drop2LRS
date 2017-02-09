<?php
/**
 * OwnCloud - lrswitchboardbridge App
 *
 * PHP Version 5-7
 *
 * @category  Owncloud
 * @package   lrswitchboardBridge
 * @author    EUDAT <b2drop-devel@postit.csc.fi>
 * @copyright 2015 EUDAT
 * @license   AGPL3 https://github.com/EUDAT-B2DROP/lrswitchboardbridge/blob/master/LICENSE
 * @link      https://github.com/EUDAT-B2DROP/lrswitchboardbridge.git
 */

namespace OCA\lrswitchboardBridge\AppInfo;


use OCA\lrswitchboardBridge\Data;
use OCP\AppFramework\App;
use OCP\IContainer;
use OCP\Util;


/**
 * Implement a ownCloud Application for our lrswitchboardbridge
 *
 * @category Owncloud
 * @package  lrswitchboardBridge
 * @author   EUDAT <b2drop-devel@postit.csc.fi>
 * @license  AGPL3 https://github.com/EUDAT-B2DROP/lrswitchboardbridge/blob/master/LICENSE
 * @link     https://github.com/EUDAT-B2DROP/lrswitchboardbridge.git
 */
class Application extends App
{
    /**
     * Create a ownCloud application
     *
     * @param array(string) $urlParams a list of url parameters
     */
    public function __construct(array $urlParams = array())
    {
        parent::__construct('lrswitchboardbridge', $urlParams);
        $container = $this->getContainer();
        $server = $container->getServer();
    }
    
    /**
     * Register settings pages
     *
     * @return null
     */
    public function registerSettings()
    {
        \OCP\App::registerAdmin('lrswitchboardbridge', 'lib/settings/admin');
        \OCP\App::registerPersonal('lrswitchboardbridge', 'lib/settings/personal');
    }


    /**
     * Load additional javascript files
     *
     * @return null
     */
    public static function loadScripts()
    {
        Util::addScript('lrswitchboardbridge', 'lrswitchboardbridge');
    }
}
