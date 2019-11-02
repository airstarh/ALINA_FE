<template>
  <!--<div :flag="flag">-->
  <div>
    <div>
      <h1>{{ sProp }} : mapped from Store</h1>
    </div>
    <div>
      <h1>{{ $store.state.egStoreModule.sProp }} : direct from Store</h1>
    </div>
    <button @click="methChangeProp">Change Prop</button>
    <button @click="log">log</button>

    <div>
      <h1>Bootstrap</h1>
      <div>
        <p>
          <button type="button" class="btn btn-lg btn-default">Default</button>
          <button type="button" class="btn btn-lg btn-primary">Primary</button>
          <button type="button" class="btn btn-lg btn-success">Success</button>
          <button type="button" class="btn btn-lg btn-info">Info</button>
          <button type="button" class="btn btn-lg btn-warning">Warning</button>
          <button type="button" class="btn btn-lg btn-danger">Danger</button>
          <button type="button" class="btn btn-lg btn-link">Link</button>
        </p>
        <p>
          <button type="button" class="btn btn-default">Default</button>
          <button type="button" class="btn btn-primary">Primary</button>
          <button type="button" class="btn btn-success">Success</button>
          <button type="button" class="btn btn-info">Info</button>
          <button type="button" class="btn btn-warning">Warning</button>
          <button type="button" class="btn btn-danger">Danger</button>
          <button type="button" class="btn btn-link">Link</button>
        </p>
        <p>
          <button type="button" class="btn btn-sm btn-default">Default</button>
          <button type="button" class="btn btn-sm btn-primary">Primary</button>
          <button type="button" class="btn btn-sm btn-success">Success</button>
          <button type="button" class="btn btn-sm btn-info">Info</button>
          <button type="button" class="btn btn-sm btn-warning">Warning</button>
          <button type="button" class="btn btn-sm btn-danger">Danger</button>
          <button type="button" class="btn btn-sm btn-link">Link</button>
        </p>
      </div>
    </div>

    <b-container class="bv-example-row">
      <b-row class="justify-content-md-center">
        <b-col cols="12" md="5">
          <h2><b-badge>Hello World</b-badge>&nbsp;</h2>
          <div>
            <ui-textbox
              label="AnObject.prop1"
              v-model="AnObject.prop1"
              icon="person_pin"
              type="text"
              :floatingLabel="true"
            ></ui-textbox>
          </div>
          <div>
            <ui-textbox
              label="AnObject.prop2"
              v-model="AnObject.prop2"
              icon="security"
              type="text"
              :floatingLabel="true"
            ></ui-textbox>
          </div>

          <b-list-group>
            <b-list-group-item variant="dark">{{
              AnObject.prop1
            }}</b-list-group-item>
            <b-list-group-item variant="dark">{{
              AnObject.prop2
            }}</b-list-group-item>
          </b-list-group>

          <div>
            <ui-datepicker
              icon="eventpacks"
              orientation="landscape"
              picker-type="modal"
              placeholder="Select a date"
              v-model="picker8"
              >Your Birthday
            </ui-datepicker>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>1 of 3</b-col>
        <b-col cols="12" md="auto">Variable width content</b-col>
        <b-col col lg="2">3 of 3</b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import AnObject from "../services/AnObject";

export default {
  name: "EgStoreModuleComponent",
  data() {
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    return {
      picker8: null,
      AnObject: AnObject
    };
  },

  computed: {
    ...mapState("egStoreModule", ["sProp"]),
    ...mapGetters("egStoreModule", ["gProp"])
  },

  methods: {
    ...mapActions("egStoreModule", ["aProp"]),

    methChangeProp() {
      const value = this.sProp + 3;
      this.aProp(value);
      //this.flag = !this.flag;
    },

    log() {
      console.log("log ++++++++++");
      console.log(this.sProp);
    }
  }
};
</script>

<style scoped></style>
