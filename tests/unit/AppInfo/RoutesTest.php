<?php
/**
 * LRSWITCHBOARDBRIDGE
 *
 * PHP Version 7
 *
 * @category  Nextcloud
 * @package   Lrswitchboardbridge
 * @author    EUDAT <b2drop-devel@postit.csc.fi>
 * @copyright 2015 EUDAT
 * @license   AGPL3 https://github.com/EUDAT-B2DROP/lrswitchboardbridge/blob/master/LICENSE
 * @link      https://github.com/EUDAT-B2DROP/lrswitchboardbridge.git
 */
namespace OCA\Lrswitchboardbridge\Tests\AppInfo;

use PHPUnit\Framework\TestCase;

class Test extends TestCase  {
    public function testFile() {
        $routes = require_once __DIR__ . '/../../../appinfo/routes.php';


        $expected = [
            'routes' => [
                [
                    'name' => 'View#transferFile',
                    'url' => '/',
                    'verb' => 'GET'
                ],
            ]
        ];
        $this->assertSame($expected, $routes);
    }
}
