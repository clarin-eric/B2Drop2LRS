<?php
/**
 * Nextcloud - lrswitchboardbridge App
 *
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
use OCP\Util;

script('lrswitchboardbridge', 'settings');

$config = \OC::$server->getConfig();

$tmpl = new Template('lrswitchboardbridge', 'settings-admin');
$tmpl->assign(
    'switchboard_baseurl',
    $config->getAppValue(
        'lrswitchboardbridge',
        'switchboard_baseurl'
    )
);

$tmpl->assign(
    'check_ssl',
    $config->getAppValue(
        'lrswitchboardbridge',
        'check_ssl',
        '1'
    )
);

return $tmpl->fetchPage();
