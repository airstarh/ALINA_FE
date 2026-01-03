<template>
  <div class="aInput notranslate">
    <template v-if="modeEdit">
      <div class="row no-gutters align-items-center">
        <div v-if="label" class="col">
          <label
            :for="idNameKey"
            :style="{ width: labelWidth }">{{ label }}:&nbsp;</label>
        </div>
        <div class="col">
          <input
            :value="value"
            @input="alinaEmit($event.target.value)"
            :id="idNameKey" :name="idNameKey"
            :placeholder="placeholder"
            :style="{ textAlign: inputAlign, width: inputWidth }"
            :size="size"
            :max="max"
            :min="min"
            :tabindex="tabindex"
            :disabled="disabled" />
        </div>

      </div>
    </template>

    <template v-if="!modeEdit">

      <template v-if="type === 'text'">
        {{ formatter(value) }}
      </template>

      <template v-else-if="type === 'email'">
        <a :href="`mailto:${value}`">
          {{ formatter(value) }}
        </a>
      </template>

      <template v-else-if="type === 'tel'">
        <a :href="`tel:${value}`">
          {{ formatter(value) }}
        </a>
      </template>

    </template>
  </div>
</template>
<script>

export default {
  name: "aInput",
  emits: ['input'],
  props: {
    value: {
      type: [String, Number],
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
    placeholder: {
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
    idNameKey: {
      type: String,
      default: function () {
        return AlinaPageGlobalAnalyzer.idNameKeyNext();
      }
    },
    inputAlign: {
      type: String,
      default: 'left'
    },
    labelWidth: {
      type: String,
      default: 'auto'
    },
    inputWidth: {
      type: String,
      default: 'auto'
    },
    size: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    min: {
      type: Number,
      default: null
    },
    tabindex: {
      type: Number,
      default: function () {
        return AlinaPageGlobalAnalyzer.tabindexNext();
      }
    },
    disabled: {
      type: Boolean,
      default: null
    }
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

  & input {
    padding: 2px;
    height: auto;
  }
}
</style>