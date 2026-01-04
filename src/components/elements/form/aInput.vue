<template>
  <div class="aInput notranslate" :style="{ display: componentDisplay }">
    <template v-if="modeEdit">
      <div class="d-flex no-gutters align-items-center">

        <!-- Label Left -->
        <div
          v-if="label && flagLabelFirst"
          class="col-auto">
          <label
            :for="idNameKey"
            :style="{ width: labelWidth }">{{ label }}:&nbsp;</label>
        </div>

        <!-- Input -->
        <div class="col ml-1">
          <input
            :value="value"
            @input="alinaEmit"
            :id="idNameKey" :name="idNameKey"
            :placeholder="placeholder"
            :style="{ textAlign: inputAlign, width: inputWidth }"
            :size="size"
            :max="max"
            :min="min"
            :tabindex="tabindex"
            :disabled="disabled" />
        </div>

        <!-- Label Right -->
        <div
          v-if="label && !flagLabelFirst"
          class="col-auto">
          <label
            :for="idNameKey"
            :style="{ width: labelWidth }">&nbsp;{{ label }}</label>
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
    // Common
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
    },

    //  COMPONENT SPECIAL
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
    componentDisplay: {
      type: String,
      default: 'inline-block'
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
    flagLabelFirst: {
      type: Boolean,
      default: true
    },
    tv: {

    }
  },
  data() {
    return {
      valueData: '',
    }
  },
  methods: {
    alinaEmit(event) {
      this.valueData = event.target.value;
      this.$emit('input', this.valueData);
    },
  },

  computed: {

  }
}
</script>
<style scoped lang="scss">
.aInput {

  & input,
  & label {
    padding: 2px;
    margin: 0;
    height: auto;
  }
}
</style>