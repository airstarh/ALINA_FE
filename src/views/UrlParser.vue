<template>
    <div class="container px-0">
        <div class="row">
            <div class="col">
                <h1 class="mt-3 mb-3">
                    URL Parser + URL un-Parser (2 in 1)
                </h1>
                <form action="" method="post" enctype="multipart/form-data" class="alina-form">
                    <div class="form-group mt-3">
                        <BtstrpBadge title="URL"></BtstrpBadge>
                        <textarea v-model="url" class="form-control" rows="5"></textarea>
                    </div>
                    <StandardButtons :onGo="fromUrlToDetails" submitTxt="Parse"></StandardButtons>
                </form>
                <!-- ################################################## -->
                <!-- ################################################## -->
                <!-- ################################################## -->
                <div class="bg-dark p-1 mt-3">
                    <StandardButtons :onGo="fromDetailsToUrl" submitTxt="Un-Parse"></StandardButtons>
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Clean URL" :greyed="true"></BtstrpBadge>
                        <input v-model="urlClean" type="text" class="form-control" disabled/>
                    </div>

                    <!--protocol-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Protocol"></BtstrpBadge>
                        <input v-model="protocol" type="text" class="form-control"/>
                    </div>

                    <!--username-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="User Name"></BtstrpBadge>
                        <input v-model="username" type="text" class="form-control"/>
                    </div>

                    <!--password-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Password"></BtstrpBadge>
                        <input v-model="password" type="text" class="form-control"/>
                    </div>

                    <!--domain-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Domain"></BtstrpBadge>
                        <input v-model="domain" type="text" class="form-control"/>
                    </div>

                    <!--port-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Port"></BtstrpBadge>
                        <input v-model="port" type="text" class="form-control"/>
                    </div>

                    <!--pathname-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Path" badge="edit it below" :greyed="true"></BtstrpBadge>
                        <div class="input-group">
                            <span class="input-group-addon btn btn-secondary">/</span>
                            <input v-model="pathname" type="text" class="form-control" disabled/>
                        </div>
                    </div>

                    <!--pathnameMultiline-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Path multilined" badge="each line will be separated with / "></BtstrpBadge>
                        <textarea v-model="pathnameMultiline" class="form-control" rows="15"></textarea>
                    </div>

                    <!--getTxt-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Get string" badge="edit it below" :greyed="true"></BtstrpBadge>
                        <div class="input-group">
                            <span class="input-group-addon btn btn-secondary">?</span>
                            <input v-model="getTxt" type="text" class="form-control" disabled/>
                        </div>
                    </div>

                    <!--region getJsonString -->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Get as JSON" badge='use valid JSON only, eg: "Quuted String", 123, [], {}'></BtstrpBadge>
                        <textarea v-model="getJsonString" class="form-control" rows="15"></textarea>
                    </div>
                    <!--endregion GET JSON-->

                    <!--hashTxt-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Hash as string" badge="edit it below" :greyed="true"></BtstrpBadge>
                        <div class="input-group">
                            <span class="input-group-addon btn btn-secondary">#</span>
                            <input v-model="hashTxt" type="text" class="form-control" disabled/>
                        </div>
                    </div>

                    <!--hashJsonString-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Hash as JSON" badge='use valid JSON only, eg: "Quuted String", 123, [], {}'></BtstrpBadge>
                        <textarea v-model="hashJsonString" class="form-control" rows="15"></textarea>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <!-- /container -->
</template>

<script>
    import StandardButtons from "../components/elements/form/StandardButtons";
    import BtstrpBadge from "../components/elements/BtstrpBadge";
    import UtilsURL from "@/Utils/UtilsURL";
    import UtilsData from "@/Utils/UtilsData";
    import UtilsStr from "@/Utils/UtilsStr";
    export default {
        name:       "UrlParser",
        components: {
            StandardButtons,
            BtstrpBadge
        },
        data() {
            return {
                /////////////////////////////////
                //region Request
                url:               "https://USER:PASS@saysimsim.ru:8080/root/index2?p=val&lala[]=1&lala[]=Русские буквы#haha[]=1&haha[]=Слово",
                urlClean:          "",
                protocol:          "",
                username:          "",
                password:          "",
                domain:            "",
                port:              "",
                host:              "",
                pathname:          "",
                pathnameMultiline: "",
                getTxt:            "",
                getObj:            {},
                getJsonString:     '',
                hashTxt:           "",
                hashObj:           {},
                hashJsonString:    '',
                //endregion Request
                /////////////////////////////////
            };
        },
        computed:   {},
        created() {
            //this.fromUrlToDetails();
        },
        methods:    {
            fromUrlToDetails() {
                let variative          = '';
                const res              = UtilsURL.parse(this.url);
                this.urlClean          = UtilsURL.unparse(res, ['pathname', 'hash']);
                this.protocol          = res.protocol;
                this.domain            = res.hostname;
                this.port              = res.port;
                this.host              = res.host;
                this.username          = res.username;
                this.password          = res.password;
                this.pathname          = res.pathname;
                variative              = UtilsStr.trimLeft(res.pathname, "/");
                this.pathnameMultiline = variative.split("/").join("\n");
                this.getTxt            = res.search;
                this.getObj            = res.searchObject;
                this.getJsonString     = JSON.stringify(res.searchObject, null, 6);
                this.hashTxt           = res.hash;
                this.hashObj           = res.hashObject;
                this.hashJsonString    = JSON.stringify(res.hashObject, null, 6);
            },
            fromDetailsToUrl() {
                const parser = {
                    protocol: this.protocol,
                    username: this.username,
                    password: this.password,
                    hostname: this.domain, //domain name only
                    port:     this.port,
                    pathname: this.pathname,
                    getTxt:   this.getTxt,
                    hash:     this.hashTxt,
                };
                this.url     = UtilsURL.unparse(parser);
            },
        },
        watch:      {
            "getJsonString":     function () {
                this.getObj = UtilsData.jsonToObjOrString(this.getJsonString);
                this.getTxt = UtilsURL.castObjectToGetQueryString(this.getObj);
            },
            "hashJsonString":    function () {
                this.hashObj = UtilsData.jsonToObjOrString(this.hashJsonString);
                this.hashTxt = UtilsURL.castObjectToGetQueryString(this.hashObj, '', false);
            },
            "pathnameMultiline": function () {
                this.pathname = this.pathnameMultiline.split("\n").join("/");
            },
        }
    };
</script>

<style scoped></style>
