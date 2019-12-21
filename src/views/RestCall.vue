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
                                    @change="onFile11Change"
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
    import BtstrpBadge from "../components/elements/BtstrpBadge";
    import {Ajax} from "../services/Ajax";

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
                reqUri:          "http://alinazero:8080/FileUpload/Common",
                //reqUri:          "http://alinazero:8080/alinaRestAccept/TestCors?lala[]=1&lala[]=2&lala[]=3&foo=bar",
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
                    hello: "world",
                    arr:   [1, 3, "some string"]
                },
                reqPostTxt:      "",
                reqFlagPostRaw:  false,
                reqFlagPostFile: false,
                reqFileList:     [],
                enctypes:        ["application/json", "multipart/form-data", "text-plain", "application/x-www-form-urlencoded"],
                enctype:         "multipart/form-data",
                /////////////////////////////////
                reqHeaders:      {
                    //"Content-Type": "application/json; charset=utf-8",
                    // "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "sewa"
                },
                reqHeadersTxt:   "",
                /////////////////////////////////
                reqMethods:      ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                reqMethod:       "POST",
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

                this.objsToTxt();

                console.log("onDone ajaajaajaajaajaajaaja ++++++++++");
                console.log(oAjax);
            },

            objsToTxt() {
                this.reqGetTxt     = JSON.stringify(this.reqGet, null, 2);
                this.reqHeadersTxt = JSON.stringify(this.reqHeaders, null, 2);
                if (!this.reqFlagPostRaw) {
                    this.reqPostTxt = JSON.stringify(this.reqPost, null, 6);
                }
            },

            strsToObjs() {
                this.reqGet     = JSON.parse(this.reqGetTxt);
                this.reqHeaders = JSON.parse(this.reqHeadersTxt);
                if (this.reqFlagPostRaw) {
                    this.reqPost = this.reqPostTxt;

                } else {
                    this.reqPost = JSON.parse(this.reqPostTxt);

                    if (this.reqFlagPostFile) {
                        this.reqPost['userfile'] = this.reqFileList;
                    }
                }
            },

            onFile11Change(fileList, event) {
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
