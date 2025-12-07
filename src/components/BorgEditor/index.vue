<template>
    <span class="BorgEditor" v-if="cfg.editor">
        <ckeditor :editor="cfg.editor" :config="cfg.tools" @input="borgEmit" :value="value" />
    </span>
</template>
<script>

import Adjustment from "./Adjustment";


export default {
    name: "BorgEditor",
    props: {
        value: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            valueData: '',
            cfg: new Adjustment(),
        }
    },
    methods: {
        borgEmit(val) {
            this.valueData = val;
            this.$emit('input', this.valueData);
        },
    }
}
</script>