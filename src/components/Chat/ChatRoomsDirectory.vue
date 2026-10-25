<template>
  <section class="chat-rooms-directory" :aria-label="$t('Chat rooms')">
    <p v-if="['connecting', 'loading', 'reconnecting'].includes(status.state)" class="alert alert-info" role="status">
      {{ status.state === 'loading' ? $t('Loading chat rooms…') : $t('Connecting…') }}
    </p>
    <p v-if="status.state === 'error'" class="alert alert-danger" role="alert">
      {{ status.error || $t('Could not load chat rooms.') }}
      <button type="button" class="btn btn-danger btn-sm ms-2" @click="retry">{{ $t('Retry') }}</button>
    </p>
    <ChatRoomCreateForm v-if="compact" compact />
    <ChatRoomsTable :title="$t('My chats')" :section="searchActive ? searchSection : rooms.mine" :can-delete="canDelete" :can-pin="!!user.attributes.id" :compact="compact" :current-channel="currentChannel" @delete="deleteRoom" @pin="pinRoom">
      <template v-if="compact && user.attributes.id" #after-title>
        <label class="chat-sr-only" :for="searchId">{{ $t('Search chats') }}</label>
        <input :id="searchId" v-model="searchQuery" type="search" class="chat-directory-search"
               :placeholder="$t('Search chats')" maxlength="200" @input="searchChats" />
      </template>
    </ChatRoomsTable>
    <template v-if="user.attributes.id && !searchActive">
      <div v-if="!compact" class="mb-5">&nbsp;</div>
      <ChatRoomsTable :title="$t('Other chats')" :section="rooms.others" :can-delete="canDelete" :can-pin="!!user.attributes.id" :compact="compact" :current-channel="currentChannel" @delete="deleteRoom" @pin="pinRoom" />
    </template>
  </section>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, reactive, ref, useId} from 'vue';
import {useI18n} from 'vue-i18n';
import ConfigApi from '@/configs/ConfigApi';
import CurrentUser from '@/services/CurrentUser';
import ChatRoomsTable from '@/components/Chat/ChatRoomsTable.vue';
import ChatRoomCreateForm from '@/components/Chat/ChatRoomCreateForm.vue';
import {refreshChatIdentity} from '@/components/Chat/chatIdentity.js';
import {createChatRoomsConnection} from '@/components/Chat/chatRoomsConnection.js';
import {canKickParticipants, websocketUrl} from '@/components/Chat/chatProtocol.js';

const props = defineProps({
  apiBaseUrl: {type: String, default: () => ConfigApi.url_base},
  compact: Boolean,
  currentChannel: {type: String, default: ''},
});
const user = CurrentUser.obj();
const {t} = useI18n();
const canDelete = computed(() => canKickParticipants(user));
const searchId = `chat-directory-search-${useId()}`;
const searchQuery = ref('');
const searchRows = ref([]);
const searchActive = computed(() => searchQuery.value.trim() !== '');
const searchSection = computed(() => ({rows: searchRows.value, total: searchRows.value.length, limit: 1000, offset: 0}));
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
let searchTimer;

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
  try { await refreshChatIdentity(user, props.apiBaseUrl, controller.signal); } catch { /* The cached public identity remains usable. */ }
  if (current !== generation) return;
  identityAbort = null;
  connection = createChatRoomsConnection({
    url: websocketUrl(props.apiBaseUrl),
    getUser: () => user.attributes,
    getPagination: () => ({mine: {...pagination.mine}, others: {...pagination.others}}),
    onRooms: applyRooms,
    onSearch: result => {
      if (result.query === searchQuery.value.trim()) searchRows.value = result.rooms;
    },
    onPin: ({channel, isPinned}) => {
      for (const section of [rooms.mine, rooms.others]) {
        section.rows = section.rows.map(room => room.channel === channel ? {...room, isPinned} : room);
      }
      searchRows.value = searchRows.value.map(room => room.channel === channel ? {...room, isPinned} : room);
      if (searchActive.value) connection?.searchRooms(searchQuery.value.trim());
    },
    onDeleted: event => {
      const deleted = new Set(event.deletedChannels || []);
      rooms.mine = {...rooms.mine, rows: rooms.mine.rows.filter(room => !deleted.has(room.channel))};
      rooms.others = {...rooms.others, rows: rooms.others.rows.filter(room => !deleted.has(room.channel))};
    },
    onStatus: value => { status.value = value; },
  });
  connection.start();
}

function searchChats() {
  searchRows.value = [];
  clearTimeout(searchTimer);
  const query = searchQuery.value.trim();
  if (!query) return;
  searchTimer = setTimeout(() => connection?.searchRooms(query), 250);
}

function deleteRoom(room) {
  if (window.confirm(`${t('Delete chat')} “${room.chatName}”?`)) connection?.deleteChat(room.channel);
}

function pinRoom(room) {
  connection?.toggleChatPin(room.channel);
}

function retry() {
  if (connection) connection.retry();
  else start();
}

onMounted(start);
onBeforeUnmount(() => {
  generation++;
  identityAbort?.abort();
  clearTimeout(searchTimer);
  connection?.stop();
});
</script>
