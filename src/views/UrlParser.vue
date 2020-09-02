<template>
    <div class="container px-0">
        <div class="row">
            <div class="col">
                <form action="" method="post" enctype="multipart/form-data" class="alina-form">
                    <h1>
                        URL parser & URL un-parser
                    </h1>
                    <div class="form-group mt-3">
                        <BtstrpBadge title="URI" badge="url"></BtstrpBadge>
                        <input v-model="url" type="text" class="form-control"/>
                    </div>
                    <StandardButtons :onGo="fromUrlToDetails" submitTxt="Parse"></StandardButtons>
                </form>
                <!-- ################################################## -->
                <!-- ################################################## -->
                <!-- ################################################## -->
                <div class="bg-dark p-1 mt-3">
                    <StandardButtons :onGo="fromDetailsToUrl" submitTxt="Un-Parse"></StandardButtons>
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Clean URL" badge="urlClean"></BtstrpBadge>
                        <input v-model="urlClean" type="text" class="form-control"/>
                    </div>

                    <!--protocol-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Protocol" badge="protocol"></BtstrpBadge>
                        <input v-model="protocol" type="text" class="form-control"/>
                    </div>

                    <!--username-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="User Name" badge="username"></BtstrpBadge>
                        <input v-model="username" type="text" class="form-control"/>
                    </div>

                    <!--password-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Password" badge="password"></BtstrpBadge>
                        <input v-model="password" type="text" class="form-control"/>
                    </div>

                    <!--domain-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Domain" badge="domain"></BtstrpBadge>
                        <input v-model="domain" type="text" class="form-control"/>
                    </div>

                    <!--port-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Port" badge="port"></BtstrpBadge>
                        <input v-model="port" type="text" class="form-control"/>
                    </div>

                    <!--pathname-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Path" badge="pathname"></BtstrpBadge>
                        <input v-model="pathname" type="text" class="form-control"/>
                    </div>

                    <!--getTxt-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Get as string" badge="getTxt"></BtstrpBadge>
                        <input v-model="getTxt" type="text" class="form-control" disabled/>
                    </div>

                    <!--region getObjJsonString -->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Get as JSON" badge="getObjJsonString"></BtstrpBadge>
                        <textarea v-model="getObjJsonString" class="form-control" rows="15"></textarea>
                    </div>
                    <!--endregion GET JSON-->

                    <!--hashTxt-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Hash as string" badge="hashTxt"></BtstrpBadge>
                        <input v-model="hashTxt" type="text" class="form-control" disabled/>
                    </div>

                    <!--hashObjJsonString-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Hash as JSON" badge="hashObjJsonString"></BtstrpBadge>
                        <textarea v-model="hashObjJsonString" class="form-control" rows="15"></textarea>
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
                url:               "https://USER:PASS@saysimsim.ru:8080/root/index2?p=val&lala[]=1&lala[]=Русские буквы#haha[]=1&haha[]=Ф Й",
                urlClean:          "",
                protocol:          "",
                username:          "",
                password:          "",
                domain:            "",
                port:              "",
                host:              "",
                pathname:          "",
                getTxt:            "",
                getObj:            {},
                getObjJsonString:  '',
                hashTxt:           "",
                hashObj:           {},
                hashObjJsonString: '',
                //endregion Request
                /////////////////////////////////
            };
        },
        computed:   {},
        created() {
            this.fromUrlToDetails();
        },
        methods:    {
            fromUrlToDetails() {
                const res = UtilsURL.parse(this.url);
                console.log(">>>>>>>>>>>>>>>>>>>>");
                console.log("res");
                console.log(res);
                console.log("<<<<<<<<<<<<<<<<<<<<");
                this.urlClean          = UtilsURL.unparse(res, ['pathname', 'hash']);
                this.protocol          = res.protocol;
                this.domain            = res.hostname;
                this.port              = res.port;
                this.host              = res.host;
                this.username          = res.username;
                this.password          = res.password;
                this.pathname          = res.pathname;
                this.getTxt            = res.search;
                this.getObj            = res.searchObject;
                this.getObjJsonString  = JSON.stringify(res.searchObject, null, 6);
                this.hashTxt           = res.hash;
                this.hashObj           = res.hashObject;
                this.hashObjJsonString = JSON.stringify(res.hashObject, null, 6);
            },
            fromDetailsToUrl() {
                const parser = {
                    protocol: this.protocol,
                    username: this.username,
                    password: this.password,
                    hostname: this.domain, //domain name only
                    port:     this.port,
                    pathname: UtilsURL.castObjectToGetQueryString(this.getObj),
                    hash:     UtilsURL.castObjectToGetQueryString(this.hashObj, '', false),
                };
                this.getTxt  = '';
                this.hashTxt = '';
                this.url     = UtilsURL.unparse(parser);
            },
        },
        watch:      {
            "getObjJsonString":  function () {
                this.getObj = UtilsData.jsonToObjOrString(this.getObjJsonString);
                this.getTxt = '?' + UtilsURL.castObjectToGetQueryString(this.getObj);
            },
            "hashObjJsonString": function () {
                this.hashObj = UtilsData.jsonToObjOrString(this.hashObjJsonString);
                this.hashTxt = '#' + UtilsURL.castObjectToGetQueryString(this.hashObj, '', false);
            },
        }
    };
</script>

<style scoped></style>
