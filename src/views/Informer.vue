<template>
  <div class="d-flex align-items-center justify-content-center" style="height: 100vh">
    <clock></clock>
  </div>
</template>
<script>
// @ is an alias to /src
import Clock from "@/components/Clock";
export default {
  name: "Informer",
  data() {
    return {}
  },
  components: {
    Clock
  },
  created() {},
  methods: {}
};
</script>