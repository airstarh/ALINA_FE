<template>
  <div
    class="aInput notranslate"
    :style="{ display: componentDisplay }"
  >
    <template v-if="modeEdit">
      <label
        class="a-flex"
        :for="idNameKey"
      >
        <!-- Label Left -->
        <div
          v-if="label && flagLabelFirst"
          :class="[
            'a-item label-left',
            { 'btn btn-secondary': type === 'file' }
          ]"
          :style="computedStyleLabel"
        >
          <span>{{ label }}<span v-if="type !== 'file'">:&nbsp;</span></span>
        </div>

        <!-- Input -->
        <div
          class="a-item a-input"
          :style="computedStyleInput"
        >
          <input
            :type="type"
            :value="value"
            :checked="internalChecked"
            @input="onInput"
            @change="onChange"
            :id="idNameKey"
            :name="idNameKey"
            :placeholder="placeholder"
            :style="{ textAlign: inputAlign, width: inputWidth ?? '100%' }"
            :maxLength="maxLength"
            :size="size"
            :max="max"
            :min="min"
            :tabindex="tabindex"
            :accept="accept"
            :multiple="multiple"
            :disabled="disabled"
            :class="{ displayNone: computedFlagDisplayNone }"
            :aria-label="placeholder"
          />
          <div
            v-if="type === 'checkbox'"
            class="checkMark"
          >
            <span v-if="internalChecked">V</span
            ><span v-if="!internalChecked">&nbsp;</span>
          </div>
        </div>

        <!-- Label Right -->
        <div
          class="a-item label-right"
          v-if="label && !flagLabelFirst"
          :style="computedStyleLabel"
        >
          <span>{{ label }}</span>
        </div>
      </label>
    </template>

    <template v-if="!modeEdit">
      <template v-if="type === 'text'">
        <a
          v-if="href"
          :href="href"
          >{{ formatter(value) }}</a
        >

        <iframe
          v-else-if="src"
          :src="src"
          frameborder="1"
          width="90%"
          height="250px"
        />

        <span v-else>{{ formatter(value) }}</span>
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
  emits: ["input", "change", "update:modelValue"],
  props: {
    // Common
    value: {
      type: [String, Number, Boolean, Object],
      default: "",
    },

    // TYPE=RADIO ONLY: Current selected value (from parent v-model)
    modelValue: {
      type: [String, Number, Boolean, Object],
      default: null,
    },

    modeEdit: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      default: "",
    },

    placeholder: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "text",
    },

    required: {
      type: Boolean,
      default: false,
    },

    size: {
      type: Number,
      default: null,
    },

    maxLength: {
      type: Number,
      default: null,
    },

    max: {
      type: Number,
      default: null,
    },

    min: {
      type: Number,
      default: null,
    },

    tabindex: {
      type: Number,
      default: function () {
        return AlinaPageGlobalAnalyzer.tabindexNext();
      },
    },

    disabled: {
      type: Boolean,
      default: null,
    },

    accept: {
      type: String,
      default: null,
    },

    multiple: {
      type: Boolean,
      default: null,
    },

    trueValue: {
      type: [String, Number, Boolean, Object],
      default: 1,
    },

    falseValue: {
      type: [String, Number, Boolean, Object],
      default: 0,
    },

    //  COMPONENT SPECIAL
    formatter: {
      type: Function,
      default: (v) => v,
    },

    idNameKey: {
      type: String,
      default: function () {
        return AlinaPageGlobalAnalyzer.idNameKeyNext();
      },
    },

    componentDisplay: {
      type: String,
      default: "inline-block",
    },

    labelAlign: {
      type: String,
      default: "left",
    },

    inputAlign: {
      type: String,
      default: "left",
    },

    labelWidth: {
      type: String,
      default: null,
    },

    inputWidth: {
      type: String,
      default: null,
    },

    flagLabelFirst: {
      type: Boolean,
      default: true,
    },

    href: {
      type: String,
      default: null,
    },

    src: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      valueData: null,

      typeAll: [
        "text",
        "password",
        "email",
        "number",
        "tel",
        "url",
        "search",
        "date",
        "time",
        "datetime-local",
        "month",
        "week",
        "color",
        "checkbox",
        "radio",
        "file",
        "hidden",
        "submit",
        "reset",
        "button",
        "image",
        "range",
      ],

      typeText: [
        "text",
        "password",
        "email",
        "number",
        "tel",
        "url",
        "search",
        "date",
        "time",
        "datetime-local",
        "month",
        "week",
        "color",
        "range",
      ],

      typeFile: ["file"],

      typeButton: ["submit", "reset", "button", "image"],

      typeCheck: ["checkbox"],

      typeRadio: ["radio"],
    };
  },

  methods: {
    onInput(event) {
      if (this.typeText.includes(this.type)) {
        return this.alinaEmit(event);
      }
    },

    onChange(event) {
      if (
        this.typeFile.includes(this.type) ||
        this.typeCheck.includes(this.type) ||
        this.typeRadio.includes(this.type)
      ) {
        return this.alinaEmit(event);
      }
    },

    alinaEmit(event) {
      switch (this.type) {
        case "submit":
        case "reset":
        case "button":
        case "image":
          break;
        case "radio":
          this.valueData = this.value;
          // Emit the radio's value when selected
          this.$emit("update:modelValue", this.valueData);
          this.$emit("change", this.valueData);
          break;
        case "checkbox":
          this.valueData = event.target.checked
            ? this.trueValue
            : this.falseValue;
          this.$emit("input", this.valueData);
          this.$emit("change", this.valueData);
          break;
        case "file":
          if (event.target.files.length > 0) {
            this.valueData = Array.from(event.target.files);
            this.$emit("input", this.valueData);
            this.$emit("change", this.valueData);
          }
          break;
        default:
          this.valueData = event.target.value;
          this.$emit("input", this.valueData);
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
      return this.type === "file";
    },

    computedStyleLabel() {
      const style = {};

      if (this.labelWidth) {
        style["flex"] = "none";
        style["width"] = this.labelWidth;
      }

      if (this.labelAlign) {
        style["text-align"] = this.labelAlign;
      }

      return style;
    },

    computedStyleInput() {
      const style = {};

      if (this.inputWidth) {
        style["flex"] = "none";
        style["width"] = this.inputWidth;
      }

      return style;
    },
  },
};
</script>
<style scoped lang="scss">
.aInput {
  max-width: 99%;
  margin: 0 auto;

  & .a-flex {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    gap: 2px;

    & .a-item {
      min-width: 0;
      word-break: normal;
      word-wrap: break-word;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    }

    & .a-item:first-child {
      flex: 0 1 auto;
    }

    & .a-item:last-child {
      flex: 1 1 auto;
    }
  }

  // region CHECKBOX
  & input[type="checkbox"] {
    display: none;
  }

  & input[type="checkbox"] + .checkMark {
    display: inline-block;
    // position: relative;
    // top: 15px;

    width: 1lh;
    height: 1lh;
    text-align: center;
    border-radius: 5px;

    color: #000000;
    background-color: #ff0000;
  }

  & input[type="checkbox"]:checked + .checkMark {
    background-color: #00ff00;
  }

  // endregion CHECKBOX

  & .displayNone {
    display: none;
  }
}
</style>
