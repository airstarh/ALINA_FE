<template>
  <div class="UserAvatar">
    <div class="text-right" v-if="!UtilsData.empty(someDate)">
      <span style="font-size: min(4vmin, 0.7em);">{{ UtilsDate.fromUnixToDateTime(someDate) }}</span>
    </div>
    <div
        class="row no-gutters"
    >
      <div class="col">
        <span
            class="text-left text-nowrap p-2 alina-user-avatar-wrapper"
            :style="{
              'border-radius': isComment ? '0 25px 25px 0' :'25px'
            }"
        >
          <router-link :to="'/auth/profile/'+userId" class="text-light alina-user-avatar">
            {{ UtilsStr.firstName(this.userFirstName, this.userLastName, this.userId) }}
          </router-link>
          <span>&nbsp;</span>
          <router-link :to="'/auth/profile/'+userId" class="">
                <img :src="emblemUrl" class="rounded-circle" :style="{'width': emblemWidth}">
          </router-link>
          <span>&nbsp;</span>
          <router-link :to="'/auth/profile/'+userId" class="text-light alina-user-avatar">
            {{ UtilsStr.lastName(this.userFirstName, this.userLastName, this.userId) }}
          </router-link>
        </span>

      </div>
    </div>
  </div>
</template>

<script>
import UtilsStr  from "@/Utils/UtilsStr";
import UtilsDate from "../Utils/UtilsDate";
import UtilsData from "@/Utils/UtilsData";

export default {
  name:     "UserAvatar",
  computed: {
    UtilsData() {
      return UtilsData
    },
    UtilsDate() {
      return UtilsDate
    }
  },
  props:    {
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
      default: '@/assets/anarki.png'
    },
    emblemWidth:    {
      type:    String,
      default: '50px'
    },
    additionalInfo: {
      type:    String,
      default: ''
    },
    isComment:      {
      type:    Boolean,
      default: false
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

<style scoped lang="scss">
@media (max-width: 500px) {

}

.alina-user-avatar-wrapper {
  background-color: #777;
  border-radius: 0 20px 20px 0;
}

a.alina-user-avatar {
  display: inline-block;
  max-width: 11ch;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: middle;
}

</style>
