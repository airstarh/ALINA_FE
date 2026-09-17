<template>
  <section class="alina-chat" :aria-label="$t('Chat')">
    <header class="chat-header">
      <div class="chat-title"><h1>{{ title || $t('Chat') }}</h1><span>{{ $t('Channel') }} {{ normalizedChannel }}</span></div>
      <div class="chat-header-actions">
        <span class="chat-connection-status" :class="{'is-connected': connected}" role="status">{{ statusText }}</span>
        <button type="button" class="chat-button chat-people-toggle" :aria-expanded="peopleOpen" :aria-controls="peopleId" @click="peopleOpen = !peopleOpen">
          {{ $t('People') }} ({{ participants.length }})
        </button>
        <button type="button" class="chat-button" :title="$t('Reconnect')" :aria-label="$t('Reconnect')" @click="reconnect">↻</button>
      </div>
    </header>
    <div class="chat-layout" :class="{'chat-people-open': peopleOpen}">
      <ChatParticipants :id="peopleId" :participants="participants" :self-id="selfId" :base-url="apiBaseUrl" :connected="connected" />
      <div class="chat-conversation">
        <div ref="messageList" class="chat-messages" role="log" :aria-label="$t('Messages')" aria-live="polite" aria-relevant="additions" @scroll="trackScroll">
          <p v-if="!messages.length" class="chat-empty">{{ connected ? $t('No messages yet. Start the conversation.') : $t('Connecting to chat…') }}</p>
          <ChatMessage v-for="message in messages" :key="message.id" :message="message" :own="isOwn(message)" :base-url="apiBaseUrl"
                       @media-load="scrollIfFollowing" @copy-error="error = $t('Could not copy the URL. Please copy the link manually.')" />
        </div>
        <button v-if="unread" type="button" class="chat-new-messages" @click="jumpToLatest">{{ $t('New messages') }} ({{ unread }}) ↓</button>
        <p v-if="typingNames" class="chat-typing-summary" role="status">{{ typingNames }} — {{ $t('Typing…') }}</p>
        <p v-if="error" class="chat-error" role="alert">{{ error }} <button type="button" :aria-label="$t('Dismiss')" @click="error = ''">×</button></p>
        <form class="chat-composer" @submit.prevent="sendMessage">
          <label class="chat-sr-only" :for="inputId">{{ $t('Message') }}</label>
          <textarea :id="inputId" ref="input" v-model="draft" :placeholder="$t('Type a message…')" rows="2" maxlength="16000"
                    @input="onInput" @keydown="onKeydown" @blur="connection?.typing(false)"></textarea>
          <button type="submit" class="chat-send" :disabled="!connected || !draft.trim()">{{ $t('Send') }}</button>
          <small class="chat-composer-hint">{{ $t('Ctrl+Enter to send · Enter for a new line') }}</small>
        </form>
      </div>
    </div>
  </section>
