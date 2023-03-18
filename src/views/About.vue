<template>
  <div class="container border border-primary">
    <div>
      <h2>AlinaFileUploader</h2>
      <AlinaFileUploader
          :pArrFiles="[
              {id: -5, name_human:'TEST'}
          ]"
      ></AlinaFileUploader>
    </div>
    <div></div>
    <div>
      <h2>AlinaTableJson</h2>
      <AlinaTableJson
          :pJson="[
              {one: 1, teo: 2, three: 3, four: 4, five: 5, six:6, seven: 7},
              {one: 1, teo: 2, three: 3, four: 4, five: 5, six:6, seven: 7},
              {one: 1, teo: 2, three: 3, four: 4, five: 5, six:6, seven: 7},
              {one: 1, teo: 2, three: 3, four: 4, five: 5, six:6, seven: 7},
          ]"
      ></AlinaTableJson>
    </div>
    <div></div>
    <div>
      <h2>Test links and buttons</h2>
      <a href="#middle">a - Middle</a>
      |||
      <router-link :to="{hash:'middle'}">rl - Middle</router-link>
      |||
      <button @click="gotoMiddle">btn - Middle</button>
    </div>
    <img alt="Vue logo" src="@/assets/logo.png" height="50"/>
    <div></div>
    <span class="btn-secondary text-left text-nowrap badge-pill p-2">
      <router-link :to="'/auth/profile/'+CurrentUser.id" class="fixed-height-150px">
        <img v-if="CurrentUser.emblem" :src="CurrentUser.emblem" width="100px" class="rounded-circle">
        <img v-if="!CurrentUser.emblem" src="@/assets/anarki.png" width="100px" class="rounded-circle">
      </router-link>
      <router-link :to="'/auth/profile/'+CurrentUser.id" class="text-light">
        {{ UtilsStr.fullName(CurrentUser.firstname, CurrentUser.lastname, CurrentUser.id) }}
      </router-link>
    </span>
    <div></div>
    <h1>CKeditor 5</h1>
    <div></div>
    <ckeditor
        class="notranslate"
        v-model="ckEditorRelated.aModel"
        :editor="ckEditorRelated.editor"
        :config="ckEditorRelated.editorConfig"
    ></ckeditor>
    <div></div>
    <h3>HTML</h3>
    <div></div>
    <textarea v-model="ckEditorRelated.aModel" rows="5" style="width: 100%">
    </textarea>
    <div></div>
    <h3>Result</h3>
    <div class="clear"></div>
    <div>
      <div class="ck-content">
        <div v-html="ckEditorRelated.aModel"></div>
      </div>
    </div>
    <div class="clear"></div>
    <h1>Linking </h1>
    <div></div>
    <div>
      ROUTER-LINKS:::
      <router-link to="/about">About</router-link>
      |||
      <router-link to="/about/001">About 001</router-link>
      |||
      <router-link to="/about/002">About 002</router-link>
      |||
      <router-link to="/about/003">About 003</router-link>
    </div>
    <div></div>
    <div></div>
    <div>
      A-TAGS:::
      <a href="#/about">a# About</a>
      |||
      <a href="#/about/001">a# About 001</a>
      |||
      <a href="#/about/002">a# About 002</a>
      |||
      <a href="#/about/003">a# About 003</a>
    </div>
    <div></div>
    <div>
      <AlinaYandexMap :item="protoTale"></AlinaYandexMap>
    </div>
    <div></div>
    <h1>SVH Icons</h1>
    <div></div>
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
    <div></div>
    <h1 id="middle">#Middle</h1>
    <div></div>
    <div>
      <div><h1>{{ sProp }} : mapped from Store</h1></div>
      <div><h1>{{ $store.state.egStoreModule.sProp }} : direct from Store</h1></div>
      <button @click="methChangeProp">Change Prop</button>
      <button @click="log">log</button>
    </div>
    <div class="m-buttons-1">
      <br>
      <button
          @click="onClickBadResponse()"
          class="btn btn-lg btn-primary"
      >TEST Bad Response
      </button>
      &nbsp;
      <button
          @click="onTestPost()"
          class="btn btn-lg btn-primary"
      >TEST POST
      </button>
      &nbsp;
      <button
          @click="onTestSpinner()"
          class="btn btn-lg btn-primary"
      >TEST SPINNER
      </button>

      <br>
      <br>
    </div>
    <div></div>
    <h1>AlinaDatePicker</h1>
    <div></div>
    <div>
      <AlinaDatePicker
          v-model="uts"
          class="notranslate"
      ></AlinaDatePicker>
      <div>{{ uts }} ||| {{ uts | unix_to_date_time }}</div>
    </div>
    <div></div>
    <h1>Date FNS</h1>
    <div></div>
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
    <br>
    <div></div>
    <h1>Lodash</h1>
    <div></div>
    <div>
      <!--##########-->
      <div>{{ lodashExample | json_str }}</div>
      <div>{{ lodashExample2 | json_str }}</div>
      <!--##########-->
    </div>
    <br>
    <div>
      <!-- Using modifiers -->
      <b-button v-b-modal.my-modal>Show Modal</b-button>

      <!-- Using value -->
      <b-button v-b-modal="'my-modal'">Show Modal</b-button>

      <!-- The modal -->
      <b-modal id="my-modal">Hello From My Modal!</b-modal>
    </div>
    <div></div>
    <h1>Bootstrap</h1>
    <div></div>
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
    <div></div>
    <h1>XXX</h1>
    <div></div>
    <b-container class="bv-example-row">
      <b-row class="justify-content-md-center">
        <b-col cols="12" md="5">
          <h2>
            <b-badge>Hello World</b-badge>&nbsp;
          </h2>
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
                                              }}
            </b-list-group-item>
            <b-list-group-item variant="dark">{{
                AnObject.prop2
                                              }}
            </b-list-group-item>
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
    <div></div>
    <h1>The emd</h1>
    <div></div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import AnObject                           from "../services/AnObject";
