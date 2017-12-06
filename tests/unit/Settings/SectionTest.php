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

namespace OCA\Lrswitchboardbridge\ests\Settings;

use OCP\IURLGenerator;
use PHPUnit\Framework\TestCase;

class SectionTest extends TestCase  {
    /** @var \OCA\Lrswitchboardbridge\Settings\Section */
    private $section;
    /** @var  IURLGenerator|\PHPUnit\Framework\MockObject\MockObject */
    private $urlGenerator;

    public function setUp() {
        $this->urlGenerator = $this->createMock(IURLGenerator::class);
        $this->section = new \OCA\Lrswitchboardbridge\Settings\AdminSection();

        return parent::setUp();
    }

    public function testGetId() {
        $this->assertSame('lrswitchboardbridge', $this->section->getID());
    }

    public function testGetName() {
        $this->assertSame('EUDAT', $this->section->getName());
    }

    public function testGetPriority() {
        $this->assertSame(75, $this->section->getPriority());
    }

    public function testGetIcon() {
        $this->markTestSkipped(
            'We do not have a icon yet.'
        );
        $this->urlGenerator
            ->expects($this->once())
            ->method('imagePath')
            ->with('user_saml', 'app-dark.svg')
            ->willReturn('/apps/user_saml/myicon.svg');
        $this->assertSame('/apps/user_saml/myicon.svg', $this->section->getIcon());
    }
}
