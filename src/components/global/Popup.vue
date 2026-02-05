<template v-if="PopupObj.isOn">
    <div
            class="container-fluid"
            id="spinner"
            :style="{
                'display':isDisplayed()
            }"
    >
        <div
                id="spinner-row"
                class="row h-100 align-items-center"
                @click="()=>{PopupObj.isOn = !PopupObj.isOn}"
        >
            <div class="col-sm-3">&nbsp;</div>
            <div
                    class="col-sm-6"
                    id="spinner-image-container"
                    style="text-align: center"
            >
                <b-spinner
                        tag="span"
                        variant="secondary"

                        style="width: 15rem; height: 15rem;"
                        label="Loading..."></b-spinner>
            </div>
            <div class="col-sm-3">&nbsp;</div>
        </div>
    </div>
</template>

<script>
    import PopupObj from "@/services/PopupObj";
    export default {
        name:       'Spinner',
        props:      {},
        data() {
            return {
                PopupObj: PopupObj
            }
        },
        components: {},
        methods:    {
            isDisplayed() {
                return this.PopupObj.isOn
                       ? "block"
                       : "none";
            }
        }
    }
</script>
<style>
    #spinner {
        position: fixed;
        overflow: hidden;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(100, 100, 100, 0.1);
        z-index: 99999;
    }
    #spinner #spinner-row{
        /*border: red solid 11px;*/
    }
    #spinner #spinner-image-container {
        margin-top: auto;
        margin-bottom: auto;
        /*opacity: 0.5;*/
        /*border: #a1d solid 11px;*/
        /*position: absolute;*/
        /*left: 50%;*/
        /*top: 50%;*/
    }
</style>