<template>
    <div class="container px-0">
        <div class="row">
            <div class="col">
                <form action="" method="post" enctype="multipart/form-data" class="alina-form">
                    <h2>
                        URL (URI) parser
                    </h2>
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

                    <!--region getObjJsonString -->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="getObjJsonString" badge="getObjJsonString"></BtstrpBadge>
                        <textarea v-model="getObjJsonString" class="form-control" rows="15"></textarea>
                    </div>
                    <!--endregion GET JSON-->

                    <!--hashObjJsonString-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="hashObjJsonString" badge="hashObjJsonString"></BtstrpBadge>
                        <textarea v-model="hashObjJsonString" class="form-control" rows="15"></textarea>
                    </div>

                    <!--protocol-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="protocol" badge="protocol"></BtstrpBadge>
                        <input v-model="protocol" type="text" class="form-control"/>
                    </div>

                    <!--username-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="username" badge="username"></BtstrpBadge>
                        <input v-model="username" type="text" class="form-control"/>
                    </div>

                    <!--password-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="password" badge="password"></BtstrpBadge>
                        <input v-model="password" type="text" class="form-control"/>
                    </div>

                    <!--domain-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="domain" badge="domain"></BtstrpBadge>
                        <input v-model="domain" type="text" class="form-control"/>
                    </div>

                    <!--port-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="port" badge="port"></BtstrpBadge>
                        <input v-model="port" type="text" class="form-control"/>
                    </div>

                    <!--pathname-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="pathname" badge="pathname"></BtstrpBadge>
                        <input v-model="pathname" type="text" class="form-control"/>
                    </div>

                    <!--getTxt-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="getTxt" badge="getTxt"></BtstrpBadge>
                        <input v-model="getTxt" type="text" class="form-control"/>
                    </div>

                    <!--hashTxt-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="hashTxt" badge="hashTxt"></BtstrpBadge>
                        <input v-model="hashTxt" type="text" class="form-control"/>
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
                url:               "https://USER:PASS@saysimsim.ru:8080/root/index2?p=val&lala[]=666&lala[]=Русские буквы с пробелом#lalala[]=1&lalala[]=Ф Й",
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
                const res              = UtilsURL.parse(this.url);
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
                    pathname: UtilsURL.castGetObjectToString(this.getObj),
                    hash:     UtilsURL.castGetObjectToString(this.hashObj),
                };
                this.url     = UtilsURL.unparse(parser);
            },
        },
        watch:      {
            "getObjJsonString":  function () {
                try {
                    this.getObj = JSON.parse(this.getObjJsonString)
                } catch (e) {
                }
            },
            "hashObjJsonString": function () {
                try {
                    this.hashObj = JSON.parse(this.hashObjJsonString)
                } catch (e) {
                }
            },
        }
    };
</script>

<style scoped></style>
