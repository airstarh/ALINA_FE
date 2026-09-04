<template>
  <div class="StandardButtons">

    <a
      @click="() => { this.$router.go() }"
      class="btn btn-a">{{ $t(resetTxt) }}</a>

    <button
      @click="event => { return this.onGo(event); }"
      type="button"
      class="btn btn-a">{{ $t(submitTxt) }}
      <slot name="submitSuffix"></slot>
    </button>
  </div>
</template>

<script>
export default {
  name: "StandardButtons",
  props: {
    onGo: Function,
    submitTxt: {
      default: "i_ok"
    },
    resetTxt: {
      default: "i_undo"
    },
  }
};
</script>

<style scoped lang="scss">
.StandardButtons {
  display: flex;
  gap: 7mm;

  & > * {
    min-width: 8ch;
  }
}
</style>