</template>
<script setup>
import {computed, nextTick, onBeforeUnmount, ref, useId, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import CurrentUser from '@/services/CurrentUser';
import ConfigApi from '@/configs/ConfigApi';
import ChatMessage from './ChatMessage.vue';
import ChatParticipants from './ChatParticipants.vue';
import {createChatConnection} from './chatConnection.js';
import {displayName, websocketUrl} from './chatProtocol.js';
import './chat.css';

const props = defineProps({channel: {type: String, default: '1'}, title: {type: String, default: ''}, apiBaseUrl: {type: String, default: () => ConfigApi.url_base}});
const {t} = useI18n();
const inputId = `chat-input-${useId()}`;
const peopleId = `chat-people-${useId()}`;
const normalizedChannel = computed(() => props.channel.trim() || '1');
const messages = ref([]);
const participants = ref([]);
const selfId = ref('');
const draft = ref('');
const error = ref('');
const peopleOpen = ref(false);
const status = ref({state: 'connecting'});
const connected = computed(() => status.value.state === 'connected');
const messageList = ref(null);
const input = ref(null);
const following = ref(true);
const unread = ref(0);
const user = CurrentUser.obj();
const drafts = new Map();
let connection = null;
let generation = 0;
let identityAbort = null;
let identityTimeout = null;
const statusText = computed(() => {
  if (status.value.state === 'connected') return t('Connected');
  if (status.value.state === 'reconnecting') return `${t('Reconnecting in')} ${Math.ceil(status.value.delay / 1000)}s`;
  if (status.value.state === 'error') return t('Connection interrupted');
  return t('Connecting…');
});
const typingNames = computed(() => participants.value.filter(person => person.typing && person.id !== selfId.value).map(person => displayName(person.user)).join(', '));
function isOwn(message) {
  return !!selfId.value && message.participantId === selfId.value;
}
function trackScroll() {
  const el = messageList.value;
  if (!el) return;
  following.value = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  if (following.value) unread.value = 0;
}
async function scrollIfFollowing() {
  await nextTick();
  if (following.value && messageList.value) messageList.value.scrollTop = messageList.value.scrollHeight;
}
function jumpToLatest() {
  following.value = true;
  unread.value = 0;
  scrollIfFollowing();
}
function receive(event) {
  if (event.type === 'history' && Array.isArray(event.messages)) {
    messages.value = event.messages;
    unread.value = 0;
    following.value = true;
    scrollIfFollowing();
  } else if (event.type === 'message' && event.message?.id) {
    if (messages.value.some(message => message.id === event.message.id)) return;
    messages.value.push(event.message);
    // Bound DOM growth during long-lived sessions.
    if (messages.value.length > 500) messages.value.shift();
    if (!following.value) unread.value++;
    scrollIfFollowing();
  } else if (event.type === 'presence' && Array.isArray(event.participants)) {
    selfId.value = event.selfId;
    participants.value = event.participants;
  } else if (event.type === 'error') {
    error.value = event.error || t('Could not send the message.');
  }
}
async function refreshIdentity(signal) {
  const url = new URL('/root/status', props.apiBaseUrl);
  url.searchParams.set('isAjax', '1');
  const headers = {...ConfigApi.AjaxAlina.options.headers};
  if (user.attributes.id && user.attributes.token) {
    headers.uid = String(user.attributes.id);
    headers.token = user.attributes.token;
  }
  const response = await fetch(url, {credentials: 'include', headers, signal});
  if (!response.ok) throw new Error('Identity refresh failed');
  const body = await response.json();
  if (body.CurrentUser) user.applyAttributes(body.CurrentUser);
}
watch([normalizedChannel, () => props.apiBaseUrl], async ([channel], previous) => {
  const current = ++generation;
  if (previous) drafts.set(previous[0], draft.value);
  connection?.stop();
  connection = null;
  identityAbort?.abort();
  clearTimeout(identityTimeout);
  messages.value = [];
  participants.value = [];
  selfId.value = '';
  unread.value = 0;
  following.value = true;
  draft.value = drafts.get(channel) || '';
  error.value = '';
  status.value = {state: 'connecting'};
  const controller = new AbortController();
  identityAbort = controller;
  identityTimeout = setTimeout(() => controller.abort(), 8000);
  try { await refreshIdentity(controller.signal); } catch { /* Connect using the app's current identity if HTTP is temporarily unavailable. */ }
  if (current !== generation) return;
  clearTimeout(identityTimeout);
  identityAbort = null;
  try {
    connection = createChatConnection({
      url: websocketUrl(props.apiBaseUrl), channel, getUser: () => user.attributes,
      onEvent: receive,
      onStatus: value => {
        status.value = value;
        if (value.state !== 'connected') { participants.value = []; selfId.value = ''; }
      },
    });
    connection.start();
  } catch {
    status.value = {state: 'error'};
    error.value = t('Could not connect to chat. Check the server address.');
  }
}, {immediate: true});
function reconnect() {
  error.value = '';
  connection?.reconnect();
}
function onInput() {
  error.value = '';
  connection?.typing(!!draft.value.trim());
}
function onKeydown(event) {
  if (event.ctrlKey && event.key === 'Enter' && !event.isComposing) {
    event.preventDefault();
    sendMessage();
  }
}
function sendMessage() {
  const text = draft.value.trim();
  if (!text) return;
  if (new TextEncoder().encode(text).length > 16000) {
    error.value = t('Message is too long (maximum 16000 bytes).');
    return;
  }
  if (!connected.value || !connection?.sendMessage(text)) {
    error.value = t('No active connection. Your draft is preserved.');
    return;
  }
  error.value = '';
  draft.value = '';
  drafts.delete(normalizedChannel.value);
  jumpToLatest();
  input.value?.focus();
}
onBeforeUnmount(() => {
  generation++;
  identityAbort?.abort();
  clearTimeout(identityTimeout);
  connection?.stop();
});
</script>
