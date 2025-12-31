<template>
  <div class="StandardButtons">

    <a
        @click="() => {this.$router.go()}"
        class="btn btn-danger text-white ml-1"
    >{{ $t(resetTxt) }}</a>

    <button
        @click="event => {return this.onGo(event);}"
        type="button"
        class="btn btn-secondary ml-1"
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

<style scoped lang="scss">
  .StandardButtons {
    display: inline-block;
  }
</style>
