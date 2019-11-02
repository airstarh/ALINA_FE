<template>
  <div class="form-group mt-3 text-center">
    <button
      @click="
        event => {
          return this.onGo(event);
        }
      "
      type="button"
      class="btn btn-lg btn-primary"
    >
      Submit!
    </button>
    <span
      @click="
        () => {
          this.$router.go();
        }
      "
      class="btn btn-lg btn-danger"
      >RESET</span
    >
  </div>
</template>

<script>
export default {
  name: "StandardButtons",
  props: {
    onGo: Function
  }
};
</script>

<style scoped lang="scss"></style>
