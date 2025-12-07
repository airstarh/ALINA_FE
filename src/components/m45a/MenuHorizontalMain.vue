<template>
  <div class="mb-1" id="alina-main-menu">
    <b-navbar toggleable="lg" type="light" class="corporate-bg-and-text">
      <b-navbar-brand to="/">
        <span style="font-size: min(7vw, 2em)">
        Миронова 45А
        </span>
        <br>
        <span style="font-size: min(3vw, 1em)">официальный сайт</span>
      </b-navbar-brand>
      <b-navbar-nav class="flex-row">
        <b-nav-item to="/tale/upsert" v-if="CU.isLoggedIn()" class="mr-3">
          <b-icon-plus-circle-fill></b-icon-plus-circle-fill>
        </b-nav-item>
        <b-nav-item to="/notification" v-if="CU.isLoggedIn()" class="mr-3">
          <b-icon-info-circle-fill></b-icon-info-circle-fill>
          <sup
              v-if="CU.attributes.count_notifications"
              class="btn btn-small btn-warning rounded-circle p-0 m-0 pr-1 pl-1"
              style="font-size: .8rem; line-height: 1.2rem; height:1.2rem; vertical-align: middle; left:-.3rem"
          >&nbsp;{{ CU.attributes.count_notifications }}&nbsp;</sup>
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template slot="button-content">
              <img :src="CU.attributes.emblem" :alt="CU.attributes.firstname" height="40px" v-if="CU.attributes.emblem">
              <img v-if="!CU.isLoggedIn() || !CU.attributes.emblem" src="@/assets/anarki.png" height="40px">
              <span class="mr-1 ml-1">{{ CU.attributes.firstname || CU.attributes.mail || 'ツ' }}</span>
            </template>
            <b-dropdown-item to="/auth/login" v-if="!CU.isLoggedIn()">{{ $t("TXT_LOGIN") }}</b-dropdown-item>
            <b-dropdown-item to="/tale/upsert" v-if="CU.isLoggedIn()">{{ $t("TXT_ADD_TALE") }}</b-dropdown-item>
            <b-dropdown-item to="/auth/profile" v-if="CU.isLoggedIn()">{{ $t("TXT_PROFILE") }}</b-dropdown-item>
            <b-dropdown-item to="/auth/change_password" v-if="CU.isLoggedIn()">{{ $t("TXT_CHANGE_PASS") }}</b-dropdown-item>
            <b-dropdown-item to="/auth/logout" v-if="CU.isLoggedIn()">{{ $t("TXT_LOGOUT") }}</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
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
    }
  },
  methods: {
    setLocale(newVal) {
      this.languageSelected   = newVal;
      CurrentLocale.language  = newVal;
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