<template>
    <div class="container border border-primary">
        <img alt="Vue logo" src="../assets/logo.png" height="10px"/>
        <div>
            <div><h1>{{ sProp }} : mapped from Store</h1></div>
            <div><h1>{{ $store.state.egStoreModule.sProp }} : direct from Store</h1></div>
            <button @click="methChangeProp">Change Prop</button>
            <button @click="log">log</button>
        </div>
        <div>
            <br>
            <button
                    @click="onClickBadResponse()"
                    class="btn btn-lg btn-primary">TEST AJAX
            </button>
            &nbsp;
            <a
                    :href="`${ConfigApi.url_base}/Auth/ResetPasswordRequest`"
                    class="btn btn-lg btn-primary"
            >Test origin</a>
            &nbsp;
            <button
                    @click="onTestPost()"
                    class="btn btn-lg btn-primary">TEST POST
            </button>

            <br>
            <br>
        </div>
        <div>
            <h1>AlinaDatePicker</h1>
            <AlinaDatePicker
                    v-model="uts"
                    class="notranslate"
            ></AlinaDatePicker>
            <div>{{uts}} ||| {{uts | unix_to_date_time}}</div>
        </div>
        <div>
            <h1>Date FNS</h1>
            <!--<div>Now: {{ now }}</div>-->
            <div>Now: {{ new Date() | date }}</div>
            <div>Now: {{ $date(new Date()) }}</div>
            <div>Now: {{ new Date() | date('DD MMMM YYYY') }}</div>
            <div>Now: {{ $date(new Date(), 'DD MMMM YYYY') }}</div>
            <div>Now: {{ $date(new Date(), 'X') }}</div>
            <br>
            {{dateExample}}
        </div>
        <br>
        <div>
            <!--##########-->
            <h1>Lodash</h1>
            <div>{{lodashExample | json_str}}</div>
            <div>{{lodashExample2 | json_str}}</div>
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
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from "vuex";
    import AnObject from "../services/AnObject";
    import UtilsDate from "@/Utils/UtilsDate";
    import AlinaDatePicker from "@/components/elements/form/AlinaDatePicker";
    import AjaxAlina from "@/services/AjaxAlina";
    import ConfigApi from "@/configs/ConfigApi";
    import MessagesObj from "@/services/MessagesObj";
    export default {
        name:       "About",
        components: {
            AlinaDatePicker
        },
        data() {
            const twoWeeksFromNow = new Date();
            twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
            return {
                ConfigApi,
                lodashExample: [1, 2, 3, 4],
                picker8:       null,
                AnObject:      AnObject,
                dateExample:   'DEFAULT VALUE',
                uts:           1,
            };
        },
        created() {
            this.dateplayer();
        },
        computed:   {
            ...mapState("egStoreModule", ["sProp"]),
            ...mapGetters("egStoreModule", ["gProp"]),
            lodashExample2() {
                return this.lodash.partition(this.lodashExample, n => n % 2);
            }
        },
        methods:    {
            ...mapActions("egStoreModule", ["aProp"]),
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
            log() {
                console.log("log ++++++++++");
                console.log(this.sProp);
            }
        },
    };
</script>

<style scoped></style>
