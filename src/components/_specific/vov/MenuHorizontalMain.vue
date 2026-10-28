<template>
  <div class="zero-menu-shell mb-1 corporate-bg-and-text">
    <b-navbar toggleable="lg" type="dark" class="zero-menu corporate-bg-and-text">
      <b-navbar-brand to="/" class="zero-menu-brand corporate-bg-and-text">
        <span class="zero-menu-name-full">{{ appName }}</span>
        <span class="zero-menu-name-short">{{ appNameShort }}</span>
      </b-navbar-brand>

      <b-navbar-nav class="zero-menu-always flex-row">
        <b-nav-item v-if="CU.isLoggedIn()" to="/tale/upsert" class="zero-menu-icon-item"
                    :title="$t('TXT_ADD_TALE')" :aria-label="$t('TXT_ADD_TALE')">
          <i class="bi bi-plus-circle-fill" aria-hidden="true"></i>
        </b-nav-item>
        <b-nav-item v-if="CU.isLoggedIn()" to="/notification" class="zero-menu-icon-item zero-menu-notifications"
                    :title="notificationsLabel" :aria-label="notificationsLabel">
          <i class="bi bi-info-circle-fill" aria-hidden="true"></i>
          <sup v-if="CU.attributes.count_notifications" class="zero-menu-notification-count btn btn-small btn-warning rounded-circle">
            {{ CU.attributes.count_notifications }}
          </sup>
        </b-nav-item>
      </b-navbar-nav>

      <button type="button" class="zero-menu-toggle" :aria-label="appName"
              :aria-expanded="mobileMenuOpen" @click="mobileMenuOpen = !mobileMenuOpen">
        <span class="zero-menu-toggle-name">{{ appNameShort }}</span>
      </button>

      <div id="zero-menu-collapse" class="zero-menu-collapse" :class="{ 'is-mobile-open': mobileMenuOpen }">
        <b-navbar-nav class="zero-menu-groups">
          <b-nav-item to="/" class="zero-menu-mobile-home corporate-bg-and-text">{{ appName }}</b-nav-item>

          <b-nav-item-dropdown v-if="CU.isLoggedIn()" :text="teamLabel"
                               toggle-class="corporate-bg-and-text text-decoration-none zero-menu-label"
                               menu-class="corporate-bg-and-text" class="zero-menu-group">
            <b-dropdown-item to="/auth/users">{{ peopleLabel }}</b-dropdown-item>
            <b-dropdown-item :to="{path: '/chat', query: {channel: 1}}">{{ textChatLabel }}</b-dropdown-item>
            <b-dropdown-item href="/apps/vue3video/call?cRoomId=1">{{ videoChatLabel }}</b-dropdown-item>
            <b-dropdown-item v-if="CU.isAdmin()" :href="`${ConfigApi.url_base}/admin/users`">User Management</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown v-if="showSoftTools" :text="softToolsLabel"
                               toggle-class="corporate-bg-and-text text-decoration-none zero-menu-label"
                               menu-class="corporate-bg-and-text" class="zero-menu-group">
            <b-dropdown-item :href="`${ConfigApi.url_base}/tools/SerializedDataEditor`">PHP-Serialized Data Editor online</b-dropdown-item>
            <b-dropdown-item :href="`${ConfigApi.url_base}/tools/JsonSearchReplaceBeautify`">JSON Search-Replace-Beautify online</b-dropdown-item>
            <b-dropdown-item to="/UrlParser">URL Parser + URL un-Parser (2 in 1)</b-dropdown-item>
            <b-dropdown-item to="/CliParser">CLI Parser</b-dropdown-item>
            <b-dropdown-item to="/Informer">{{ $t('Chronometer') }}</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown v-if="CU.isAdmin()" :text="hardToolsLabel"
                               toggle-class="corporate-bg-and-text text-decoration-none zero-menu-label"
                               menu-class="corporate-bg-and-text" class="zero-menu-group">
            <b-dropdown-item to="/RestCall">HTTP calls with browser</b-dropdown-item>
            <b-dropdown-item :href="`${ConfigApi.url_base}/SendRestApiQueries/BaseCurlCalls`">HTTP calls with server</b-dropdown-item>
            <b-dropdown-item :href="`${ConfigApi.url_base}/AdminDbManager/DbTablesColumnsInfo`">DB Manager</b-dropdown-item>
            <b-dropdown-item :href="`${ConfigApi.url_base}/addon/cam/`">Borg WebCam</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </div>

      <b-navbar-nav class="zero-menu-account flex-row ms-auto">
        <li class="nav-item zero-menu-language">
          <aSelect v-model="languageSelected" :options="languageList" :modeEdit="true"
                   :allowEmpty="false" :clearable="false" :searchable="false"
                   valueKey="value" labelKey="text" inputWidth="3ch" />
        </li>

        <b-nav-item-dropdown v-if="!CU.isLoggedIn()" end
                             toggle-class="corporate-bg-and-text text-decoration-none zero-menu-label"
                             menu-class="corporate-bg-and-text" class="zero-menu-account-dropdown">
          <template #button-content>
            <i class="bi bi-check-square-fill" aria-hidden="true"></i>
            <span>{{ $t('TXT_LOGIN') }}</span>
          </template>
          <b-dropdown-item to="/auth/login">{{ $t('TXT_LOGIN') }}</b-dropdown-item>
          <b-dropdown-item v-if="registrationAllowed" to="/auth/register">{{ $t('TXT_REGISTER') }}</b-dropdown-item>
          <b-dropdown-item to="/auth/reset_password_request">{{ $t('TXT_RESET_PASS_REQUEST') }}</b-dropdown-item>
          <b-dropdown-item to="/auth/reset_password_with_code">{{ $t('TXT_RESET_PASS_CODE') }}</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown v-else end
                             toggle-class="corporate-bg-and-text text-decoration-none zero-menu-user-toggle"
                             menu-class="corporate-bg-and-text" class="zero-menu-account-dropdown">
          <template #button-content>
            <img v-if="CU.attributes.emblem" :src="CU.attributes.emblem" :alt="userName" class="zero-menu-avatar a-circle">
            <img v-else src="@/assets/anarki.png" alt="" class="zero-menu-avatar a-circle">
            <span class="zero-menu-user-name">{{ userName }}</span>
          </template>
          <b-dropdown-item to="/auth/profile">{{ $t('TXT_PROFILE') }}</b-dropdown-item>
          <b-dropdown-item to="/tale/upsert">{{ newPostLabel }}</b-dropdown-item>
          <b-dropdown-item to="/notification">{{ notificationsLabel }}</b-dropdown-item>
          <b-dropdown-item to="/auth/change_password">{{ $t('TXT_CHANGE_PASS') }}</b-dropdown-item>
          <b-dropdown-item to="/auth/logout">{{ $t('TXT_LOGOUT') }}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import CurrentUser from "@/services/CurrentUser";
