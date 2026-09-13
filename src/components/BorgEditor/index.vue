<template>
    <div class="BorgEditor notranslate">
        <template v-if="editor && modeEdit">
            <ckeditor :editor="editor" :config="tools" @ready="$emit('ready', $event)" @update:modelValue="borgEmit" :modelValue="modelValue" />
        </template>
        <template v-if="!modeEdit">
            <div class="ck ck-content">
                <div v-html="UtilsStr.content(modelValue)"></div>
            </div>
        </template>
    </div>
</template>
<script>

import Adjustment from "./Adjustment";
import UtilsStr from "@/Utils/UtilsStr";
import { markRaw } from "vue";

export default {
    name: "BorgEditor",
    emits: ["ready", "update:modelValue"],
    props: {
        modelValue: {
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
            editor: null,
            tools: null,
            UtilsStr,
        }
    },
    created() {
        this.Adjustment.ready.then(({ editor, tools }) => {
            this.editor = markRaw(editor);
            this.tools = markRaw(tools);
        });
    },
    methods: {
        borgEmit(val) {
            this.valueData = val;
            this.$emit('update:modelValue', this.valueData);
        },
    }
}
</script>
