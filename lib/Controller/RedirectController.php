<?php

/**
 * Nextcloud - SwitchboardBridge App
 *
 * PHP Version 8
 *
 * @category  Nextcloud
 * @package   SwitchboardBridge
 * @author    André Moreira <andre@clarin.eu>
 * @copyright 2025 EUDAT/CLARIN
 * @license   https://github.com/clarin-eric/B2Drop2LRS/blob/master/LICENSE AGPL v3
 * @link      https://github.com/clarin-eric/B2Drop2LRS
 */

namespace OCA\SwitchboardBridge\Controller;

use OCA\SwitchboardBridge\Service\ConfigService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\DataDisplayResponse;
use OCP\IRequest;
use OCP\Util;

/**
 * A contoller to redirect the client browser to the Switchboard. This is needed
 * since the CSP might not be up to date on the client side. e.g. when the user
 * sets up a custom URL for the Switchboard
 *
 * @category Nextcloud
 * @package  SwitchboardBridge
 * @author   André Moreira <andre@clarin.eu>
 * @license  https://github.com/clarin-eric/B2Drop2LRS/blob/master/LICENSE AGPL v3
 * @link     https://github.com/clarin-eric/B2Drop2LRS
 */
class RedirectController extends Controller
{
    /**
     * Constructor
     *
     * @param string        $appName       this app name
     * @param IRequest      $request       the request
     * @param ConfigService $configService the configuration service
     * @param ?string       $userId        the user id
     */
    public function __construct(
        string $appName,
        IRequest $request,
        private ConfigService $configService,
        private ?string $userId,
    ) {
        parent::__construct($appName, $request);
    }

    /**
     * Creates an auto submit form to redirect the users' browser to the Swithcboard
     *
     * @return         void
     * @NoCSRFRequired
     * @psalm-return   DataDisplayResponse<200>
     */
    #[NoAdminRequired]
    public function redirectClient(): DataDisplayResponse
    {
        $sbUrl = $this->configService->getSwitchboardUrlForUser($this->userId);

        $response = new DataDisplayResponse(
            '<body onload="document.forms.sbform.submit()">
                <form name="sbform" action="' . $sbUrl . '" method="POST"
                 enctype="multipart/form-data">
                    <input type="hidden" name="url" value="'
                     . $this->request->getParam('url') . '">
                    <input type="hidden" name="origin" value="'
                     . $this->request->getParam('origin') . '">
                    <input type="hidden" name="mimetype" value="'
                     . $this->request->getParam('mimetype') . '">
                </form>
            </body>',
            Http::STATUS_OK
        );

        $csp = $response->getContentSecurityPolicy();

        $csp->addAllowedFormActionDomain($sbUrl);
        $csp->addAllowedFrameDomain($sbUrl);
        $csp->addAllowedScriptDomain("'unsafe-inline'");

        return $response;
    }
}
