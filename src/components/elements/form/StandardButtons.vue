<template>
    <div class="form-group mt-3 text-center m-buttons-1">
        <button
                @click="event => {return this.onGo(event);}"
                type="button"
                class="btn btn-lg btn-primary"
        >{{submitTxt}}
        </button>
        <a
                @click="() => {this.$router.go()}"
                class="btn btn-lg btn-danger text-white"
        >{{resetTxt}}</a>
    </div>
</template>

<script>
    export default {
        name:  "StandardButtons",
        props: {
            onGo:      Function,
            submitTxt: {
                default: "sim-sim"
            },
            resetTxt:  {
                default: "Reset"
            },
        }
    };
</script>

<style scoped lang="scss"></style>
