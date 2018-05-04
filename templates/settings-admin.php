<div class="section" id="eudat_lrswitchboard">
    <h2>CLARIN LRSWITCHBOARD Bridge</h2>
    <p id="lrswitchboardUrlField">
        <input title="switchboard_baseurl" type="text" name="switchboard_baseurl"
               id="lrswitchboardUrl"
               placeholder="https://switchboard.clarin.eu" style="width: 400px"
               value="<?php p($_['switchboard_baseurl']); ?>"/>
        <em>Base URL of the RESOURCE SWITCHBOARD</em>
    </p>
    <p>
        <input type="checkbox" name="check_ssl" id="checkSsl" class="checkbox"
               value="1" <?php if ($_['check_ssl']) print_unescaped('checked="checked"'); ?> />
        <label for="checkSsl">
            <?php p($l->t('Check valid secure (https) connections to LRSWITCHBOARD'));?>
        </label>
    </p>

</div>
