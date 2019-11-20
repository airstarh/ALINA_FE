<template>
  <div class="container-sm">
    <div class="row">
      <div class="col-sm">
        <form action="" method="post" enctype="multipart/form-data">
          <h2>
            Request <span><button type="button" @click="log">LOG</button></span>
          </h2>
          <StandardButtons :onGo="runAJax"></StandardButtons>
          <!--##################################################-->
          <!--##################################################-->
          <!--##################################################-->
          <BtstrpBadge title="Request Method" badge=""></BtstrpBadge>
          <div v-for="(m, i) in reqMethods" v-bind:key="i" class="form-group mt-3">
            <div class="form-check">
              <input :id="m" v-model="reqMethod" :value="m" type="radio" class="form-check-input"/>
              <label class="form-check-label" :for="m">
                {{ m }}
              </label>
            </div>
          </div>
          <!--##################################################-->
          <!--##################################################-->
          <!--##################################################-->
          <div class="form-group mt-3">
            <BtstrpBadge title="URI" badge="reqUri"></BtstrpBadge>
            <input v-model="reqUri" type="text" class="form-control"/>
          </div>

          <div class="row">
            <div class="col-sm">
              <div class="form-group mt-3">
                <BtstrpBadge title="GET" badge="reqGet"></BtstrpBadge>
                <textarea v-model="reqGetTxt" class="form-control" rows="11"></textarea>
              </div>
            </div>
            <div class="col-sm">
              <div class="form-group mt-3">
                <BtstrpBadge title="POST" badge="reqPost"></BtstrpBadge>
                <textarea id="reqPost" v-model="reqPostTxt" class="form-control" rows="11"></textarea>
                <div class="custom-control custom-checkbox">
                  <input id="reqPostRaw" v-model="reqPostRaw" type="checkbox" class="custom-control-input"/>
                  <label class="btn btn-primary custom-control-label" for="reqPostRaw">
                    reqPostRaw
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group mt-3">
            <BtstrpBadge title="Headers" badge="reqHeaders"></BtstrpBadge>
            <textarea v-model="reqHeadersTxt" class="form-control" rows="5"></textarea>
          </div>
          <StandardButtons :onGo="runAJax"></StandardButtons>
        </form>
      </div>
      <!--##################################################-->
      <!--##################################################-->
      <!--##################################################-->
      <div class="col-sm">
        <img src="http://alinazero:8080/sources/images/orig.png" width="150">
        <div class="mt-3">
          <h2>Response</h2>
          <div class="mt-3">
            <BtstrpBadge title="URI" badge="urlRes"></BtstrpBadge>
            <input v-model="urlRes" type="text" class="form-control"/>
          </div>

          <div class="mt-3">
            <BtstrpBadge title="Body" badge="respBodyTxt"></BtstrpBadge>
            <textarea v-model="respBodyTxt" class="form-control w-100" rows="11"></textarea>
          </div>
          <div class="mt-3">
            <BtstrpBadge title="Headers" badge="respHeaderTxt"></BtstrpBadge>
            <textarea v-model="respHeaderTxt" class="form-control w-100" rows="11"></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm">
        <div class="m-5">
          <BtstrpBadge title="iframe" badge="$data->q->respBody"></BtstrpBadge>
        </div>
      </div>
    </div>
  </div>
  <!-- /container -->
</template>

<script>
	import StandardButtons from "../components/elements/form/StandardButtons";
	import BtstrpBadge     from "../components/elements/BtstrpBadge";
	import {Ajax}          from "../services/Ajax";

	export default {
		name:       "RestCall",
		components: {
			StandardButtons,
			BtstrpBadge
		},
		data() {
			return {
				//reqUri:                  "http://alinazero:8080/alinaRestAccept/TestCors?lala[]=1&lala[]=2&lala[]=3&foo=bar",
				reqUri:                  "http://alinazero:8080/sources/images/orig.png",
				resU:                    "",
				reqPostRaw:              true,
				reqGet:                  {
					lala: [4, 5, 6],
					foo:  'привет'
				},
				reqPost:                 {},
				reqHeaders:              {},
				/////////////////////////////////
				reqGetTxt:               "",
				reqPostTxt:              "",
				reqHeadersTxt:           "",
				/////////////////////////////////
				reqMethods:              ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
				reqMethod:               "GET",
				/////////////////////////////////
				/////////////////////////////////
				/////////////////////////////////
				urlRes:                  "",
				respBody:                "",
				respHeadersStructurized: {},
				/////////////////////////////////
				respHeaderTxt:           '',
				respBodyTxt:             "",
				/////////////////////////////////
			};
		},
		computed:   {},
		created() {
			this.objsToTxt();
		},
		methods:    {
			runAJax() {
				const oAjax = Ajax.newInst({
					url:        this.reqUri,
					mode:       "cors",
					//mode:       "no-cors",
					getParams:  this.reqGet,
					headers:    this.reqHeaders,
					postParams: this.reqPost,
					method:     this.reqMethod,
					onDone:     this.onDone
				});
				oAjax.go();
			},

			onDone(oAjax) {
				this.respHeaderTxt = JSON.stringify(oAjax.respHeadersStructurized, null, 2);
				switch (oAjax.respType) {
					case "json":
						this.respBodyTxt = JSON.stringify(oAjax.respBody, null, 2);
						break;
					case "text":
					case "blob":
					default:
						this.respBodyTxt = oAjax.respBody;
						break;
				}

				this.reqUri  = oAjax.urlClean;
				this.urlRes  = oAjax.urlRes;
				this.reqGet  = oAjax.options.getParams;
				this.reqPost = oAjax.options.postParams;

				this.objsToTxt();

				console.log("onDone ajaajaajaajaajaajaaja ++++++++++");
				console.log(oAjax);
			},

			objsToTxt() {
				this.reqGetTxt     = JSON.stringify(this.reqGet, null, 2);
				this.reqPostTxt    = JSON.stringify(this.reqPost, null, 2);
				this.reqHeadersTxt = JSON.stringify(this.reqHeaders, null, 2);
			},

			log() {
				console.log("log ++++++++++");
				console.log(this.reqGet);
			}
		}
	};
</script>

<style scoped></style>
