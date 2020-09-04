<template>
    <div class="container px-0">
        <div class="row">
            <div class="col">
                <form action="" method="post" enctype="multipart/form-data" class="alina-form">
                    <h1>
                        CLI helper
                    </h1>
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
                singleLine: "$ nice -12 tar -czf backup.tar.bz2 /home/*\n",
                multiLine:  "",
                delimiter:  " ", //SPACE
                //endregion Request
                /////////////////////////////////
            };
        },
        methods:    {
            toDetails() {
                let variative  = this.singleLine;
                variative      = variative.split(this.delimiter).join("\n");
                this.multiLine = variative;
            },
            fromDetails() {
                this.singleLine = this.multiLine.split("\n").join(this.delimiter);
            },
        },
    };
</script>

<style scoped></style>
