<template>
  <div class="row form-group mt-3 text-center">

    <a
        @click="() => {this.$router.go()}"
        class="col-3 btn btn-lg btn-danger text-white"
    >{{ $t(resetTxt) }}</a>

    <button
        @click="event => {return this.onGo(event);}"
        type="button"
        class="col btn btn-lg btn-secondary m-2"
    >{{ $t(submitTxt) }}
      <slot name="submitSuffix"></slot>
    </button>
  </div>
</template>

<script>
export default {
  name:  "StandardButtons",
  props: {
    onGo:      Function,
    submitTxt: {
      default: "TXT_SUBMIT"
    },
    resetTxt:  {
      default: "TXT_RESET"
    },
  }
};
</script>

<style scoped lang="scss"></style>
