<template>
  <div ref="root" class="aSelect" :style="{ display: componentDisplay }">
    <div class="a-flex" :style="{ flexDirection: flagLabelFirst ? 'row' : 'row-reverse' }">
      <label v-if="label" class="aSelect-label" :for="idNameKey" :style="{ textAlign: labelAlign, width: labelWidth }">{{ label }}</label>
      <span v-if="!modeEdit" class="aSelect-readonly">{{ selectedLabels || placeholder }}</span>
      <span v-else class="aSelect-field" :class="{ disabled }" :style="{ width: inputWidth }" @click="open">
        <span v-if="multiple" class="aSelect-chips">
          <span v-for="option in selectedOptions" :key="option.key" class="aSelect-chip">
            {{ option.label }}
            <button v-if="!disabled" type="button" aria-label="Remove" @click.stop="remove(option)">×</button>
          </span>
        </span>
        <span v-else-if="selectedOptions.length && !query" class="aSelect-single">{{ selectedOptions[0].label }}</span>
        <input :id="idNameKey" ref="search" v-model="query" :disabled="disabled" :placeholder="selectedOptions.length ? '' : placeholder"
          :readonly="!searchable" role="combobox" aria-autocomplete="list" :aria-expanded="isOpen"
          @focus="open" @keydown="onKeydown" />
        <button v-if="allowEmpty && clearable && selectedOptions.length && !disabled" type="button" class="aSelect-clear" aria-label="Clear" @click.stop="clear">×</button>
        <span class="aSelect-arrow">▾</span>
        <div v-if="isOpen" class="aSelect-menu" role="listbox" :aria-multiselectable="multiple">
          <div v-if="allowEmpty" class="aSelect-option aSelect-empty" role="option" :aria-selected="selectedOptions.length === 0" @click.stop="chooseEmpty">
            {{ emptyOptionText }}<span v-if="selectedOptions.length === 0"> ✓</span>
          </div>
          <div v-if="loading" class="aSelect-status">{{ loadingText }}</div>
          <template v-else-if="rows.length">
            <div v-for="(row, index) in rows" :key="row.key"
              :class="row.type === 'group' ? 'aSelect-group' : ['aSelect-option', { active: index === activeIndex, selected: isSelected(row), disabled: row.disabled }]"
              :style="{ paddingLeft: `${6 + row.depth * 14}px` }" :role="row.type === 'option' ? 'option' : 'presentation'"
              :aria-selected="row.type === 'option' ? isSelected(row) : undefined" @click.stop="choose(row)">
              {{ row.label }}<span v-if="row.type === 'option' && isSelected(row)"> ✓</span>
            </div>
          </template>
          <div v-else class="aSelect-status">{{ noOptionsText }}</div>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import AjaxAlina from "@/services/AjaxAlina";
import AlinaPageGlobalAnalyzer from "@/services/AlinaPageGlobalAnalyzer";
import { normalizeOptions, filterOptionTree, flattenOptionTree } from "./aSelectOptions";

