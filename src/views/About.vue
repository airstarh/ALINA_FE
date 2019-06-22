<template>
  <!--<div :flag="flag">-->
  <div>
    <div><h1>{{sProp}} : mapped from Store</h1></div>
    <div><h1>{{$store.state.egStoreModule.sProp}} : direct from Store</h1></div>
    <button @click="methChangeProp">Change Prop</button>
    <button @click="log">log</button>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapState} from "vuex";

  export default {
    name:     'EgStoreModuleComponent',
    data() {
      return {
        flag:      true,
      };
    },

    computed: {
      ...mapState('egStoreModule', ['sProp']),
      ...mapGetters('egStoreModule', ['gProp'])
    },

    methods: {
      ...mapActions('egStoreModule', ['aProp']),

      methChangeProp() {
        const value = this.sProp + 3;
        this.aProp(value);
        //this.flag = !this.flag;
      },

      log() {
        console.log("log ++++++++++");
        console.log(this.sProp);
      },
    }
  }
</script>

<style scoped>
</style>
