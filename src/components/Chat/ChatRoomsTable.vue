<template>
  <section class="chat-list mt-5 mb-5">
    <h2 class="mb-5">{{ title }} ({{ rows.length }})</h2>
    <div class="table-responsive">
      <table class=" table-dark">
        <tbody>
          <template v-for="(room, index) in rows" :key="room.id">
            <tr>
              <td rowspan="2" class="align-middle">
                <div class="chat-number">{{ offset + index + 1 }}</div>
              </td>
              <td :colspan="canDelete ? 2 : 1">
                <h3 class="h-chat-name">
                  <a :href="roomHref(room.channel)">{{ room.chatName }}</a>
                  ({{ $t('i_people') }} {{ room.participantCount }})
                </h3>
              </td>
            </tr>
            <tr>
              <td class="text-nowrap">🕒 {{ formatDate(room.latestMessageAt) }}</td>
              <td v-if="canDelete" class="text-end"><button type="button" class="btn btn-danger btn-sm" @click="$emit('delete', room)">X</button></td>
            </tr>
            <tr>
              <td>
                <div class="mb-5"></div>
              </td>
            </tr>
          </template>
          <tr v-if="!rows.length">
            <td :colspan="canDelete ? 3 : 2" class="text-center text-secondary">{{ $t('No chats found.') }}</td>
          </tr>

        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import UtilsDate from '@/Utils/UtilsDate';

const props = defineProps({
  title: { type: String, required: true },
  section: { type: Object, required: true },
  canDelete: Boolean,
});
defineEmits(['delete']);
const router = useRouter();
const rows = computed(() => Array.isArray(props.section?.rows) ? props.section.rows : []);
const offset = computed(() => Number(props.section?.offset) || 0);
function formatDate(timestamp) {
  return timestamp === null || timestamp === undefined
    ? ''
    : UtilsDate.dateObjFormat(new Date(Number(timestamp)), 'yyyy-MM-dd HH:mm');
}

function roomHref(channel) {
  return router.resolve({ path: '/chat', query: { channel } }).href;
}
</script>
<style>
.chat-number {
  background-color: #000 !important;
  padding: 2mm;
  margin: 3mm;

  border-radius: 50%;
  aspect-ratio: 1;
  min-height: 7mm;

  display: flex;
  align-items: center;
  justify-content: center;
}

.h-chat-name a {
  color: #fff;
}
</style>
