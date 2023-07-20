<template>
  <div class="alina-form p-3 m-5 container mx-auto">
    <router-link
        to="/auth/register"
        class="btn btn-sm btn-primary"
    >{{ $t("TXT_REGISTER") }}
    </router-link>
    &nbsp;
    <router-link
        to="/auth/reset_password_request"
        class="btn btn-sm btn-primary"
    >{{ $t("TXT_RESET_PASS_REQUEST") }}
    </router-link>
    <br>
    <br>
    <div class="alina-form" @keyup.enter="runAJax">
      <h1>{{ $t("TXT_LOGIN") }}</h1>
      <input type="text" v-model="post.mail" :placeholder="$t('TXT_MAIL')" class="form-control">
      <br>
      <input type="password" v-model="post.password" :placeholder="$t('TXT_PASSWORD')" class="form-control">
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
  name: "auth_login",
  data() {
    return {
      referer: null,
      CurrentUser,
      options: {
        url: `${ConfigApi.url_base}/auth/login`
      },
      post:    {
        mail:     '',
        password: '',
        form_id:  'login',
      }
    }
  },
  components: {
    StandardButtons
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.referer = from.path;
    })
  },
  created() {
    if (this.CurrentUser.obj().isLoggedIn()) {
      this.$router.replace({path: '/tale/feed'});
    }
  },
  methods: {
    runAJax() {
      const _t = this;
      AjaxAlina.newInst({
        url:        this.options.url,
        postParams: this.post,
        method:     'POST',
        onDone:     (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            if (history) {
              history.go(-1);
              return true;
            }
            if (_t.referer) {
              _t.$router.replace({path: _t.referer});
            } else {
              _t.$router.replace({path: '/tale/feed'});
            }
          }
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
