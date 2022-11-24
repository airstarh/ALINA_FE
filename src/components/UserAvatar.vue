<template>
  <div class="UserAvatar">
    <div
        class="row no-gutters"
    >
      <div class="col">
        <span class="btn-secondary text-left text-nowrap badge-pill p-2">
            <router-link :to="'/auth/profile/'+userId" class="fixed-height-150px">
                <img v-if="emblemUrl" :src="emblemUrl" :width="emblemWidth" class="rounded-circle">
                <img v-if="!emblemUrl" src="@/assets/anarki.png" :width="emblemWidth" class="rounded-circle">
            </router-link>
            <router-link :to="'/auth/profile/'+userId" class="text-light">
                {{ UtilsStr.fullName(this.userFirstName, this.userLastName, this.userId) }}
            </router-link>
        </span>
        {{ someDate | unix_to_date_time }}
      </div>
    </div>
  </div>
</template>

<script>
import UtilsStr from "@/Utils/UtilsStr";

export default {
  name:  "UserAvatar",
  props: {
    userId:         {
      type:    String | Number,
      default: ''
    },
    userFirstName:  {
      type:    String,
      default: ''
    },
    userLastName:   {
      type:    String,
      default: ''
    },
    someDate:       {
      type:    String | Number,
      default: ''
    },
    emblemUrl:      {
      type:    String,
      default: ''
    },
    emblemWidth:    {
      type:    String,
      default: '50px'
    },
    additionalInfo: {
      type:    String,
      default: ''
    },
  },
  data() {
    return {
      UtilsStr
    }
  },
  methods: {}
};
</script>

<style scoped lang="scss"></style>
