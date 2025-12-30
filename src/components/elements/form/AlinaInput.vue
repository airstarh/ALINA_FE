<template>
  <span class="AlinaInput notranslate">
    <span v-if="modeEdit">
      <input :value="value" @input="alinaEmit" />
    </span>
    <span v-if="!modeEdit">{{ value }}</span>
  </span>
</template>
<script>

export default {
  name: "AlinaInput",
  props: {
    value: {
      type: String,
      default: ''
    },
    modeEdit: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      valueData: '',
    }
  },
  methods: {
    alinaEmit(val) {
      this.valueData = val;
      this.$emit('input', this.valueData);
    },
  }
}
</script>
<style scoped></style>