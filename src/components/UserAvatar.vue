<template>
  <div class="UserAvatar">
    <div
        class="row no-gutters"
    >
      <div class="col">
        <span class="btn-secondary text-left text-nowrap badge-pill p-2">
            <router-link :to="'/auth/profile/'+userId" class="fixed-height-150px">
                <img :src="emblemUrl" class="rounded-circle" :style="{'width': emblemWidth}">
            </router-link>
            <router-link :to="'/auth/profile/'+userId" class="text-light alina-user-avatar">
                {{ UtilsStr.fullName(this.userFirstName, this.userLastName, this.userId) }}
            </router-link>
            <span style="font-size: min(2vmin, 0.5em)">{{ someDate | unix_to_date_time }}</span>
        </span>
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

a.alina-user-avatar {
  display: inline-block;
  max-width: 50%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: middle;
}

</style>
