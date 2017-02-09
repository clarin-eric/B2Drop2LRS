<?php

/**
 * OwnCloud - lrswitchboardbridge App
 *
 * Create your routes in here. The name is the lowercase name of the Controller
 * without the Controller part, the stuff after the hash is the method.
 * e.g. page#index -> OCA\Eudat\Controller\PageController->index()
 *
 * The Controller class has to be registered in the Application.php file since
 * it's instantiated in there

 *
 * PHP Version 5-7
 *
 * @category  Owncloud
 * @package   lrswitchboardBridge
 * @author    EUDAT <claus.zinn@uni-tuebingen.de>
 * @copyright 2017 CLARIN-PLUS/EUDAT
 * @license   AGPL3 https://github.com/EUDAT-B2DROP/lrswitchboardbridge/blob/master/LICENSE
 * @link      https://github.com/EUDAT-B2DROP/lrswitchboardbridge.git
 */

$application = new OCA\lrswitchboardBridge\AppInfo\Application();

$application->registerRoutes(
    $this,
    ['routes' => [
        ['name' => 'View#transferFile', 'url' => '/', 'verb' => 'GET'],
    ]]
);
