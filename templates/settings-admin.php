<div class="section" id="eudat_lrswitchboard">
    <h2>EUDAT LRSWITCHBOARD Bridge</h2>

    <p id="lrswitchboardUrlField">
        <input title="publish_baseurl" type="text" name="publish_baseurl"
               id="lrswitchboardUrl"
               placeholder="https://lrswitchboard.eudat.eu" style="width: 400px"
               value="<?php p($_['publish_baseurl']); ?>"/>
        <em>External LRSWITCHBOARD API endpoint</em>
    </p>
    <p id="maxLrswitchboardUploadsPerUser">
        <input title="max_uploads" type="text" name="max_uploads"
               id="maxLrswitchboardUploads"
               placeholder="5" style="width: 400px"
               value="<?php p($_['max_uploads']); ?>"/>
        <em># of uploads per user at the same time</em>
    </p>
    <p id="maxLrswitchboardUploadSizePerFile">
        <input title="max_upload_filesize" type="text" name="max_upload_filesize"
               id="maxLrswitchboardUploadFilesize"
               placeholder="512" style="width: 400px"
               value="<?php p($_['max_upload_filesize']); ?>"/>
        <em>MB maximum filesize per upload</em>
    </p>
    <p>
        <input type="checkbox" name="check_ssl" id="checkSsl" class="checkbox"
               value="1" <?php if ($_['check_ssl']) print_unescaped('checked="checked"'); ?> />
        <label for="checkSsl">
            <?php p($l->t('Check valid secure (https) connections to LRSWITCHBOARD'));?>
        </label>
    </p>

</div>
