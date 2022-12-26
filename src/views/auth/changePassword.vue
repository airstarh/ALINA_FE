<template>
  <div class="alina-form p-3 m-5 container mx-auto">
    <h1>{{ $t("TXT_CHANGE_PASS") }}</h1>
    <input type="password" v-model="post.password" :placeholder="$t('TXT_PASSWORD')" class="form-control">
    <br>
    <input type="password" v-model="post.confirm_password" :placeholder="$t('TXT_REPEAT')" class="form-control">
    <input type="hidden" v-model="post.form_id" class="form-control">
    <StandardButtons :onGo="runAJax"></StandardButtons>
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
  name: "auth_change_password",
  data() {
    return {
      options: {
        url: `${ConfigApi.url_base}/auth/ChangePassword`
      },
      post:    {
        form_id:          'actionChangePassword',
        password:         '',
        confirm_password: '',
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