import UtilsDate                          from "@/Utils/UtilsDate";
import AlinaDatePicker                    from "@/components/elements/form/AlinaDatePicker";
import AlinaYandexMap                     from "@/components/elements/form/AlinaYandexMap";
import AjaxAlina                          from "@/services/AjaxAlina";
import ConfigApi                          from "@/configs/ConfigApi";
import MessagesObj                        from "@/services/MessagesObj";
import SpinnerObj                         from "@/services/SpinnerObj";
import iconVk                             from "@/assets/svg/socialnets/vk.svg";
import iconFb                             from "@/assets/svg/socialnets/fb.svg";
import iconWp                             from "@/assets/svg/socialnets/whatsapp.svg";
import iconTg                             from "@/assets/svg/socialnets/telgram.svg";
import iconIn                             from "@/assets/svg/socialnets/linkedin.svg";
import iconSk                             from "@/assets/svg/socialnets/skype.svg";
import iconVi                             from "@/assets/svg/socialnets/viber.svg";
import ClassicEditor                      from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import ConfigCkEditor                     from "@/configs/ConfigCkEditor";
import CurrentUser                        from "@/services/CurrentUser";
import UtilsStr                           from "@/Utils/UtilsStr";
import AlinaTableJson                     from "@/components/AlinaTableJson";
import AlinaFileUploader                  from "@/components/elements/form/AlinaFileUploader";

export default {
  name:       "About",
  components: {
    AlinaDatePicker,
    AlinaYandexMap,
    AlinaTableJson,
    AlinaFileUploader,
  },
  data() {
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    return {
      protoTale:       {
        header:        'This is Tale prototype',
        body:          '',
        body_txt:      '',
        geo_latitude:  66,
        geo_longitude: 66,
        geo_map_type:  'hybrid',
        geo_zoom:      14,
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
      lodashExample:   [1, 2, 3, 4],
      picker8:         null,
      AnObject:        AnObject,
      dateExample:     'DEFAULT VALUE',
      uts:             1,
      ckEditorRelated: {
        aModel:       'Ra-ta-ta-ta VeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpacesVeryLongTextNoSpaces',
        editorConfig: ConfigCkEditor,
        editor:       ClassicEditor,
      },
      CurrentUser:     CurrentUser.obj().attributes
    };
  },
  mounted() {
    this.svg001();
  },
  created() {
    this.dateplayer();
  },
  computed: {
    ...mapState("egStoreModule", ["sProp"]), ...mapGetters("egStoreModule", ["gProp"]),
    lodashExample2() {
      return this.lodash.partition(this.lodashExample, n => n % 2);
    }
  },
  methods:  {
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
      this.uts         = 477152940;
    },
    onClickBadResponse() {
      AjaxAlina.newInst({
        method: 'GET',
        url:    `${ConfigApi.url_base}/admintests/errors`,
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
        method:     'POST',
        url:        `${ConfigApi.url_base}/admintests/TestPost`,
        postParams: {
          form_id: 'lalala'
        },
        onDone:     (aja) => {
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
      this.$router.push({hash: "middle"})
    },
    log(data = null) {
      console.log("log ++++++++++");
      console.log(data);
    }
  },
};
</script>

<style scoped></style>
