<template>
    <div>
        Generic
    </div>
</template>

<script>
    export default {
        name:  "Generic",
        props: {
            aprop: {
                type:    String,
                default: 'yo',
            }
        },
        data() {
            return {};
        },
        computed: {},
        methods: {
            log() {
                console.log("log ++++++++++");
                console.log(this);
            }
        }
    };
</script>

<style scoped></style>