import ConfigApi from "@/configs/ConfigApi";
import CurrentLocale from "@/services/CurrentLocale";
import aSelect from "@/components/elements/form/aSelect.vue";

export default {
  name: "MenuHorizontalMain",
  components: {aSelect},
  data() {
    return {
      ConfigApi,
      CU: CurrentUser.obj(),
      languageList: CurrentLocale.variants,
      languageSelected: CurrentLocale.language,
      appName: import.meta.env.VITE_APP_ALINA_NAME || "ZERO",
      appNameShort: import.meta.env.VITE_APP_ALINA_NAME_SHORT || import.meta.env.VITE_APP_ALINA_NAME || "Z",
      toolsAllowed: String(import.meta.env.VITE_APP_ALINA_MENU_TOOL || "") === "1",
      registrationAllowed: String(import.meta.env.VITE_APP_ALINA_MENU_REGISTRATION || "") === "1",
      mobileMenuOpen: false,
    };
  },
  computed: {
    isRussian() { return String(this.languageSelected).toLowerCase().startsWith("ru"); },
    showSoftTools() { return this.toolsAllowed || this.CU.isAdmin(); },
    userName() { return this.CU.attributes.firstname || this.CU.attributes.mail || "ツ"; },
    teamLabel() { return this.isRussian ? "Команда" : "Team"; },
    peopleLabel() { return this.isRussian ? "Люди" : "People"; },
    textChatLabel() { return this.isRussian ? "Текстовый чат" : "Text chat"; },
    videoChatLabel() { return this.isRussian ? "Видео чат" : "Video chat"; },
    softToolsLabel() { return this.isRussian ? "Инструменты" : "Soft Tools"; },
    hardToolsLabel() { return this.isRussian ? "Приложения" : "Hard Tools"; },
    newPostLabel() { return this.isRussian ? "Новая публикация" : "New post"; },
    notificationsLabel() { return this.isRussian ? "Уведомления" : "Notifications"; },
  },
  methods: {
    setLocale(newVal) {
      this.languageSelected = newVal;
      CurrentLocale.language = newVal;
      this.$i18n.locale = newVal;
    },
  },
  watch: {
    languageSelected(newVal) { this.setLocale(newVal); },
  },
};
</script>

