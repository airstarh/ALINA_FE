<template>
  <div class="container">




    <div>
      <h1>Test</h1>
      <div>Test_Body </div>
    </div>
    <div class="clear">&nbsp;</div>




    <div>
      <h1>AlinaFileUploader</h1>
      <AlinaFileUploader
        :pArrFiles="[
          { id: -5, name_human: 'TEST' }
        ]"></AlinaFileUploader>
    </div>
    <div class="clear">&nbsp;</div>





    <div>
      <h1>AlinaTableJson</h1>
      <AlinaTableJson :pJson="[
        { one: 1, teo: 2, three: 3, four: 4, five: 5, six: 6, seven: 7 },
        { one: 1, teo: 2, three: 3, four: 4, five: 5, six: 6, seven: 7 },
        { one: 1, teo: 2, three: 3, four: 4, five: 5, six: 6, seven: 7 },
        { one: 1, teo: 2, three: 3, four: 4, five: 5, six: 6, seven: 7 },
      ]"></AlinaTableJson>
    </div>
    <div class="clear">&nbsp;</div>





    <div>
      <h1>Links and buttons</h1>
      <div>
        <a href="#middle">a - Middle</a>
        |||
        <router-link :to="{ hash: 'middle' }">rl - Middle</router-link>
        |||
        <button @click="gotoMiddle">btn - Middle</button>
      </div>
      <br>

      <img alt="Vue logo" src="@/assets/logo.png" height="50" />
    </div>
    <div class="clear">&nbsp;</div>





    <div>
      <h1>Avatar try</h1>
      <span class="btn-secondary text-left text-nowrap badge-pill p-2">
        <router-link :to="'/auth/profile/' + CurrentUser.id" class="fixed-height-150px">
          <img v-if="CurrentUser.emblem" :src="CurrentUser.emblem" width="100px" class="rounded-circle">
          <img v-if="!CurrentUser.emblem" src="@/assets/anarki.png" width="100px" class="rounded-circle">
        </router-link>
        <router-link :to="'/auth/profile/' + CurrentUser.id" class="text-light">
          {{ UtilsStr.fullName(CurrentUser.firstname, CurrentUser.lastname, CurrentUser.id) }}
        </router-link>
      </span>
    </div>
    <div class="clear">&nbsp;</div>




    <div>
      <h1>BorgEditor</h1>
      <h3>Editor</h3>
      <BorgEditor v-model="testEditor.aModel" />
      <br>

      <h3>Result</h3>
      <BorgEditor v-model="testEditor.aModel" :modeEdit="false" />
      <br>

      <h3>HTML</h3>
      <textarea v-model="testEditor.aModel" rows="5" style="width: 100%"> </textarea>
    </div>
    <div class="clear">&nbsp;</div>






    <h1>Linking</h1>
    <div>
      <h2>ROUTER-LINKS</h2>
      <router-link to="/about">About</router-link>
      |||
      <router-link to="/about/001">About 001</router-link>
      |||
      <router-link to="/about/002">About 002</router-link>
      |||
      <router-link to="/about/003">About 003</router-link>
    </div>
    <br>

    <div>
      <h2>A-TAGS</h2>
      <a href="#/about">a# About</a>
      |||
      <a href="#/about/001">a# About 001</a>
      |||
      <a href="#/about/002">a# About 002</a>
      |||
      <a href="#/about/003">a# About 003</a>
    </div>
    <div class="clear">&nbsp;</div>






    <div>
      <h1>AlinaYandexMap</h1>
      <AlinaYandexMap :item="protoTale"></AlinaYandexMap>
    </div>
    <div class="clear">&nbsp;</div>






    <div>
      <h1>SVG Icons</h1>
      <span style="color:#76ff03; background-color: #ffb74d">
        <svg width="55" class="icon--inline" color="currentColor">
          <use :xlink:href="`${iconFb.url}`"></use>
        </svg>
        <svg width="55" class="icon--inline" color="currentColor">
          <use :xlink:href="`${iconFb.url}`"></use>
        </svg>
        <svg width="55" class="icon--inline" color="currentColor">
          <use :xlink:href="`${iconSk.url}`"></use>
        </svg>

        <svg width="55">
          <use :xlink:href="`${iconVk.url}`"></use>
        </svg>

        <svg width="55">
          <use :xlink:href="`${iconWp.url}`"></use>
        </svg>

        <svg width="55" class="icon--inline" color="currentColor">
          <use :xlink:href="`${iconVi.url}`"></use>
        </svg>

        <svg width="55">
          <use :xlink:href="`${iconTg.url}`"></use>
        </svg>

        <svg width="55">
          <use :xlink:href="`${iconIn.url}`"></use>
        </svg>
      </span>
    </div>
    <div class="clear">&nbsp;</div>





    <h1 id="middle">#Middle anchor</h1>
    <div class="clear">&nbsp;</div>






    <div>
      <h1>Storage</h1>
      <div>
        <h2>{{ sProp }} : mapped from Store</h2>
      </div>
      <div>
        <h2>{{ $store.state.egStoreModule.sProp }} : direct from Store</h2>
      </div>
      <button @click="methChangeProp">Change Prop</button>
      &nbsp;
      <button @click="log">log</button>
    </div>
    <div class="clear">&nbsp;</div>





    <div class="m-buttons-1">
      <h1>Ajax tests</h1>
      <br>
      <button @click="onClickBadResponse()" class="btn btn-lg btn-primary">TEST Bad Response
      </button>
      &nbsp;
      <button @click="onTestPost()" class="btn btn-lg btn-primary">TEST POST
      </button>
      &nbsp;
      <button @click="onTestSpinner()" class="btn btn-lg btn-primary">TEST SPINNER
      </button>
    </div>
    <div class="clear">&nbsp;</div>





    <div>
      <h1>AlinaDatePicker</h1>

      <AlinaDatePicker v-model="uts" />
      <br>
      <AlinaDatePicker v-model="uts" format="dateTime" :modeEdit="false" />
      <br>
      <AlinaDatePicker v-model="uts" format="date" :modeEdit="false" />
      <br>
      <AlinaDatePicker v-model="uts" format="time" :modeEdit="false" />
      <br>

      <p>{{ uts }} -> {{ UtilsDate.fromUnixToDateTime(uts) }}</p>
    </div>
    <div class="clear">&nbsp;</div>


    <div>
      <h1>Date FNS</h1>
      <div>
        <!--<div>Now: {{ now }}</div>-->
        <div>Now: {{ new Date() | date }}</div>
        <div>Now: {{ $date(new Date()) }}</div>
        <div>Now: {{ new Date() | date('dd MMMM yyyy') }}</div>
        <div>Now: {{ $date(new Date(), 'dd MMMM yyyy') }}</div>
        <div>Now: {{ $date(new Date(), 'X') }}</div>
        <br>
        {{ dateExample }}
      </div>
    </div>
    <div class="clear">&nbsp;</div>






    <div>
      <h1>Lodash</h1>
      <div>
        <!--##########-->
        <div>{{ JSON.stringify(lodashExample, null, 6) }}</div>
        <div>{{ JSON.stringify(lodashExample2, null, 6) }}</div>
        <!--##########-->
      </div>
    </div>
    <div class="clear">&nbsp;</div>





    <h1>Bootstrap</h1>
    <div>
      <div>
        <!-- Using modifiers -->
        <b-button v-b-modal.my-modal>Show Modal</b-button>

        <!-- Using value -->
        <b-button v-b-modal="'my-modal'">Show Modal</b-button>

        <!-- The modal -->
        <b-modal id="my-modal">Hello From My Modal!</b-modal>
      </div>
      <br>
      <div>
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
    </div>
    <div class="clear">&nbsp;</div>





    <div>
      <h1>aInput</h1>
    </div>
    <div class="clear">&nbsp;</div>


    <h1>The emd</h1>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import AnObject from "../services/AnObject";
