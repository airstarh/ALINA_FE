<template>
  <span
          class="btn btn-primary"
          :class='{
            "btn-primary": !greyed,
            "btn-secondary": greyed,
          }'
  >
    {{ title }} <span class="badge badge-light">{{ badge }}</span>
  </span>
</template>

<script>
    export default {
        name:  "BtstrpBadge",
        props: {
            title:  String,
            badge:  String,
            greyed: false
        }
    };
</script>

<style scoped lang="scss"></style>
