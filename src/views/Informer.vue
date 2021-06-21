<template>
  <div class="container">
    <div class="row align-items-center vh-almost-100">
      <clock></clock>
    </div>
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