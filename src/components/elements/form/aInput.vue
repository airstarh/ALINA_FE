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
            :checked="internalChecked"
            @input="onInput"
            @change="onChange"
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
      type: [String, Number, Boolean, Object],
      default: ''
    },

    // Current selected value (from parent v-model)
    modelValue: {
      type: [String, Number, Boolean, Object],
      default: null
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

    accept: {
      type: String,
      default: null
    },

    multiple: {
      type: Boolean,
      default: null
    },

    trueValue: {
      type: [String, Number, Boolean, Object],
      default: true
    },

    falseValue: {
      type: [String, Number, Boolean, Object],
      default: false
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
  },
  data() {
    return {
      valueData: '',

      typeAll: [
        'text',
        'password',
        'email',
        'number',
        'tel',
        'url',
        'search',
        'date',
        'time',
        'datetime-local',
        'month',
        'week',
        'color',
        'checkbox',
        'radio',
        'file',
        'hidden',
        'submit',
        'reset',
        'button',
        'image',
        'range'
      ],

      typeText: [
        'text',
        'password',
        'email',
        'number',
        'tel',
        'url',
        'search',
        'date',
        'time',
        'datetime-local',
        'month',
        'week',
        'color',
        'range'
      ],

      typeFile: [
        'file'
      ],

      typeButton: [
        'submit',
        'reset',
        'button',
        'image',
      ],

      typeCheck: [
        'checkbox'
      ],

      typeRadio: [
        'radio'
      ],
    }
  },

  methods: {
    onInput(event) {
      if (this.typeText.includes(this.type)) {
        return this.alinaEmit(event);
      }
    },

    onChange(event) {
      if (
        this.typeFile.includes(this.type)
        || this.typeCheck.includes(this.type)
        || this.typeRadio.includes(this.type)
      ) {
        return this.alinaEmit(event);
      }
    },

    alinaEmit(event) {
      switch (this.type) {
        case 'radio':
          // Emit the radio's value when selected
          this.$emit('update:modelValue', this.value);
          this.$emit('change', this.value);
          break;
        case 'checkbox':
          this.valueData = event.target.checked ? this.trueValue : this.falseValue;
          this.$emit('input', this.valueData);
          this.$emit('change', this.valueData);
          break;
        case 'file':
          if (event.target.files.length > 0) {
            this.valueData = Array.from(event.target.files);
            this.$emit('input', this.valueData);
          }
          break;
        default:
          this.valueData = event.target.value;
          this.$emit('input', this.valueData);
          break;
      }

      return this;
    },
  },

  computed: {
    internalChecked() {
      if (this.typeRadio.includes(this.type)) {
        return this.value === this.modelValue;
      }
      if (this.typeCheck.includes(this.type)) {
        return this.value === this.trueValue;
      }
      return null;

    }
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