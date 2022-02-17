<template>
  <div class="form-group mt-3 text-center m-buttons-1">
    <button
        @click="event => {return this.onGo(event);}"
        type="button"
        class="btn btn-lg btn-primary m-2"
    >{{ $t(submitTxt) }}
      <slot name="submitSuffix"></slot>
    </button>
    <a
        @click="() => {this.$router.go()}"
        class="btn btn-lg btn-danger text-white"
    >{{ $t(resetTxt) }}</a>
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
