<template>
  <div class="mb-1">
    <b-navbar toggleable="lg" type="dark" class="corporate-bg-and-text">
      <!--################################################## -->
      <!--region ALWAYS-->
      <b-navbar-brand to="/">¯\_(ツ)_/¯</b-navbar-brand>
      <b-navbar-nav class="flex-row">
        <b-nav-item to="/tale/upsert" v-if="CU.isLoggedIn()" class="m-2">
          <b-icon-plus-circle-fill></b-icon-plus-circle-fill>
        </b-nav-item>
        <b-nav-item to="/notification" v-if="CU.isLoggedIn()" class="m-2">
          <b-icon-info-circle-fill></b-icon-info-circle-fill>
          <sup
              v-if="CU.attributes.count_notifications"
              class="btn btn-small btn-warning rounded-circle p-0 m-0 pr-1 pl-1"
              style="font-size: .8rem; line-height: 1.2rem; height:1.2rem; vertical-align: middle; left:-.3rem"
          >&nbsp;{{ CU.attributes.count_notifications }}&nbsp;</sup>
        </b-nav-item>
        <b-nav-item to="/auth/login" v-if="!CU.isLoggedIn()" class="m-2">
          <button class="btn-sm btn-dark">
            <b-icon-check-square-fill></b-icon-check-square-fill>
            {{ $t("TXT_LOGIN") }}
          </button>
        </b-nav-item>
      </b-navbar-nav>

      <!--endregion ALWAYS-->
      <!--################################################## -->
      <!--region SMALL/BIG SCREEN-->
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item-dropdown :text="$t('TXT_TOOLS')" left class="m-2">
            <b-dropdown-item :href="`${ConfigApi.url_base}/tools/SerializedDataEditor`">PHP-Serialized Data Editor online</b-dropdown-item>
            <b-dropdown-item :href="`${ConfigApi.url_base}/tools/JsonSearchReplaceBeautify`">JSON Search-Replace-Beautify online</b-dropdown-item>
            <b-dropdown-item to="/UrlParser">URL Parser + URL un-Parser (2 in 1)</b-dropdown-item>
            <b-dropdown-item to="/CliParser">CLI Parser</b-dropdown-item>
            <b-dropdown-item to="/Informer">Chronometer</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown :text="$t('TXT_TOOLS_ADMIN')" left v-if="CU.isAdmin()" class="m-2">
            <b-dropdown-item to="/RestCall">HTTP calls with browser</b-dropdown-item>
            <b-dropdown-item :href="`${ConfigApi.url_base}/SendRestApiQueries/BaseCurlCalls`">HTTP calls with server</b-dropdown-item>
            <b-dropdown-item :href="`${ConfigApi.url_base}/AdminDbManager/DbTablesColumnsInfo`">DB Manger</b-dropdown-item>
            <b-dropdown-item :href="`${ConfigApi.url_base}/admin/users`">User Management</b-dropdown-item>
            <b-dropdown-item to="/about">UI tests</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item class="m-2">
            <b-form-select
                size="sm"
                v-model="languageSelected"
                :options="languageList"
            >
            </b-form-select>
          </b-nav-item>
        </b-navbar-nav>
        <!--################################################## -->
        <!--region USER-->
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template slot="button-content">
              <!--<em>{{this.CU.name()}}</em>-->
              <img :src="CU.attributes.emblem" :alt="CU.attributes.firstname" height="40px" v-if="CU.attributes.emblem">
              <img v-if="!CU.isLoggedIn() || !CU.attributes.emblem" src="@/assets/anarki.png" height="40px">
              <span class="mr-1 ml-1">{{ CU.attributes.firstname || CU.attributes.mail || 'ツ' }}</span>
            </template>
            <b-dropdown-item to="/auth/login" v-if="!CU.isLoggedIn()">{{ $t("TXT_LOGIN") }}</b-dropdown-item>
            <b-dropdown-item to="/auth/register" v-if="!CU.isLoggedIn()">{{ $t("TXT_REGISTER") }}</b-dropdown-item>
            <b-dropdown-item to="/auth/reset_password_request" v-if="!CU.isLoggedIn()">{{ $t("TXT_RESET_PASS_REQUEST") }}</b-dropdown-item>
            <b-dropdown-item to="/auth/reset_password_with_code" v-if="!CU.isLoggedIn()">{{ $t("TXT_RESET_PASS_CODE") }}</b-dropdown-item>
            <!---->
            <b-dropdown-item to="/tale/upsert" v-if="CU.isLoggedIn()">{{ $t("TXT_ADD_TALE") }}</b-dropdown-item>
            <b-dropdown-item to="/auth/profile" v-if="CU.isLoggedIn()">{{ $t("TXT_PROFILE") }}</b-dropdown-item>
            <b-dropdown-item to="/auth/change_password" v-if="CU.isLoggedIn()">{{ $t("TXT_CHANGE_PASS") }}</b-dropdown-item>
            <b-dropdown-item to="/auth/logout" v-if="CU.isLoggedIn()">{{ $t("TXT_LOGOUT") }}</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
        <!--endregion USER-->
        <!--################################################## -->
      </b-collapse>
      <!--endregion SMALL/BIG SCREEN-->
      <!--################################################## -->
    </b-navbar>
  </div>
</template>

<script>
import CurrentUser    from "@/services/CurrentUser";
import ConfigApi      from "@/configs/ConfigApi";
import CurrentLocale  from "@/services/CurrentLocale";
import ConfigCkEditor from "@/configs/ConfigCkEditor";

export default {
  name: "MenuHorizontalMain",
  data() {
    return {
      ConfigApi,
      CU:               CurrentUser.obj(),
      languageList:     CurrentLocale.variants,
      languageSelected: CurrentLocale.language,
    }
  },
  methods: {
    setLocale(newVal) {
      this.languageSelected   = newVal;
      CurrentLocale.language  = newVal;
      ConfigCkEditor.language = newVal;
      this.$root.$i18n.locale = newVal;
    }
  },
  watch:   {
    "CU": function (v) {
    },
    languageSelected(newVal) {
      this.setLocale(newVal);
    }
  }
};
</script>