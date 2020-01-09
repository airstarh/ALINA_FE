<template v-if="SpinnerObj.isOn">
    <div id="spinner"
         :style="{
			'display':isDisplayed()
		 }"
         @click="()=>{SpinnerObj.isOn = !SpinnerObj.isOn}"
    >
        <div id="spinner-image-container">
            <b-spinner label="Loading..."></b-spinner>
        </div>
    </div>
</template>

<script>
    import SpinnerObj from "@/services/SpinnerObj";

    export default {
        name:       'Spinner',
        props:      {},
        data() {
            return {
                SpinnerObj: SpinnerObj
            }
        },
        components: {},
        methods:    {
            isDisplayed() {
                return this.SpinnerObj.isOn
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
    }

    #spinner #spinner-image-container {
        position: absolute;
        left: 50%;
        top: 50%;
    }
</style>