export default {
  name: "aSelect",
  emits: ["update:modelValue", "change", "search", "remote-error", "open", "close"],
  props: {
    modelValue: { default: null }, options: { type: Array, default: () => [] }, modeEdit: { type: Boolean, default: false },
    label: { type: String, default: "" }, placeholder: { type: String, default: "Select…" }, disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false }, searchable: { type: Boolean, default: true }, clearable: { type: Boolean, default: true }, allowEmpty: { type: Boolean, default: true },
    returnObject: { type: Boolean, default: false }, valueKey: { type: String, default: "id" }, labelKey: { type: String, default: "option_value" },
    childrenKey: { type: String, default: "options" }, searchRemoteUrl: { type: String, default: "" }, remoteQueryParam: { type: String, default: "search" },
    remoteResponsePath: { type: String, default: "data" }, remoteMinChars: { type: Number, default: 1 }, remoteDebounce: { type: Number, default: 300 },
    maxSelections: { type: Number, default: 0 }, emptyOptionText: { type: String, default: "No option" }, noOptionsText: { type: String, default: "No options" }, loadingText: { type: String, default: "Loading…" },
    idNameKey: { type: String, default: () => AlinaPageGlobalAnalyzer.idNameKeyNext() }, componentDisplay: { type: String, default: "inline-flex" },
    labelAlign: { type: String, default: "left" }, inputWidth: { type: String, default: "100%" }, labelWidth: { type: String, default: "auto" }, flagLabelFirst: { type: Boolean, default: true },
  },
  data: () => ({ query: "", isOpen: false, loading: false, remoteOptions: [], activeIndex: -1, timer: null, requestSerial: 0 }),
  computed: {
    config() { return { valueKey: this.valueKey, labelKey: this.labelKey, childrenKey: this.childrenKey }; },
    localTree() { return normalizeOptions(this.options, this.config); },
    remoteTree() { return normalizeOptions(this.remoteOptions, this.config, "remote"); },
    tree() { return [...this.localTree, ...this.remoteTree]; },
    remoteRows() { return flattenOptionTree(this.remoteTree); },
    rows() { return [...flattenOptionTree(filterOptionTree(this.localTree, this.query)), ...this.remoteRows]; },
    allOptions() { return flattenOptionTree(this.tree).filter((item) => item.type === "option"); },
    selectedOptions() { const values = this.multiple ? (Array.isArray(this.modelValue) ? this.modelValue : []) : [this.modelValue]; return values.filter((v) => v != null && v !== "").map((v) => this.allOptions.find((o) => this.same(o, v)) || this.fromModel(v)); },
    selectedLabels() { return this.selectedOptions.map((item) => item.label).join(", "); },
  },
  watch: {
    query(value) { this.$emit("search", value); this.queueRemote(value); },
    modelValue: { deep: true, handler() { this.$nextTick(this.ensureRequiredSelection); } },
    options: { deep: true, handler() { this.$nextTick(this.ensureRequiredSelection); } },
  },
  mounted() { document.addEventListener("mousedown", this.outside); this.ensureRequiredSelection(); },
  beforeUnmount() { document.removeEventListener("mousedown", this.outside); clearTimeout(this.timer); },
  methods: {
    modelValueOf(option) { return this.returnObject ? option.raw : option.value; },
    rawValue(value) { return this.returnObject && value && typeof value === "object" ? (value[this.valueKey] ?? value.value) : value; },
    same(option, value) { return String(option.value) === String(this.rawValue(value)); },
    fromModel(value) { return { key: `model-${this.rawValue(value)}`, value: this.rawValue(value), label: String(this.returnObject ? (value?.[this.labelKey] ?? value?.label ?? this.rawValue(value)) : value), raw: value }; },
    isSelected(option) { return this.selectedOptions.some((item) => String(item.value) === String(option.value)); },
    open() { if (this.disabled) return; if (!this.isOpen) this.$emit("open"); this.isOpen = true; this.$nextTick(() => this.$refs.search?.focus()); },
    close() { if (this.isOpen) this.$emit("close"); this.isOpen = false; this.activeIndex = -1; },
    outside(event) { if (!this.$refs.root?.contains(event.target)) this.close(); },
    choose(option) { if (option.type !== "option" || option.disabled) return; let value; if (this.multiple) { const current = Array.isArray(this.modelValue) ? [...this.modelValue] : []; const at = current.findIndex((v) => this.same(option, v)); if (at >= 0) { if (!this.allowEmpty && current.length === 1) return; current.splice(at, 1); } else if (!this.maxSelections || current.length < this.maxSelections) current.push(this.modelValueOf(option)); value = current; } else { value = this.modelValueOf(option); this.close(); } this.query = ""; this.emitValue(value); },
    remove(option) { const value = (this.modelValue || []).filter((item) => !this.same(option, item)); if (!this.allowEmpty && value.length === 0) return; this.emitValue(value); },
    chooseEmpty() { if (!this.allowEmpty) return; this.clear(); this.close(); },
    clear() { if (!this.allowEmpty) return; this.query = ""; this.emitValue(this.multiple ? [] : null); },
    ensureRequiredSelection() { if (this.allowEmpty || this.selectedOptions.length || !this.allOptions.length) return; const option = this.allOptions.find((item) => !item.disabled); if (option) this.emitValue(this.multiple ? [this.modelValueOf(option)] : this.modelValueOf(option)); },
    emitValue(value) { this.$emit("update:modelValue", value); this.$emit("change", value); },
    onKeydown(event) { const selectable = this.rows.map((r, i) => ({ r, i })).filter(({ r }) => r.type === "option" && !r.disabled); if (event.key === "Escape") return this.close(); if (event.key === "Backspace" && !this.query && this.multiple && this.selectedOptions.length) return this.remove(this.selectedOptions.at(-1)); if (!["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) return; event.preventDefault(); if (event.key === "Enter") { const row = this.rows[this.activeIndex]; if (row) this.choose(row); return; } const current = selectable.findIndex(({ i }) => i === this.activeIndex); const next = event.key === "ArrowDown" ? (current + 1) % selectable.length : (current <= 0 ? selectable.length - 1 : current - 1); this.activeIndex = selectable[next]?.i ?? -1; },
    queueRemote(query) { clearTimeout(this.timer); if (!this.searchRemoteUrl || query.length < this.remoteMinChars) return; this.timer = setTimeout(() => this.loadRemote(query), this.remoteDebounce); },
    valueAtPath(object, path) { return path.split(".").filter(Boolean).reduce((value, key) => value?.[key], object); },
    loadRemote(query) { const serial = ++this.requestSerial; this.loading = true; AjaxAlina.newInst({ method: "GET", url: this.searchRemoteUrl, getParams: { [this.remoteQueryParam]: query }, onDone: (aja) => { if (serial !== this.requestSerial) return; const body = aja.respBody; const result = Array.isArray(body) ? body : this.valueAtPath(body, this.remoteResponsePath); this.remoteOptions = Array.isArray(result) ? result : []; this.loading = false; this.$nextTick(this.ensureRequiredSelection); } }).go().then((result) => { if (serial === this.requestSerial && !result) { this.loading = false; this.$emit("remote-error"); } }); },
  },
};
</script>

<style scoped lang="scss">
.aSelect { position:relative; flex:0 1 auto; max-width:99%; min-width:0; margin:0; vertical-align:middle; }
.a-flex { display:flex; flex-flow:row nowrap; align-items:center; gap:2px; width:100%; }
.aSelect-label { flex:0 0 auto; }
.aSelect-readonly { padding:2px 2mm; }
.aSelect-field { position:relative; display:flex; flex:1 1 10rem; align-items:center; flex-wrap:wrap; min-width:8rem; min-height:30px; border:.5px solid #666; border-radius:8px; padding:2px 7mm 2px 2mm; background:#303030; cursor:text; }
.aSelect-field.disabled { opacity:.6; cursor:not-allowed; }
.aSelect-field input { flex:1 1 5rem; min-width:3rem; border:0; outline:0; padding:2px; color:inherit; background:transparent; }
.aSelect-chips { display:flex; flex-wrap:wrap; gap:2px; }
.aSelect-chip { border:1px solid #666; border-radius:6px; padding:0 1.5mm; background:#120133; }
.aSelect-single { position:absolute; left:2mm; right:8mm; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; pointer-events:none; border:1px solid #666; border-radius:6px; padding:0 1.5mm; background:#120133; }
.aSelect-chip button,.aSelect-clear { border:0; color:inherit; background:transparent; }
.aSelect-clear,.aSelect-arrow { position:absolute; right:4mm; cursor:pointer; }.aSelect-arrow { right:1mm; pointer-events:none; }
.aSelect-menu { position:absolute; z-index:2000; top:calc(100% + 2px); left:0; right:0; max-height:18rem; overflow:auto; border:1px solid #666; border-radius:8px; background:#222; box-shadow:0 8px 20px #0008; }
.aSelect-group { padding-top:5px; padding-bottom:3px; font-weight:bold; color:#bbb; }
.aSelect-option,.aSelect-status { padding:5px 6px; }.aSelect-option { cursor:pointer; }.aSelect-option.active,.aSelect-option:hover { background:#333; }.aSelect-option.selected { background:#120133; }.aSelect-option.disabled { opacity:.45; cursor:not-allowed; }
.aSelect-empty { border-bottom:1px solid #555; font-style:italic; }
</style>
