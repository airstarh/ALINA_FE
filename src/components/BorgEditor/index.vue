<template>
    <span class="BorgEditor" v-if="Adjustment.editor">
        <ckeditor :editor="Adjustment.editor" :config="Adjustment.tools" @input="borgEmit" :value="value" />
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
            Adjustment: new Adjustment(),
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