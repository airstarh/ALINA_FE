<template>
  <div class="container-fluid px-0">
    <div class="row">
      <div class="col-6">
        <form action="" method="post" enctype="multipart/form-data">
          <h2>
            Request <span><button type="button" @click="log">LOG</button></span>
          </h2>
          <StandardButtons :onGo="runAJax"></StandardButtons>
          <div class="m-3">
            <b-btn @click="cleanUpPreDefinedSets" variant="primary">Clean-up Query Parameters</b-btn>
          </div>
          <div class="form-group mt-3">
            <BtstrpBadge title="URI" badge="reqUri"></BtstrpBadge>
            <input v-model="reqUri" type="text" class="form-control"/>
          </div>
          <!--##################################################-->
          <!--##################################################-->
          <!--##################################################-->
          <div class="row m-3">
            <div class="col-sm">
              <div>Method</div>
              <b-form-select
                  v-model="reqMethod"
                  :options="reqMethods"
                  label="Method"
              ></b-form-select>
            </div>

            <div class="col-sm">
              <div>Mode</div>
              <b-form-select
                  v-model="mode"
                  :options="modes"
                  label="Mode"
              ></b-form-select>
            </div>

            <div class="col-sm">
              <div>Credential</div>
              <b-form-select
                  v-model="credentials"
                  :options="credentialsList"
                  label="Credential"
              ></b-form-select>
            </div>

            <div class="col-sm">
              <div>Enctype</div>
              <b-form-select
                  v-model="enctype"
                  :options="enctypes"
                  label="Enctype"
              ></b-form-select>
            </div>
          </div>
          <!--##################################################-->
          <!--##################################################-->
          <!--##################################################-->
          <div class="row">
            <div class="col-sm">
              <ui-fileupload
                  accept="image/*"
                  :multiple="true "
                  name="userfile"
                  @change="onChangeFileField"
              >Select an image
              </ui-fileupload>
            </div>
          </div>
          <!--##################################################-->
          <!--##################################################-->
          <!--##################################################-->
          <div class="row">
            <div class="col-sm">
              <div class="form-group mt-3">
                <BtstrpBadge title="GET" badge="reqGet"></BtstrpBadge>
                <textarea v-model="reqGetTxt" class="form-control" rows="11"></textarea>
              </div>
            </div>
            <div class="col-sm">
              <div class="form-group mt-3">
                <BtstrpBadge title="POST" badge="reqPost"></BtstrpBadge>
                <textarea id="reqPost" v-model="reqPostTxt" class="form-control" rows="11"></textarea>
                <div class="custom-control custom-checkbox">
                  <input id="reqFlagPostRaw" v-model="reqFlagPostRaw" type="checkbox" class="custom-control-input"/>
                  <label class="btn btn-primary custom-control-label" for="reqFlagPostRaw">
                    reqFlagPostRaw
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group mt-3">
            <BtstrpBadge title="Headers" badge="reqHeaders"></BtstrpBadge>
            <textarea v-model="reqHeadersTxt" class="form-control" rows="5"></textarea>
          </div>
          <div class="form-group mt-3">
            <BtstrpBadge title="Cookies" badge="reqCookieTxt"></BtstrpBadge>
            <textarea v-model="reqCookieTxt" class="form-control" rows="5"></textarea>
          </div>
          <StandardButtons :onGo="runAJax"></StandardButtons>
        </form>
      </div>
      <!--##################################################-->
      <!--##################################################-->
      <!--##################################################-->
      <div class="col-6 bg-dark">
        <div class="mt-3">
          <h2>Response</h2>
          <div class="mt-3">
            <BtstrpBadge title="URI" badge="urlRes"></BtstrpBadge>
            <input v-model="urlRes" type="text" class="form-control"/>
          </div>

          <div class="mt-3">
            <BtstrpBadge title="Body" badge="respBodyTxt"></BtstrpBadge>
            <textarea v-model="respBodyTxt" class="form-control w-100" rows="11"></textarea>
          </div>
          <div class="mt-3">
            <BtstrpBadge title="Headers" badge="respHeaderTxt"></BtstrpBadge>
            <textarea v-model="respHeaderTxt" class="form-control w-100" rows="11"></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm">
        <div class="m-5">
          <BtstrpBadge title="iframe" badge="$data->q->respBody"></BtstrpBadge>
        </div>
      </div>
    </div>
  </div>
  <!-- /container -->
</template>

<script>
import StandardButtons from "../components/elements/form/StandardButtons";
import BtstrpBadge     from "../components/elements/BtstrpBadge";
import Ajax            from "../services/Ajax";
import AjaxAlina       from "../services/AjaxAlina";

