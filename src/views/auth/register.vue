<template>
  <div class="container">
    <div class="row align-items-center vh-almost-100">
      <div class="col-md-6 mx-auto">
        <router-link to="/auth/reset_password_request"
                     class="btn btn-sm btn-primary"
        >{{ $t("TXT_RESET_PASS_REQUEST") }}
        </router-link>
        &nbsp;
        <router-link to="/auth/login"
                     class="btn btn-sm btn-primary"
        >{{ $t("TXT_LOGIN") }}
        </router-link>
        <div class="alina-form">
          <h1>{{ $t("TXT_REGISTER") }}</h1>
          <input type="text" v-model="post.mail" :placeholder="$t('TXT_MAIL')" class="form-control">
          <input type="password" v-model="post.password" :placeholder="$t('TXT_PASSWORD')" class="form-control">
          <input type="password" v-model="post.confirm_password" :placeholder="$t('TXT_REPEAT')" class="form-control">
          <StandardButtons :onGo="runAJax"></StandardButtons>
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
  name: "auth_register",
  data() {
    return {
      options: {
        url: `${ConfigApi.url_base}/auth/register`
      },
      post:    {
        mail:             '',
        password:         '',
        confirm_password: '',
        form_id:          'actionRegister',
      }
    }
  },
  components: {
    StandardButtons
  },
  methods:    {
    runAJax() {
      AjaxAlina.newInst({
        url:        this.options.url,
        postParams: this.post,
        method:     'POST',
        onDone:     (aja) => {
          //const id = CurrentUser.obj().attributes.id;
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
