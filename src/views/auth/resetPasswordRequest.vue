<template>
  <div class="alina-form p-3 m-5 container mx-auto">
    <router-link
        to="/auth/login"
        class="btn btn-sm btn-primary"
    >{{ $t("TXT_LOGIN") }}
    </router-link>
    &nbsp;
    <router-link
        to="/auth/register"
        class="btn btn-sm btn-primary"
    >{{ $t("TXT_REGISTER") }}
    </router-link>
    <br>
    <br>
    <div class="alina-form">
      <h1>{{ $t("TXT_RESET_PASS_REQUEST") }}</h1>
      <input type="text" v-model="post.mail" :placeholder="$t('TXT_MAIL')" class="form-control">
      <input type="hidden" v-model="post.form_id" class="form-control">
      <div class="m-1">&nbsp;</div>
      <StandardButtons :onGo="runAJax"></StandardButtons>
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
  name: "auth_reset_password_request",
  data() {
    return {
      options: {
        url: `${ConfigApi.url_base}/auth/ResetPasswordRequest`
      },
      post:    {
        form_id: 'actionResetPasswordRequest',
        mail:    '',
      }
    }
  },
  components: {
    StandardButtons
  },
  methods:    {
    runAJax() {
      const oAjax = AjaxAlina.newInst({
        url:        this.options.url,
        postParams: this.post,
        method:     'POST',
        onDone:     (aja) => {
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
