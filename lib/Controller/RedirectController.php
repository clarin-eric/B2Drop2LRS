<?php

namespace OCA\SwitchboardBridge\Controller;

use OCA\SwitchboardBridge\Service\ConfigService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\DataDisplayResponse;
use OCP\IRequest;
use OCP\Util;

class RedirectController extends Controller
{
    public function __construct(
        string $appName,
        IRequest $request,
        private ConfigService $configService,
        private ?string $userId,
    ) {
        parent::__construct($appName, $request);
    }

    /**
     * @NoCSRFRequired
     * @psalm-return DataDisplayResponse<200>
     */
    #[NoAdminRequired]
    public function redirectClient(): DataDisplayResponse
    {
        $sbUrl = $this->configService->getSwitchboardUrlForUser($this->userId);

        $response = new DataDisplayResponse(
            '<body onload="document.forms.sbform.submit()">
                <form name="sbform" action="' . $sbUrl . '" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="url" value="' . $this->request->getParam('url') .'">
                    <input type="hidden" name="origin" value="' . $this->request->getParam('origin') .'">
                    <input type="hidden" name="mimetype" value="' . $this->request->getParam('mimetype') .'">
                </form>
            </body>',
            Http::STATUS_OK
        );

        $response->getContentSecurityPolicy()->addAllowedFormActionDomain($sbUrl);
        $response->getContentSecurityPolicy()->addAllowedFrameDomain($sbUrl);
        $response->getContentSecurityPolicy()->addAllowedScriptDomain("'unsafe-inline'");

        return $response;
    }
}
