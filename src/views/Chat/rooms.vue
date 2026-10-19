<template>
  <main class="container py-3">
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
    <ChatRoomsTable :title="$t('My chats')" :section="rooms.mine" />
    <ChatRoomsTable :title="$t('Other chats')" :section="rooms.others" />
  </main>
</template>

<script setup>
import {onBeforeUnmount, onMounted, reactive, ref} from 'vue';
import ConfigApi from '@/configs/ConfigApi';
import CurrentUser from '@/services/CurrentUser';
import ChatRoomsTable from '@/components/Chat/ChatRoomsTable.vue';
import {refreshChatIdentity} from '@/components/Chat/chatIdentity.js';
import {createChatRoomsConnection} from '@/components/Chat/chatRoomsConnection.js';
import {websocketUrl} from '@/components/Chat/chatProtocol.js';

const user = CurrentUser.obj();
const status = ref({state: 'connecting'});
const rooms = reactive({
  mine: {rows: [], total: 0, limit: 1000, offset: 0},
  others: {rows: [], total: 0, limit: 1000, offset: 0},
});
const pagination = reactive({
  mine: {limit: 1000, offset: 0},
  others: {limit: 1000, offset: 0},
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
  status.value = {state: 'connecting'};
  try { await refreshChatIdentity(user, ConfigApi.url_base, controller.signal); } catch { /* The cached public identity remains usable. */ }
  if (current !== generation) return;
  identityAbort = null;
  connection = createChatRoomsConnection({
    url: websocketUrl(ConfigApi.url_base),
    getUser: () => user.attributes,
    getPagination: () => ({
      mine: {...pagination.mine},
      others: {...pagination.others},
    }),
    onRooms: applyRooms,
    onStatus: value => { status.value = value; },
  });
  connection.start();
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
