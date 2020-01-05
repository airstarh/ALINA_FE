<template>
    <div class="container-sm">
        <div class="row">
            <div class="col-sm">
                <form action="" method="post" enctype="multipart/form-data">
                    <h2>
                        Request <span><button type="button" @click="log">LOG</button></span>
                    </h2>
                    <StandardButtons :onGo="runAJax"></StandardButtons>
                    <div class="form-group mt-3">
                        <BtstrpBadge title="URI" badge="reqUri"></BtstrpBadge>
                        <input v-model="reqUri" type="text" class="form-control"/>
                    </div>
                    <!--##################################################-->
                    <!--##################################################-->
                    <!--##################################################-->
                    <div class="row">
                        <div class="col-sm">
                            <ui-select
                                    v-model="reqMethod"
                                    :options="reqMethods"
                                    label="Method"
                            ></ui-select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm">
                            <ui-select
                                    v-model="mode"
                                    :options="modes"
                                    label="Mode"
                            ></ui-select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm">
                            <ui-select
                                    v-model="credentials"
                                    :options="credentialsList"
                                    label="Credential"
                            ></ui-select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm">
                            <ui-select
                                    v-model="enctype"
                                    :options="enctypes"
                                    label="Ejctype"
                            ></ui-select>
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
            <div class="col-sm">
                <!--        <img src="http://alinazero:8080/sources/images/orig.png" width="150">-->
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
    import AjaxAlina            from "../services/AjaxAlina";

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
                //reqUri:          "http://alinazero:8080/Пользователь/Логин",
                // reqUri:          "http://alinazero:8080/FileUpload/Common",
                reqUri:          "http://alinazero:8080/AdminTests/TestMessages?lala[]=1&lala[]=2&lala[]=3&foo=bar",
                //reqUri:                  "http://alinazero:8080/sources/images/orig.png",
                /////////////////////////////////
                modes:           ["cors", "no-cors", "*same-origin"],
                mode:            "cors",
                /////////////////////////////////
                caches:          ["no-cache", "*default", "no-cache", "reload", "force-cache", "only-if-cached"],
                cache:           "no-cache",
                /////////////////////////////////
                credentialsList: ["omit", "same-origin", "include", "*omit"],
                credentials:     "include",
                /////////////////////////////////
                redirects:       ["follow", "manual", "*follow", "error"],
                redirect:        "follow",
                /////////////////////////////////
                referrers:       ["no-referrer", "client"],
                referrer:        "",
                /////////////////////////////////
                reqGet:          {
                    lala: [4, 5, 6],
                    foo:  'привет'
                },
                reqGetTxt:       "",
                /////////////////////////////////
                reqPost:         {
                    hello:    "world",
                    arr:      [1, 3, 'какая-то строка / со слешем и с обратным \ слешем'],
                    mail:     "vsevolod.azovsky@gmail.com",
                    password: "qwerty123qwerty",
                },
                reqPostTxt:      "",
                reqFlagPostRaw:  false,
                reqFlagPostFile: false,
                reqFileList:     [],
                enctypes:        ["application/json", "multipart/form-data", "text-plain", "application/x-www-form-urlencoded"],
                enctype:         "multipart/form-data",
                /////////////////////////////////
                reqHeaders:      {
                    "Authorization": "sewa"
                },
                reqHeadersTxt:   "",
                /////////////////////////////////
                reqCookie:       {
                    "salam": "пополам",
                },
                reqCookieTxt:    '',
                /////////////////////////////////
                reqMethods:      ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                reqMethod:       "GET",
                //endregion Request
                /////////////////////////////////
                /////////////////////////////////
                /////////////////////////////////
                //region Response
                urlRes:          "",
                respBody:        "",
                respBodyTxt:     "",
                /////////////////////////////////
                respHeaders:     {},
                respHeaderTxt:   '',
                //endregion Response
                /////////////////////////////////
            };
        },
        computed:   {},
        created() {
            this.objsToTxt();
        },
        methods:    {
            runAJax() {
                this.strsToObjs();
                const oAjax = AjaxAlina.newInst({
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
                    //this.$cookie.set(ind, val, 1);
                    document.cookie = "name=oeschger";
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

            log() {
                console.log("log ++++++++++");
                console.log(this.reqGet);
            }
        }
    };
</script>

<style scoped></style>
