<template>
  <span class="btn btn-primary">
    {{ title }} <span class="badge badge-light">{{ badge }}</span>
  </span>
</template>

<script>
export default {
  name: "BtstrpBadge",
  props: {
    title: String,
    badge: String
  }
};
</script>

<style scoped lang="scss"></style>
