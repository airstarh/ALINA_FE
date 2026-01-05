<template>
  <div class="aInput notranslate" :style="{ display: componentDisplay }">
    <template v-if="modeEdit">

      <label class="row no-gutters align-items-center a-input-line" :for="idNameKey">

        <!-- Label Left -->
        <div
          class="col left-label"
          v-if="label && flagLabelFirst"
          :style="{ textAlign: labelAlign, width: labelWidth }">
          <span
            :class="{ 'btn btn-secondary': type === 'file' }">
            {{ label }}<span v-if="type !== 'file'">:&nbsp;</span>
          </span>
        </div>

        <!-- Input -->
        <div
          class="col main-input"
          :style="{ width: inputWidth }">
          <input
            :type="type"
            :value="value"
            :checked="internalChecked"
            @input="onInput"
            @change="onChange"
            :id="idNameKey"
            :name="idNameKey"
            :placeholder="placeholder"
            :style="{ textAlign: inputAlign, width: '99%' }"
            :maxLength="maxLength"
            :size="size"
            :max="max"
            :min="min"
            :tabindex="tabindex"
            :accept="accept"
            :multiple="multiple"
            :disabled="disabled"
            :class="{ displayNone: computedFlagDisplayNone }" />
          <span v-if="type === 'checkbox'" class="checkMark"><span v-if="internalChecked">V</span><span v-if="!internalChecked">&nbsp;</span></span>
        </div>

        <!-- Label Right -->
        <div
          class="col right-label"
          v-if="label && !flagLabelFirst"
          :style="{ textAlign: labelAlign, width: labelWidth }">>
          <span>{{ label }}</span>
        </div>

      </label>
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
  emits: ['input', 'change', 'update:modelValue'],
  props: {
    // Common
    value: {
      type: [String, Number, Boolean, Object],
      default: ''
    },

    // TYPE=RADIO ONLY: Current selected value (from parent v-model)
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

    maxLength: {
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
      default: 1
    },

    falseValue: {
      type: [String, Number, Boolean, Object],
      default: 0
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
      default: 'block'
    },

    labelAlign: {
      type: String,
      default: 'left'
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
      valueData: null,

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
        case 'submit':
        case 'reset':
        case 'button':
        case 'image':
          break;
        case 'radio':
          this.valueData = this.value;
          // Emit the radio's value when selected
          this.$emit('update:modelValue', this.valueData);
          this.$emit('change', this.valueData);
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
            this.$emit('change', this.valueData);
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

    },

    computedFlagDisplayNone() {
      return this.type === 'file';
    }
  }
}
</script>
<style scoped lang="scss">
.aInput {
  max-width: 99%;
  margin: 0 auto;

  word-break: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;

  & .row.a-input-line {
    flex-wrap: nowrap;

    & .col:first-child {
      flex: 0 0 auto;
    }

    & .col:last-child {
      min-width: 0;

      flex: 1 1 auto;
    }
  }

  & input[type="checkbox"] {
    display: none;
  }

  & input[type="checkbox"]+.checkMark {
    text-align: center;
    color: #000000;
    display: inline-block;
    width: 1lh;
    background-color: #ff0000;
  }

  & input[type="checkbox"]:checked+.checkMark {
    background-color: #00ff00;
  }

  & .displayNone {
    display: none;
  }
}
</style>