<style scoped>
.zero-menu-shell, .zero-menu { width: 100%; }
.zero-menu-shell { margin-bottom: 50px !important; }
.zero-menu { position: relative; display: flex; flex-wrap: nowrap; gap: 3mm; min-width: 0; padding: .25rem clamp(.35rem, 1vw, 1rem); }
.zero-menu-brand, .zero-menu-always, .zero-menu-account, .zero-menu-groups { flex-wrap: nowrap !important; align-items: center; }
.zero-menu-brand { flex: 0 1 auto; min-width: 0; margin-right: 5mm; color: inherit; font-size: clamp(.72rem, 1.5vw, 1rem); font-weight: 700; line-height: 1.05; overflow-wrap: anywhere; text-align: left; }
.zero-menu-name-short { display: none; }
.zero-menu-always { flex: 0 0 auto; gap: 3mm; }
.zero-menu-collapse { display: flex; min-width: 0; }
.zero-menu-groups { min-width: 0; gap: 3mm; }
.zero-menu-group, .zero-menu-icon-item, .zero-menu-language { min-width: 0; margin: 0; }
.zero-menu-account { flex: 0 0 auto; min-width: 0; gap: 3mm; }
.zero-menu-account-dropdown { min-width: 0; }
.zero-menu-mobile-home { display: none; margin-right: 5mm; font-weight: 700; }
.zero-menu-toggle { display: none; margin-right: 5mm; font-weight: 700; }
.zero-menu-toggle-name { font: inherit; }
.zero-menu-toggle:focus, .zero-menu-toggle:focus-visible, .zero-menu-toggle:active { outline: 0; box-shadow: none; }
.zero-menu-icon-item :deep(.nav-link) { padding: .35rem .5rem; }
.zero-menu :deep(.zero-menu-label), .zero-menu :deep(.zero-menu-user-toggle) { display: flex; align-items: center; justify-content: center; min-width: 0; max-width: 18ch; padding: .35rem clamp(.3rem, .7vw, .65rem); color: inherit !important; font-size: clamp(.65rem, 1.15vw, .95rem); line-height: 1.05; overflow-wrap: anywhere; text-align: center; white-space: normal; }
.zero-menu :deep(.zero-menu-user-toggle) { flex-wrap: nowrap; gap: 1mm; font-size: .75rem; white-space: nowrap; }
.zero-menu :deep(.dropdown-menu) { width: max-content; max-width: 90vw; color: inherit; background: var(--corporate-bg); }
.zero-menu :deep(.dropdown-item) { width: max-content; min-width: 100%; max-width: 90vw; color: inherit; font-size: clamp(.72rem, 1.15vw, .95rem); white-space: normal; }
.zero-menu :deep(.dropdown-item:hover), .zero-menu :deep(.dropdown-item:focus) { color: inherit; background: var(--corporate-bg-a); }
.zero-menu-language :deep(.nav-link) { padding: 0; }
.zero-menu-language :deep(.aSelect) { margin: 0; color: inherit; font-size: .7rem; }
.zero-menu-language :deep(.aSelect-field) { width: 3ch !important; min-width: 3ch; min-height: 28px; border: 0; border-radius: 0; padding: 0; background: transparent; }
.zero-menu-language :deep(.aSelect-field input) { min-width: 0; width: 1px; }
.zero-menu-language :deep(.aSelect-single) { left: 0; right: 0; overflow: visible; border: 0; border-radius: 0; padding: 0; background: transparent; text-overflow: clip; }
.zero-menu-language :deep(.aSelect-arrow) { display: none; }
.zero-menu-language :deep(.aSelect-menu) { right: auto; width: max-content; min-width: 100%; color: inherit; background: var(--corporate-bg); }
.zero-menu-language :deep(.aSelect-option) { white-space: nowrap; }
.zero-menu-notifications { position: relative; }
.zero-menu-notification-count { position: absolute; top: -.1rem; right: -.15rem; min-width: 1.1rem; height: 1.1rem; margin: 0; padding: 0 .2rem; font-size: .7rem; line-height: 1.1rem; }
.zero-menu-avatar { width: 32px; height: 32px; flex: 0 0 32px; object-fit: cover; }
.zero-menu-user-name { min-width: 0; white-space: nowrap; }

