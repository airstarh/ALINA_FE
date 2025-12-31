<template>
  <div>
    <div class="row text-center m-buttons-1">

      <a
          @click="() => {this.$router.go()}"
          class="col-auto btn btn-sm btn-danger text-white"
      >{{ $t(resetTxt) }}</a>

      <button
          @click="event => {return this.onGo(event);}"
          type="button"
          class="col btn btn-sm btn-secondary"
      >{{ $t(submitTxt) }}
        <slot name="submitSuffix"></slot>
      </button>
    </div>
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