import UtilsDate from "@/Utils/UtilsDate";
import AlinaDatePicker from "@/components/elements/form/AlinaDatePicker";
import AlinaYandexMap from "@/components/elements/form/AlinaYandexMap";
import AjaxAlina from "@/services/AjaxAlina";
import ConfigApi from "@/configs/ConfigApi";
import MessagesObj from "@/services/MessagesObj";
import SpinnerObj from "@/services/SpinnerObj";
import iconVk from "@/assets/svg/socialnets/vk.svg";
import iconFb from "@/assets/svg/socialnets/fb.svg";
import iconWp from "@/assets/svg/socialnets/whatsapp.svg";
import iconTg from "@/assets/svg/socialnets/telgram.svg";
import iconIn from "@/assets/svg/socialnets/linkedin.svg";
import iconSk from "@/assets/svg/socialnets/skype.svg";
import iconVi from "@/assets/svg/socialnets/viber.svg";
import BorgEditor from "@/components/BorgEditor";
import CurrentUser from "@/services/CurrentUser";
import UtilsStr from "@/Utils/UtilsStr";
import AlinaTableJson from "@/components/AlinaTableJson";
import AlinaFileUploader from "@/components/elements/form/AlinaFileUploader";

export default {
  name: "About",
  components: {
    AlinaDatePicker,
    AlinaYandexMap,
    AlinaTableJson,
    AlinaFileUploader,
    BorgEditor,
  },
  data() {
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    return {
      protoTale: {
        header: 'This is Tale prototype',
        body: '',
        body_txt: '',
        geo_latitude: 66,
        geo_longitude: 66,
        geo_map_type: 'hybrid',
        geo_zoom: 14,
      },
      iconFb,
      iconVk,
      iconWp,
      iconTg,
      iconVi,
      iconSk,
      iconIn,
      ConfigApi,
      UtilsStr,
      lodashExample: [1, 2, 3, 4],
      picker8: null,
      AnObject: AnObject,
      dateExample: 'DEFAULT VALUE',
      uts: 1,
      testEditor: {
        aModel: 'Ra-ta-ta-ta VeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpaces',
      },
      CurrentUser: CurrentUser.obj().attributes
    };
  },
  mounted() {
    this.svg001();
  },
  created() {
    this.dateplayer();
  },
  computed: {
    UtilsDate() {
      return UtilsDate
    },
    ...mapState("egStoreModule", ["sProp"]), ...mapGetters("egStoreModule", ["gProp"]),
    lodashExample2() {
      return this.lodash.partition(this.lodashExample, n => n % 2);
    }
  },
  methods: {
    ...mapActions("egStoreModule", ["aProp"]),
    svg001() {
    },
    methChangeProp() {
      const value = this.sProp + 3;
      this.aProp(value);
      //this.flag = !this.flag;
    },
    dateplayer() {
      this.dateExample = UtilsDate.UnixSecsToFormat(1578535140);
    },
    onClickBadResponse() {
      AjaxAlina.newInst({
        method: 'GET',
        url: `${ConfigApi.url_base}/admintests/errors`,
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            MessagesObj.set('SUCCESS');
          } else {
            MessagesObj.set('FAIL');
          }
        }
      })
        .go();
    },
    onTestPost() {
      AjaxAlina.newInst({
        method: 'POST',
        url: `${ConfigApi.url_base}/admintests/TestPost`,
        postParams: {
          form_id: 'lalala'
        },
        onDone: (aja) => {
          if (aja.respBody.meta.alina_response_success == 1) {
            MessagesObj.set('SUCCESS');
          } else {
            MessagesObj.set('FAIL');
          }
        }
      })
        .go();
    },
    onTestSpinner() {
      SpinnerObj.isOn = true;
    },
    gotoMiddle() {
      this.$router.push({ hash: "middle" })
    },
    log(data = null) {
      console.log("log ++++++++++");
      console.log(data);
    }
  },
};
</script>

<style scoped>
.clear {
  margin-bottom: 500px;
}
</style>
