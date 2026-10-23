<template>
  <section v-if="compact" class="chat-room-sidebar-section">
    <div class="chat-sidebar-title">
      <h2>{{ title }}</h2><span>{{ rows.length }}</span>
    </div>
    <p v-if="!rows.length" class="chat-muted">{{ $t('No chats found.') }}</p>
    <ul v-else class="chat-room-sidebar-list">
      <li v-for="room in rows" :key="room.id" class="chat-room-sidebar-item" :class="{'is-mentioned': mentionIsUnread(room)}">
        <div class="chat-room-sidebar-details">
          <a :href="roomHref(room.channel)" class="chat-room-sidebar-name">{{ room.chatName }}</a>
          <span class="chat-room-sidebar-status">
            {{ $t('i_people') }} {{ room.participantCount }}
            <span v-if="room.latestMessageAt">· {{ formatDate(room.latestMessageAt) }}</span>
          </span>
        </div>
        <button v-if="canDelete" type="button" class="chat-button chat-kick"
                :title="$t('Delete chat')" :aria-label="`${$t('Delete chat')}: ${room.chatName}`"
                @click="$emit('delete', room)">×</button>
      </li>
    </ul>
  </section>
  <section v-else class="chat-list mt-5 mb-5">
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
import {computed, ref, watch} from 'vue';
import { useRouter } from 'vue-router';
import UtilsDate from '@/Utils/UtilsDate';
import {prioritizeCurrentRoom} from '@/components/Chat/chatRoomDirectory.js';
import {acknowledgeRoomMention, isRoomMentionUnread, loadRoomMentionAcknowledgements, prioritizeUnreadRooms} from '@/components/Chat/chatRoomMentions.js';

const props = defineProps({
  title: { type: String, required: true },
  section: { type: Object, required: true },
  canDelete: Boolean,
  compact: Boolean,
  currentChannel: {type: String, default: ''},
});
defineEmits(['delete']);
const router = useRouter();
const seenMentions = ref(loadRoomMentionAcknowledgements(window.sessionStorage));
const rows = computed(() => prioritizeUnreadRooms(
  prioritizeCurrentRoom(props.section?.rows, props.currentChannel),
  seenMentions.value,
));
watch([rows, () => props.currentChannel], ([currentRows, currentChannel]) => {
  const currentRoom = currentRows.find(room => room.channel === currentChannel);
  if (currentRoom) seenMentions.value = acknowledgeRoomMention(seenMentions.value, currentRoom, window.sessionStorage);
}, {immediate: true});
function mentionIsUnread(room) {
  return isRoomMentionUnread(room, seenMentions.value[room.channel]);
}
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
.chat-room-sidebar-section + .chat-room-sidebar-section {
  margin-top: 28px;
}
.chat-room-sidebar-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.chat-room-sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}
.chat-room-sidebar-item.is-mentioned {
  margin-inline: -6px;
  padding: 6px;
  border-radius: 6px;
  background: #123d2a;
}
.chat-room-sidebar-details {
  min-width: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}
.chat-room-sidebar-name {
  color: #edf2f8;
  overflow-wrap: anywhere;
  text-decoration: none;
}
.chat-room-sidebar-name:hover {
  text-decoration: underline;
}
.chat-room-sidebar-status {
  color: #a8b7c9;
  font-size: 12px;
  overflow-wrap: anywhere;
}
</style>