export default {
  name:       "RestCall",
  components: {
    StandardButtons,
    BtstrpBadge
  },
  data() {
    return {
      /////////////////////////////////
      //region Request
      reqUri: "https://local.host:7002/eg/php/php-redirect-1.php?lala=qqq",
      /////////////////////////////////
      modes: ["cors", "no-cors", "*same-origin"],
      mode:  "cors",
      /////////////////////////////////
      caches: ["no-cache", "*default", "no-cache", "reload", "force-cache", "only-if-cached"],
      cache:  "no-cache",
      /////////////////////////////////
      credentialsList: ["omit", "same-origin", "include", "*omit"],
      credentials:     "include",
      /////////////////////////////////
      redirects: ["follow", "manual", "*follow", "error"],
      redirect:  "follow",
      /////////////////////////////////
      referrers: ["no-referrer", "client"],
      referrer:  "",
      /////////////////////////////////
      reqGet:    {
        lala: [4, 5, 6],
        foo:  'привет'
      },
      reqGetTxt: "",
      /////////////////////////////////
      reqPost:         {
        "id":               "1",
        "mail":             "vsevolod.azovsky@gmail.com",
        "firstname":        "Sewa",
        "lastname":         "Azovsky",
        "emblem":           "111",
        "birth":            "477100800",
        "language":         "en",
        "timezone":         "3",
        "is_verified":      "1",
        "banned_till":      "1277928000",
        "created_at":       "1569877200",
        "is_deleted":       "0",
        "last_time":        "1580058021",
        "last_browser_enc": "09f454857cbf37627aacee60db0bd6fc",
        "last_ip":          "127.0.0.1",
        "fingerprint":      "",
        "about_myself":     "111333",
        "reset_code":       "1579611464",
        "reset_required":   "1",
        "timezone_name":    "The Third Тайм Зона",
        "form_id":          "actionProfile"
      },
      reqPostTxt:      "",
      reqFlagPostRaw:  false,
      reqFlagPostFile: false,
      reqFileList:     [],
      enctypes:        ["application/json", "multipart/form-data", "text-plain", "application/x-www-form-urlencoded"],
      enctype:         "multipart/form-data",
      /////////////////////////////////
      reqHeaders:    {
        "fgp": "sewa"
      },
      reqHeadersTxt: "",
      /////////////////////////////////
      reqCookie:    {
        "salam": "пополам",
      },
      reqCookieTxt: '',
      /////////////////////////////////
      reqMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      reqMethod:  "GET",
      //endregion Request
      /////////////////////////////////
      /////////////////////////////////
      /////////////////////////////////
      //region Response
      urlRes:      "",
      respBody:    "",
      respBodyTxt: "",
      /////////////////////////////////
      respHeaders:   {},
      respHeaderTxt: '',
      //endregion Response
      /////////////////////////////////
    };
  },
  computed: {},
  created() {
    this.objsToTxt();
  },
  methods: {
    runAJax() {
      this.strsToObjs();
      const oAjax = Ajax.newInst({
        url:            this.reqUri,
        mode:           this.mode,
        cache:          this.cache,
        credentials:    this.credentials,
        redirect:       this.redirect,
        referrer:       this.referrer,
        getParams:      this.reqGet,
        headers:        this.reqHeaders,
        enctype:        this.enctype,
        reqFlagPostRaw: this.reqFlagPostRaw,
        postParams:     this.reqPost,
        method:         this.reqMethod,
        onDone:         this.onDone
      });
      oAjax.go();
    },

    onDone(oAjax) {
      this.respHeaders   = oAjax.respHeaders;
      this.respHeaderTxt = JSON.stringify(this.respHeaders, null, 2);
      switch (oAjax.respType) {
        case "json":
          this.respBodyTxt = JSON.stringify(oAjax.respBody, null, 6);
          break;
        case "text":
        case "blob":
        default:
          this.respBodyTxt = oAjax.respBody;
          break;
      }

      this.reqUri  = oAjax.urlClean;
      this.urlRes  = oAjax.urlRes;
      this.reqGet  = oAjax.options.getParams;
      this.reqPost = oAjax.options.postParams;
      //#####
      delete this.reqHeaders.token;
      delete this.reqHeaders.uid;
      if (this.respHeaders.hasOwnProperty('token')) {
        this.reqHeaders.token = this.respHeaders.token;
      }
      if (this.respHeaders.hasOwnProperty('uid')) {
        this.reqHeaders.uid = this.respHeaders.uid;
      }
      //#####
      this.objsToTxt();
      //#####
    },

    objsToTxt() {
      this.reqHeadersTxt = JSON.stringify(this.reqHeaders, null, 6);
      this.reqCookieTxt  = JSON.stringify(this.reqCookie, null, 6);
      this.reqGetTxt     = JSON.stringify(this.reqGet, null, 6);
      if (!this.reqFlagPostRaw) {
        this.reqPostTxt = JSON.stringify(this.reqPost, null, 6);
      }
    },

    strsToObjs() {
      //#####
      this.reqCookie = JSON.parse(this.reqCookieTxt);
      Object.entries(this.reqCookie).forEach((ind_val) => {
        const ind       = ind_val[0];
        const val       = ind_val[1];
        document.cookie = `${ind}=${val}`;
      });
      //#####
      this.reqHeaders = JSON.parse(this.reqHeadersTxt);
      //#####
      this.reqGet     = JSON.parse(this.reqGetTxt);
      //#####
      if (this.reqFlagPostRaw) {
        this.reqPost = this.reqPostTxt;
      } else {
        this.reqPost = JSON.parse(this.reqPostTxt);
        if (this.reqFlagPostFile) {
          this.reqPost['userfile'] = this.reqFileList;
        }
      }
      //#####
    },

    onChangeFileField(fileList, event) {
      if (fileList.length > 0) {
        this.reqFlagPostFile = true;
      } else {
        this.reqFlagPostFile = false;
      }

      if (this.reqFlagPostFile) {
        this.reqFileList = fileList;
      } else {
        this.reqFileList = [];
      }
    },
    cleanUpPreDefinedSets() {
      this.reqGet  = {};
      this.reqPost = {};
      this.reqHeaders = {};
      this.reqCookie = {};
      this.objsToTxt();
    },
    log() {
    }
  }
};
</script>

<style scoped></style>
