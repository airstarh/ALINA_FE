<template>
    <div>
        Generic
    </div>
</template>

<script>
    import UtilsData from "@/Utils/UtilsData";
    export default {
        name:     "Generic",
        props:    {
            aprop: {
                type:    String,
                default: 'yo',
            }
        },
        data() {
            return {};
        },
        //##################################################
        //region Router Hooks
        beforeRouteEnter(to, from, next) {
            next((vm) => {
                //
            })
        },
        beforeRouteUpdate(to, from, next) {
            const vm = this;
            //
            next();
        },
        //endregion Router Hooks
        //##################################################
        computed: {},
        methods:  {
            getRouteParam(paramName, to) {
                if (UtilsData.empty(to)) {to = this.$route;}
                let res = null;
                if (to && to.params && to.params[paramName]) {
                    res = to.params[paramName];
                }
                return res;
            },
            log() {
                console.log("log ++++++++++");
                console.log(this);
            }
        }
    };
</script>

<style scoped></style>
