<template>
  <main class="container chat-rooms-page">
    <header class="mb-4">
      <h1 class="mb-3">{{ $t('Chat rooms') }}</h1>
      <p v-if="['connecting', 'loading', 'reconnecting'].includes(status.state)" class="alert alert-info" role="status">
        {{ status.state === 'loading' ? $t('Loading chat rooms…') : $t('Connecting…') }}
      </p>
      <p v-if="status.state === 'error'" class="alert alert-danger" role="alert">
        {{ status.error || $t('Could not load chat rooms.') }}
        <button type="button" class="btn btn-danger btn-sm ms-2" @click="retry">{{ $t('Retry') }}</button>
      </p>
    </header>
    <form v-if="user.attributes.id" class="chat-room-create mb-4" @submit.prevent="createChatRoom">
      <label for="chat-room-create-name" class="form-label">{{ $t('Create my chat:') }}</label>
      <div class="input-group">
        <input id="chat-room-create-name" v-model="newChatName" type="text" class="form-control" maxlength="200" required />
        <button type="submit" class="btn btn-primary" :aria-label="$t('Create my chat:')">→</button>
      </div>
    </form>
    <div class="mb-5">&nbsp;</div>
    <ChatRoomsTable :title="$t('My chats')" :section="rooms.mine" :can-delete="canDelete" @delete="deleteRoom" />
    <div class="mb-5">&nbsp;</div>
    <ChatRoomsTable :title="$t('Other chats')" :section="rooms.others" :can-delete="canDelete" @delete="deleteRoom" />
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ConfigApi from '@/configs/ConfigApi';
import CurrentUser from '@/services/CurrentUser';
import ChatRoomsTable from '@/components/Chat/ChatRoomsTable.vue';
import { refreshChatIdentity } from '@/components/Chat/chatIdentity.js';
import { createChatRoomsConnection } from '@/components/Chat/chatRoomsConnection.js';
import { websocketUrl } from '@/components/Chat/chatProtocol.js';
import { canKickParticipants } from '@/components/Chat/chatProtocol.js';
import { createChatRoomTarget } from '@/components/Chat/chatRoomCreation.js';

const user = CurrentUser.obj();
const { t } = useI18n();
const router = useRouter();
const canDelete = computed(() => canKickParticipants(user));
const newChatName = ref('');
const status = ref({ state: 'connecting' });
const rooms = reactive({
  mine: { rows: [], total: 0, limit: 1000, offset: 0 },
  others: { rows: [], total: 0, limit: 1000, offset: 0 },
});
const pagination = reactive({
  mine: { limit: 1000, offset: 0 },
  others: { limit: 1000, offset: 0 },
});
let connection = null;
let identityAbort = null;
let generation = 0;

function applyRooms(response) {
  rooms.mine = response.mine;
  rooms.others = response.others;
}

async function start() {
  const current = ++generation;
  connection?.stop();
  const controller = new AbortController();
  identityAbort?.abort();
  identityAbort = controller;
  status.value = { state: 'connecting' };
  try { await refreshChatIdentity(user, ConfigApi.url_base, controller.signal); } catch { /* The cached public identity remains usable. */ }
  if (current !== generation) return;
  identityAbort = null;
  connection = createChatRoomsConnection({
    url: websocketUrl(ConfigApi.url_base),
    getUser: () => user.attributes,
    getPagination: () => ({
      mine: { ...pagination.mine },
      others: { ...pagination.others },
    }),
    onRooms: applyRooms,
    onDeleted: event => {
      const deleted = new Set(event.deletedChannels || []);
      rooms.mine = { ...rooms.mine, rows: rooms.mine.rows.filter(room => !deleted.has(room.channel)) };
      rooms.others = { ...rooms.others, rows: rooms.others.rows.filter(room => !deleted.has(room.channel)) };
    },
    onStatus: value => { status.value = value; },
  });
  connection.start();
}

function deleteRoom(room) {
  if (window.confirm(`${t('Delete chat')} “${room.chatName}”?`)) connection?.deleteChat(room.channel);
}

function createChatRoom() {
  const target = createChatRoomTarget(newChatName.value, user.attributes.id);
  if (!target) return;
  newChatName.value = '';
  router.push(target);
}

function retry() {
  if (connection) connection.retry();
  else start();
}

onMounted(start);
onBeforeUnmount(() => {
  generation++;
  identityAbort?.abort();
  connection?.stop();
});
</script>
<style scoped>
.chat-rooms-page {
  padding: 2px;
}
</style>
