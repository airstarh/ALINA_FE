<template>
  <div class="container">
    <div class="row align-items-center vh-almost-100">
      <div class="col-md-6 mx-auto">
        <div class="alina-form">
          <h1>{{ $t("TXT_LOGOUT") }}</h1>
          <div v-if="CU.isLoggedIn()">You are logged in</div>
          <div v-if="!CU.isLoggedIn()">You are logged out</div>
          <input type="hidden" v-model="post.form_id" class="form-control">
          <StandardButtons
              :onGo="runAJax"
              submit-txt="Bye-bye"
          ></StandardButtons>
        </div>
      </div>
    </div>
  </div>
</template>
<!--##################################################-->
<!--##################################################-->
<!--##################################################-->
<script>
// @ is an alias to /src
import StandardButtons from "@/components/elements/form/StandardButtons";
import ConfigApi       from "@/configs/ConfigApi";
import AjaxAlina       from "@/services/AjaxAlina";
import CurrentUser     from "@/services/CurrentUser";
export default {
  name: "auth_logout",
  data() {
    return {
      CU:      CurrentUser.obj(),
      options: {
        url: `${ConfigApi.url_base}/auth/logout`
      },
      post:    {
        form_id: 'actionLogout',
      }
    }
  },
  components: {
    StandardButtons
  },
  created() {
    this.runAJax();
  },
  methods: {
    runAJax() {
      const oAjax = AjaxAlina.newInst({
        url:        this.options.url,
        postParams: this.post,
        method:     'POST',
        onDone:     (aja) => {
          this.$router.replace({path: `/tale/feed`});
        }
      })
      .go();
    }
  }
};
</script>
<!--##################################################-->
<!--##################################################-->
<!--##################################################-->
