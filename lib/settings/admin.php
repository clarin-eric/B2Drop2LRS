<?php
/**
 * OwnCloud - Lrswitchboardbridge App
 *
 * PHP Version 5-7
 *
 * @category  Owncloud
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
    'publish_baseurl',
    $config->getAppValue(
        'lrswitchboardbridge',
        'publish_baseurl'
    )
);
$tmpl->assign(
    'max_uploads',
    $config->getAppValue(
        'lrswitchboardbridge',
        'max_uploads'
    )
);
$tmpl->assign(
    'max_upload_filesize',
    $config->getAppValue(
        'lrswitchboardbridge',
        'max_upload_filesize'
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
