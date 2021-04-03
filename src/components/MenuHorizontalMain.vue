<template>
  <div class="mb-1" id="alina-main-menu">
    <b-navbar toggleable="lg" type="dark" class="alina-navigator">
      <b-navbar-brand to="/">¯\_(ツ)_/¯</b-navbar-brand>

      <b-navbar-nav class="flex-row">
        <b-nav-item to="/tale/upsert" v-if="CU.isLoggedIn()" class="mr-3">
          <b-icon-plus-circle-fill></b-icon-plus-circle-fill>
        </b-nav-item>
        <b-nav-item to="/notification" v-if="CU.isLoggedIn()" class="mr-3">
          <b-icon-info-circle-fill></b-icon-info-circle-fill>
          <sup
              v-if="CU.attributes.count_notifications"
              class="btn btn-small btn-warning rounded-circle p-0 m-0"
              style="font-size: .8rem; line-height: 1.2rem; height:1.2rem; vertical-align: middle; left:-.3rem"
          >&nbsp;{{ CU.attributes.count_notifications }}&nbsp;</sup>
        </b-nav-item>

        <b-nav-item to="/auth/login" v-if="!CU.isLoggedIn()" class="mr-3">
          <button class="btn-sm btn-light">Login</button>
        </b-nav-item>
        <b-nav-item to="/auth/register" v-if="!CU.isLoggedIn()" class="mr-3">
          <button class="btn-sm btn-light">Register</button>
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>

          <!--<b-nav-item to="/auth/profile" v-if="CU.isLoggedIn()" class="mr-3">-->
          <!--    <b-icon-person-fill></b-icon-person-fill>-->
          <!--</b-nav-item>-->

          <b-nav-item-dropdown text="Tools" left>
            <b-dropdown-item :href="`${ConfigApi.url_base}/tools/SerializedDataEditor`">PHP-Serialized Data Editor online</b-dropdown-item>
            <b-dropdown-item :href="`${ConfigApi.url_base}/tools/JsonSearchReplaceBeautify`">JSON Search-Replace-Beautify online</b-dropdown-item>
            <b-dropdown-item to="/UrlParser">URL Parser + URL un-Parser (2 in 1)</b-dropdown-item>
            <b-dropdown-item to="/CliParser">CLI Parser</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown text="Admin Tools" left v-if="CU.isAdmin()">
            <b-dropdown-item to="/RestCall">HTTP calls with browser</b-dropdown-item>
            <b-dropdown-item :href="`${ConfigApi.url_base}/SendRestApiQueries/BaseCurlCalls`">HTTP calls with server</b-dropdown-item>
            <b-dropdown-item :href="`${ConfigApi.url_base}/AdminDbManager/DbTablesColumnsInfo`">DB Manger</b-dropdown-item>
            <b-dropdown-item to="/about">about</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <!--<b-nav-form>-->
          <!--    <b-form-input-->
          <!--            size="sm"-->
          <!--            class="mr-sm-2"-->
          <!--            placeholder="Search"-->
          <!--    ></b-form-input>-->
          <!--    <b-button size="sm" class="my-2 my-sm-0" type="submit"-->
          <!--    >Search-->
          <!--    </b-button-->
          <!--    >-->
          <!--</b-nav-form>-->

          <!--<b-nav-item-dropdown text="Lang" right>-->
          <!--    <b-dropdown-item href="#">EN</b-dropdown-item>-->
          <!--    <b-dropdown-item href="#">ES</b-dropdown-item>-->
          <!--    <b-dropdown-item href="#">RU</b-dropdown-item>-->
          <!--    <b-dropdown-item href="#">FA</b-dropdown-item>-->
          <!--</b-nav-item-dropdown>-->

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template slot="button-content">
              <!--<em>{{this.CU.name()}}</em>-->
              <img :src="CU.attributes.emblem" :alt="CU.attributes.firstname" height="40px" v-if="CU.attributes.emblem">
              <img v-if="!CU.isLoggedIn() || !CU.attributes.emblem" src="@/assets/anarki.png" height="40px">
              <span class="mr-1 ml-1">{{ CU.attributes.firstname || CU.attributes.mail || '¯\_(ツ)_/¯' }}</span>
            </template>
            <b-dropdown-item to="/auth/login" v-if="!CU.isLoggedIn()">LogIn</b-dropdown-item>
            <b-dropdown-item to="/auth/register" v-if="!CU.isLoggedIn()">Register</b-dropdown-item>
            <b-dropdown-item to="/auth/reset_password_request" v-if="!CU.isLoggedIn()">Reset password request</b-dropdown-item>
            <b-dropdown-item to="/auth/reset_password_with_code" v-if="!CU.isLoggedIn()">Reset password with code</b-dropdown-item>
            <!---->
            <b-dropdown-item to="/tale/upsert" v-if="CU.isLoggedIn()">Add tale</b-dropdown-item>
            <b-dropdown-item to="/auth/profile" v-if="CU.isLoggedIn()">Profile</b-dropdown-item>
            <b-dropdown-item to="/auth/change_password" v-if="CU.isLoggedIn()">Change password</b-dropdown-item>
            <b-dropdown-item to="/auth/logout" v-if="CU.isLoggedIn()">LogOut</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import CurrentUser from "@/services/CurrentUser";
import ConfigApi   from "@/configs/ConfigApi";
export default {
  name: "MenuHorizontalMain",
  data() {
    return {
      ConfigApi,
      CU: CurrentUser.obj(),
    }
  },
  watch: {
    "CU": function (v) {
      // console.log(">>>____________________________");
      // console.log("v");
      // console.log(v);
      // console.log("<<<____________________________");
    }
  }
};
</script>
<style>
#alina-main-menu .alina-navigator {
  background-color: #8F2DA8;
}
</style>