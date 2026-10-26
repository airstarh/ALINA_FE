<template>
  <div class="mb-1">
    <b-navbar toggleable="lg" type="dark" class="corporate-bg-and-text">
      <!--################################################## -->
      <!--region ALWAYS-->
      <b-navbar-brand to="/">¯\_(ツ)_/¯</b-navbar-brand>
      <b-navbar-nav class="flex-row">
        <b-nav-item to="/chat" class="m-2" :title="$t('Chat')" :aria-label="$t('Chat')">
          <i class="bi bi-chat-dots-fill" aria-hidden="true"></i>
        </b-nav-item>
        <b-nav-item to="/tale/upsert" v-if="CU.isLoggedIn()" class="m-2">
          <i class="bi bi-plus-circle-fill"></i>
        </b-nav-item>
        <b-nav-item to="/notification" v-if="CU.isLoggedIn()" class="m-2">
          <i class="bi bi-info-circle-fill"></i>
          <sup
            v-if="CU.attributes.count_notifications"
            class="btn btn-small btn-warning rounded-circle p-0 m-0 pe-1 ps-1"
            style="font-size: .8rem; line-height: 1.2rem; height:1.2rem; vertical-align: middle; left:-.3rem">&nbsp;{{ CU.attributes.count_notifications }}&nbsp;</sup>
        </b-nav-item>
        <b-nav-item to="/auth/login" v-if="!CU.isLoggedIn()" class="m-2">
          <button class="btn-sm btn-dark">
            <i class="bi bi-check-square-fill"></i>
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
          <b-nav-item-dropdown :text="$t('TXT_TOOLS')" toggle-class="corporate-bg-and-text text-decoration-none" class="m-2">
            <b-dropdown-item :href="`${ConfigApi.url_base}/tools/SerializedDataEditor`">PHP-Serialized Data Editor online</b-dropdown-item>
            <b-dropdown-item :href="`${ConfigApi.url_base}/tools/JsonSearchReplaceBeautify`">JSON Search-Replace-Beautify online</b-dropdown-item>
            <b-dropdown-item to="/UrlParser">URL Parser + URL un-Parser (2 in 1)</b-dropdown-item>
            <b-dropdown-item to="/CliParser">CLI Parser</b-dropdown-item>
            <b-dropdown-item to="/Informer">{{ $t('Chronometer') }}</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown :text="$t('TXT_TOOLS_ADMIN')" toggle-class="corporate-bg-and-text text-decoration-none" v-if="CU.isAdmin()" class="m-2">
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
              :options="languageList">
            </b-form-select>
          </b-nav-item>
        </b-navbar-nav>
        <!--################################################## -->
        <!--region USER-->
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ms-auto">
          <b-nav-item-dropdown end toggle-class="corporate-bg-and-text text-decoration-none">
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <!--<em>{{this.CU.name()}}</em>-->
              <img :src="CU.attributes.emblem" :alt="CU.attributes.firstname" height="40px" v-if="CU.attributes.emblem" class="a-circle">
              <img v-if="!CU.isLoggedIn() || !CU.attributes.emblem" src="@/assets/anarki.png" height="40px" class="a-circle">
              <span class="me-1 ms-1">{{ CU.attributes.firstname || CU.attributes.mail || 'ツ' }}</span>
            </template>
            <b-dropdown-item to="/auth/login" v-if="!CU.isLoggedIn()">{{ $t("TXT_LOGIN") }}</b-dropdown-item>
            <b-dropdown-item to="/auth/register" v-if="registrationAllowed && !CU.isLoggedIn()">{{ $t("TXT_REGISTER") }}</b-dropdown-item>
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

    <div style="width:95vw; margin: 10px auto; background-color: #221111; padding:5px 10px; border-radius: 10px;">
      <div class="row g-0 align-items-center">

        <div class="col-12 col-md-9">
          Настоящим уведомляем, что данный сайт содержит информацию, доступ к которой ограничен для лиц младше 18 лет в соответствии с действующим законодательством РФ. Продолжая использование сайта, вы подтверждаете, что достигли возраста 18 лет и принимаете условия ограничения.
          <br>
          <br>
          Этот сайт использует cookies. Продолжая просмотр, вы соглашаетесь с использованием файлов cookie.
        </div>

        <div class="col-12 col-md-3 text-center">
          <img :src="`${ConfigApi.url_base}/kiss/alina.img/age18.png`" alt="18+" height="150">
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import CurrentUser    from "@/services/CurrentUser";
import ConfigApi      from "@/configs/ConfigApi";
import CurrentLocale  from "@/services/CurrentLocale";

export default {
  name: "MenuHorizontalMain",
  data() {
    return {
      ConfigApi,
      CU:               CurrentUser.obj(),
      languageList:     CurrentLocale.variants,
      languageSelected: CurrentLocale.language,
      registrationAllowed: String(import.meta.env.VITE_APP_ALINA_MENU_REGISTRATION || "") === "1",
    }
  },
  methods: {
    setLocale(newVal) {
      this.languageSelected   = newVal;
      CurrentLocale.language  = newVal;
      this.$i18n.locale = newVal;
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
