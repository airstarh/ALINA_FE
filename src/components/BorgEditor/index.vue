<template>
    <div class="BorgEditor notranslate">
        <template v-if="Adjustment.editor && modeEdit">
            <ckeditor :editor="Adjustment.editor" :config="Adjustment.tools" @input="borgEmit" :value="value" />
        </template>
        <template v-if="!modeEdit">
            <div class="ck ck-content">
                <div v-html="UtilsStr.content(value)"></div>
            </div>
        </template>
    </div>
</template>
<script>

import Adjustment from "./Adjustment";
import UtilsStr from "@/Utils/UtilsStr";

export default {
    name: "BorgEditor",
    props: {
        value: {
            type: String,
            default: ''
        },
        modeEdit: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            valueData: '',
            Adjustment: new Adjustment(),
            UtilsStr,
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