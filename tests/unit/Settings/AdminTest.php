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

namespace OCA\Lrswitchboardbridge\Tests\Settings;

use OCP\AppFramework\Http\TemplateResponse;
use OCP\IConfig;
use PHPUnit\Framework\TestCase;

class AdminTest extends TestCase  {
    /** @var \OCA\Lrswitchboardbridge\Settings\Admin */
    private $admin;
    /** @var IConfig|\PHPUnit\Framework\MockObject\MockObject */
    private $config;

    public function setUp() {
        $this->config = $this->createMock(IConfig::class);

        $this->admin = new \OCA\Lrswitchboardbridge\Settings\Admin(
            $this->config
        );

        return parent::setUp();
    }

    public function testGetForm() {
        $params = $this->formDataProvider();

        $expected = new TemplateResponse('lrswitchboardbridge', 'settings-admin', $params);
        $this->assertEquals($expected, $this->admin->getForm());
    }

    public function testGetSection() {
        $this->assertSame('lrswitchboardbridge', $this->admin->getSection());
    }

    public function testGetPriority() {
        $this->assertSame(0, $this->admin->getPriority());
    }
}
