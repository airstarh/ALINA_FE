<template>
  <div class="aInput notranslate">
    <span v-if="modeEdit">
      <input :value="value" @input="alinaEmit" />
    </span>
    <span v-if="!modeEdit">{{ formatter(value) }}</span>
  </div>
</template>
<script>

export default {
  name: "aInput",
  props: {
    value: {
      type: String,
      default: ''
    },
    modeEdit: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    required: {
      type: Boolean,
      default: false
    },
    formatter: {
      type: Function,
      default: v => v
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
<style scoped lang="scss">
.aInput {
  display: inline-block;
}
</style>