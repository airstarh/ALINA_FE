<template>
    <div class="container px-0">
        <div class="row">
            <div class="col">
                <form action="" method="post" enctype="multipart/form-data" class="alina-form">
                    <h2>
                        URL (URI) parser
                    </h2>
                    <StandardButtons :onGo="onSubmit"></StandardButtons>
                    <div class="form-group mt-3">
                        <BtstrpBadge title="URI" badge="url"></BtstrpBadge>
                        <input v-model="url" type="text" class="form-control"/>
                    </div>
                    <!--##################################################-->
                    <!--##################################################-->
                    <!--##################################################-->
                    <StandardButtons :onGo="onSubmit"></StandardButtons>
                </form>
                <div class="bg-dark p-1 mt-3">
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

                    <!--path-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="path" badge="path"></BtstrpBadge>
                        <input v-model="path" type="text" class="form-control"/>
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
                domainAndPort:     "",
                path:              "",
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
            onSubmit() {
                this.fromUrlToDetails();
            },
            fromUrlToDetails() {
                const res              = UtilsURL.parse(this.url);
                this.urlClean          = UtilsURL.unparse(res, ['pathname', 'hash']);
                this.protocol          = res.protocol;
                this.domain            = res.hostname;
                this.port              = res.port;
                this.domainAndPort     = res.host;
                this.username          = res.username;
                this.password          = res.password;
                this.path              = res.pathname;
                this.getTxt            = res.search;
                this.getObj            = res.searchObject;
                this.getObjJsonString  = JSON.stringify(res.searchObject, null, 6);
                this.hashTxt           = res.hash;
                this.hashObj           = res.hashObject;
                this.hashObjJsonString = JSON.stringify(res.hashObject, null, 6);
            },
            fromDetailsToUrl() {
                this.getObj = JSON.parse(this.getTxt);
                //#####
            },
        }
    };
</script>

<style scoped></style>
