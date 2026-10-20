<template>
  <section class="mb-4">
    <h2 class="mb-3">{{ title }} ({{ rows.length }})</h2>
    <div class="table-responsive">
      <table class="table table-dark table-striped table-hover table-sm">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">{{ $t('Chat name') }}</th>
            <th scope="col">{{ $t('Participants') }}</th>
            <th scope="col">{{ $t('Latest message') }}</th>
            <th v-if="canDelete" scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(room, index) in rows" :key="room.id">
            <td>{{ offset + index + 1 }}</td>
            <td><a :href="roomHref(room.channel)" target="_blank" rel="noopener">{{ room.chatName }}</a></td>
            <td>{{ room.participantCount }}</td>
            <td>{{ formatDate(room.latestMessageAt) }}</td>
            <td v-if="canDelete"><button type="button" class="btn btn-danger btn-sm" @click="$emit('delete', room)">X</button></td>
          </tr>
          <tr v-if="!rows.length">
            <td :colspan="canDelete ? 5 : 4" class="text-center text-secondary">{{ $t('No chats found.') }}</td>
          </tr>
          <tr class="fw-bold">
            <td></td>
            <th scope="row">{{ $t('TOTAL') }}</th>
            <td>{{ participantTotal }}</td>
            <td>{{ formatDate(latestMessageAt) }}</td>
            <td v-if="canDelete"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import {computed} from 'vue';
import {useRouter} from 'vue-router';
import UtilsDate from '@/Utils/UtilsDate';

const props = defineProps({
  title: {type: String, required: true},
  section: {type: Object, required: true},
  canDelete: Boolean,
});
defineEmits(['delete']);
const router = useRouter();
const rows = computed(() => Array.isArray(props.section?.rows) ? props.section.rows : []);
const offset = computed(() => Number(props.section?.offset) || 0);
const participantTotal = computed(() => rows.value.reduce((sum, room) => sum + (Number(room.participantCount) || 0), 0));
const latestMessageAt = computed(() => rows.value.reduce((latest, room) => {
  const timestamp = Number(room.latestMessageAt) || 0;
  return timestamp > latest ? timestamp : latest;
}, 0) || null);
function formatDate(timestamp) {
  return timestamp === null || timestamp === undefined
    ? ''
    : UtilsDate.dateObjFormat(new Date(Number(timestamp)), 'yyyy-MM-dd HH:mm');
}

function roomHref(channel) {
  return router.resolve({path: '/chat', query: {channel}}).href;
}
</script>
