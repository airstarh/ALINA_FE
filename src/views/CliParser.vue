<template>
    <div class="container px-0">
        <div class="row">
            <div class="col">
                <h1 class="mt-3 mb-3">
                    CLI helper
                </h1>
                <form action="" method="post" enctype="multipart/form-data" class="alina-form">
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Single line"></BtstrpBadge>
                        <textarea v-model="singleLine" class="form-control" rows="5"></textarea>
                    </div>
                    <StandardButtons :onGo="toDetails" submitTxt="Parse"></StandardButtons>
                </form>
                <!-- ################################################## -->

                <div class="row">
                    <div class="col-1">
                        <div class="form-inline">
                            <div class="form-group mt-3">
                                <input v-model="delimiter" type="text" class="form-control"/>
                                <BtstrpBadge title="DELIMITER" badge="SPACE is default"></BtstrpBadge>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ################################################## -->
                <div class="bg-dark p-1 mt-3">
                    <StandardButtons :onGo="fromDetails" submitTxt="Un-Parse"></StandardButtons>

                    <!--pathnameMultiline-->
                    <div class="form-group mt-3">
                        <BtstrpBadge title="Multi-line"></BtstrpBadge>
                        <textarea v-model="multiLine" class="form-control" rows="15"></textarea>
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
        name:       "CliParser",
        components: {
            StandardButtons,
            BtstrpBadge
        },
        data() {
            return {
                /////////////////////////////////
                //region Request
                singleLine: 'sudo cowsay "Hi, How are you"',
                multiLine:  "",
                delimiter:  " ", //SPACE
                //endregion Request
                /////////////////////////////////
            };
        },
        methods:    {
            toDetails() {
                let variative  = this.singleLine;
                variative      = variative.split(this.delimiter);
                variative      = variative.filter(Boolean);
                variative      = variative.map(function (e) {
                    return e.trim();
                });
                variative      = variative.join("\n");
                this.multiLine = variative;
            },
            fromDetails() {
                let variative   = this.multiLine;
                variative       = variative.split("\n");
                variative       = variative.filter(Boolean);
                variative       = variative.map(function (e) {
                    return e.trim();
                });
                variative       = variative.join(this.delimiter);
                this.singleLine = variative;
            },
        },
    };
</script>

<style scoped></style>
