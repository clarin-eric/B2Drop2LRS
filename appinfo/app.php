<?php
/**
 * OwnCloud - lrswitchboardbridge App
 *
 * PHP Version 7-2
 *
 * @category  Owncloud
 * @package   lrswitchboardBridge
 * @author    CLARIN-PLUS/EUDAT <claus.zinn@uni-tuebingen.de>
 * @copyright 2017 CLARIN-PLUS/EUDAT
 * @license   AGPL3 https://github.com/EUDAT-B2DROP/lrswitchboardbridge/blob/master/LICENSE
 * @link      https://github.com/EUDAT-B2DROP/lrswitchboardbridge.git
 */


$application = new OCA\lrswitchboardBridge\AppInfo\Application();
$application->loadScripts();
$application->registerSettings();