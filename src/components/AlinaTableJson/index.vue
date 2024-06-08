<template>
  <div class="table-responsive">
    <table class="table table-dark table-striped table-hover table-sm">
      <thead v-if="!modeHideHeaders">
      <tr>
        <th v-for="(header, idx) in arrHeaders">
          {{ $t(header) }}
        </th>
        <th v-if="modeManage">
          {{ $t('Management') }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, index) in pJson">
        <td v-for="(header, idx) in arrHeaders">
          <span v-if="isHeaderAsHtml(header)" v-html="row[header]" class=""></span>
          <span v-else>{{ row[header] }}</span>
        </td>
        <td v-if="modeManage">
          <div v-if="isCurrentUserAllowedEdit(row)">
            <b-btn variant="danger" @click="$emit('onDelete', row, index)">{{ $t('Delete') }}</b-btn>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import CurrentUser from "@/services/CurrentUser";

export default {
  name:  "AlinaTableJson",
	emits: ['onDelete'],
  props: {
    pJson:           {
      default: []
    },
    showOnly:        {
      default() {return []}
    },
    modeManage:      {
      default: false
    },
    modeHideHeaders: {
      default: true
    }
  },
  data() {
    return {
      dJson:       [],
      arrHeaders:  [],
      arrData:     [],
      CurrentUser: CurrentUser.obj(),
    }
  },
  created() {
    this.defineHeaders();
  },
  beforeUpdate() {
    this.defineHeaders();
  },
  methods: {
    defineHeaders() {
      if (this.showOnly.length > 0) {
        this.arrHeaders = this.showOnly;
      } else {
        this.arrHeaders = Object.keys(Array.isArray(this.pJson) && this.pJson.length > 0 ? this.pJson[this.pJson.length - 1] : []);
      }
    },
    isCurrentUserAllowedEdit(obj) {
      //ToDo: Extend
      const isOwner = CurrentUser.obj().owns(obj.owner_id);
      return isOwner;
      //return isOwner || this.CurrentUser.isAdmin() || this.CurrentUser.isModerator();
    },
    isHeaderAsHtml(header){
      const arrHtmlHeaders = [
          'url',
          'img',
          'icon',
          'link',
      ];
      return arrHtmlHeaders.includes(header);
    }
  }
};
</script>

<style scoped lang="scss"></style>