@media (max-width: 991.98px) {
  .zero-menu-name-full { display: none; }
  .zero-menu-name-short { display: inline; }
  .zero-menu-brand { display: none; }
  .zero-menu-toggle { order: -1; display: block; flex: 0 0 auto; min-width: 0; padding: .35rem .5rem; border: 0; color: inherit; background: transparent; }
  .zero-menu-toggle-name { display: block; font-size: .75rem; line-height: 1; }
  .zero-menu-collapse { position: absolute; z-index: 1050; top: calc(100% + 3mm); left: 0; right: 0; display: none; padding: .5rem; border-radius: 0 0 8px 8px; background: var(--corporate-bg); box-shadow: 0 8px 18px #0006; }
  .zero-menu-collapse.is-mobile-open { display: block; }
  .zero-menu-groups { flex-direction: column !important; align-items: stretch; }
  .zero-menu-mobile-home { display: block; width: 100%; }
  .zero-menu-mobile-home :deep(.nav-link) { width: 100%; color: inherit; font-size: .9rem; text-align: left; }
  .zero-menu-group { width: 100%; }
  .zero-menu :deep(.zero-menu-label) { justify-content: flex-start; max-width: none; width: 100%; font-size: .9rem; text-align: left; }
  .zero-menu-account { margin-left: auto !important; }
  .zero-menu :deep(.zero-menu-user-toggle) { max-width: none; }
  .zero-menu-user-name { font-size: clamp(.62rem, 3vw, .9rem); }
}

@media (max-width: 430px) {
  .zero-menu { padding-inline: .2rem; }
  .zero-menu-brand { flex-basis: 1.8rem; font-size: .75rem; }
  .zero-menu-language :deep(.aSelect-field) { padding: 0; }
  .zero-menu-icon-item :deep(.nav-link) { padding-inline: .3rem; }
  .zero-menu :deep(.zero-menu-user-toggle), .zero-menu :deep(.zero-menu-label) { padding-inline: .25rem; }
  .zero-menu-avatar { width: 28px; height: 28px; flex-basis: 28px; }
}
</style>
