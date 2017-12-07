<?php
/**
 * Nextcloud - Lrswitchboardbridge App
 *
 * Settings view for a user, showing the lrswitchboard api url
 * PHP Version 7-2
 *
 * @category  Nextcloud
 * @package   LrswitchboardBridge
 * @author    EUDAT <b2drop-devel@postit.csc.fi>
 * @copyright 2015 EUDAT
 * @license   AGPL3 https://github.com/EUDAT-B2DROP/lrswitchboardbridge/blob/master/LICENSE
 * @link      https://github.com/EUDAT-B2DROP/lrswitchboardbridge.git
 */

use OCP\Template;
use OCP\User;
use OCP\Util;

User::checkLoggedIn();
$userId = \OC::$server->getUserSession()->getUser()->getUID();

Util::addScript('lrswitchboardbridge', 'settings-personal');

$tmpl = new Template('lrswitchboardbridge', 'settings-personal');
$tmpl->assign(
    'switchboard_baseurl',
    \OC::$server->getConfig()->getAppValue(
        'lrswitchboardbridge',
        'switchboard_baseurl'
    )
);

return $tmpl->fetchPage();
