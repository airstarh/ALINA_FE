<template>
  <section class="alina-chat" :aria-label="$t('Chat')">
    <header class="chat-header">
      <div class="chat-title">
        <span class="chat-connection-status" :class="{'text-success': connected}" role="status">{{ statusText }}</span>
        <label class="chat-sr-only" :for="chatNameId">{{ $t('Chat name') }}</label>
        <input :id="chatNameId" v-model="chatName" class="chat-name-input" maxlength="200" :disabled="!connected"
               :aria-label="$t('Chat name')" @keydown.enter.prevent="saveChatName" @blur="saveChatName" />
        <span class="channel-name">{{ normalizedChannel }}</span>
      </div>
      <div class="chat-header-actions">
        <input v-if="!user.attributes.id" class="chat-guest-nickname" :value="guestNickname" maxlength="25"
               :placeholder="$t('Your nickname')" :aria-label="$t('Your nickname')" @input="changeGuestNickname" />
        <button type="button" class="chat-button chat-copy-link" :title="$t('Copy chat link')" :aria-label="$t('Copy chat link')" @click="copyChatLink">
          <i class="bi bi-link-45deg" aria-hidden="true"></i>
        </button>
        <button type="button" class="chat-button chat-video-link" :title="$t('Open video chat')" :aria-label="$t('Open video chat')" @click="openVideoChat">
          <i class="bi bi-camera-video" aria-hidden="true"></i>
        </button>
        <button type="button" class="chat-button chat-people-toggle" :aria-expanded="peopleOpen" :aria-controls="peopleId" @click="peopleOpen = !peopleOpen">
          {{ $t('i_people') }} ({{ participants.length }})
        </button>
        <button type="button" class="chat-button" :title="$t('Reconnect')" :aria-label="$t('Reconnect')" @click="reconnect">↻</button>
        <button type="button" class="chat-button chat-page-toggle"
                :title="$t(pageSettings.showMainMenu ? 'Hide menu and footer' : 'Show menu and footer')"
                :aria-label="$t(pageSettings.showMainMenu ? 'Hide menu and footer' : 'Show menu and footer')"
                :aria-pressed="!pageSettings.showMainMenu"
                @click="pageSettings.showMainMenu = !pageSettings.showMainMenu">
          <i class="bi" :class="pageSettings.showMainMenu ? 'bi-fullscreen' : 'bi-fullscreen-exit'" aria-hidden="true"></i>
        </button>
      </div>
    </header>
    <p v-if="feedback" class="chat-feedback" role="status">{{ feedback }}</p>
    <p v-if="status.state === 'pending'" class="chat-pending" role="status">{{ $t('Waiting for a participant to approve your request.') }}</p>
    <div class="chat-layout" :class="{'chat-people-open': peopleOpen}">
      <ChatParticipants :id="peopleId" :participants="participants" :self-id="selfId" :base-url="apiBaseUrl" :connected="connected"
                        :can-kick="canKick" :join-requests="joinRequests" @approve="approveParticipant" @kick="kickParticipant" />
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
          <textarea :id="inputId" ref="input" v-model="draft" class="chat-composer-input" :placeholder="$t('Type a message…')" rows="2" maxlength="16000" :disabled="!connected"
                    @input="onInput" @keydown="onKeydown" @blur="connection?.typing(false)"></textarea>
          <input ref="fileInput" type="file" multiple class="chat-sr-only" :aria-label="$t('Attach files')" :disabled="uploading || !user.attributes.id || !connected" @change="uploadFiles" />
          <button type="button" class="chat-button chat-attach" :title="$t(user.attributes.id ? 'Attach files' : 'Sign in to upload files')"
                  :aria-label="$t('Attach files')" :disabled="uploading || !user.attributes.id || !connected" @click="fileInput?.click()">
            <i class="bi bi-paperclip" aria-hidden="true"></i>
          </button>
          <small v-if="uploading" class="chat-composer-hint" role="status">{{ $t('Uploading files…') }}</small>
          <button type="submit" class="chat-send" :disabled="uploading || !connected || !draft.trim()">{{ $t('Send') }}</button>
          <small class="chat-composer-hint">{{ $t('Ctrl+Enter to send · Enter for a new line') }}</small>
        </form>
      </div>
    </div>
  </section>
</template>
<script setup>
import {computed, nextTick, onBeforeUnmount, reactive, ref, useId, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {guestNickname as storedGuestNickname, saveGuestNickname, guestNicknameStorageKey} from '@/services/GuestIdentity';
import CurrentUser from '@/services/CurrentUser';
import ConfigApi from '@/configs/ConfigApi';
import AjaxAlina from '@/services/AjaxAlina';
import PageSettings from '@/services/PageSettings';
import ChatMessage from './ChatMessage.vue';
import ChatParticipants from './ChatParticipants.vue';
import {createChatConnection} from './chatConnection.js';
import {
  canKickParticipants,
  canonicalChatUrl,
  displayName,
  uploadedFileUrl,
  videoChatUrl,
  websocketUrl,
  withoutParticipantMessages,
} from './chatProtocol.js';
import './chat.css';

const props = defineProps({channel: {type: String, default: '1'}, title: {type: String, default: ''}, apiBaseUrl: {type: String, default: () => ConfigApi.url_base}});
const {t} = useI18n();
const pageSettings = reactive(PageSettings);
const previousShowMainMenu = pageSettings.showMainMenu;
pageSettings.showMainMenu = false;
const inputId = `chat-input-${useId()}`;
const chatNameId = `chat-name-${useId()}`;
const peopleId = `chat-people-${useId()}`;
const normalizedChannel = computed(() => props.channel.trim() || '1');
const messages = ref([]);
const participants = ref([]);
const selfId = ref('');
const draft = ref('');
const error = ref('');
const feedback = ref('');
const peopleOpen = ref(false);
const status = ref({state: 'connecting'});
const admitted = ref(false);
const connected = computed(() => admitted.value);
const messageList = ref(null);
const input = ref(null);
const fileInput = ref(null);
const uploading = ref(false);
const following = ref(true);
const unread = ref(0);
const user = CurrentUser.obj();
const canKick = computed(() => canKickParticipants(user));
const chatState = ref({name: props.title || normalizedChannel.value, isAnionAllowed: true, isConfirmationRequired: false});
const chatName = ref(chatState.value.name);
const joinRequests = ref([]);
let pendingChatName = '';
const guestNickname = ref(storedGuestNickname());
let nicknameTimer;
function chatUser() {
  return user.attributes.id ? user.attributes : {...user.attributes, firstname: '', lastname: '', nickname: guestNickname.value.trim()};
}
function changeGuestNickname(event) {
  guestNickname.value = saveGuestNickname(event.target.value);
  event.target.value = guestNickname.value;
  clearTimeout(nicknameTimer);
  nicknameTimer = setTimeout(() => connection?.updateUser(), 400);
}
function syncGuestNickname(event) {
  if (event.key !== guestNicknameStorageKey || user.attributes.id) return;
  guestNickname.value = storedGuestNickname();
  connection?.updateUser();
}
window.addEventListener('storage', syncGuestNickname);
const drafts = new Map();
let connection = null;
let generation = 0;
let identityAbort = null;
let identityTimeout = null;
const statusText = computed(() => {
  if (status.value.state === 'connected') return t("i_ok");
  if (status.value.state === 'joining') return t('Joining chat…');
  if (status.value.state === 'pending') return t('Approval required');
  if (status.value.state === 'kicked') return t('Removed from chat');
  if (status.value.state === 'reconnecting') return `${t('i_reconnect')} ${Math.ceil(status.value.delay / 1000)}s`;
  if (status.value.state === 'error') return t('i_fail');
  return t('...');
});
const typingNames = computed(() => participants.value.filter(person => person.typing && person.id !== selfId.value).map(person => displayName(person.user, person.id)).join(', '));
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
  } else if (event.type === 'chat_state' && event.chat?.name) {
    chatState.value = event.chat;
    chatName.value = event.chat.name;
    if (pendingChatName === event.chat.name) {
      feedback.value = t('Chat name saved.');
      pendingChatName = '';
    }
  } else if (event.type === 'join_request' && event.participant?.id) {
    const index = joinRequests.value.findIndex(request => request.id === event.participant.id);
    if (index === -1) joinRequests.value.push(event.participant);
    else joinRequests.value[index] = event.participant;
  } else if (event.type === 'participant_kicked' && event.participantId) {
    messages.value = withoutParticipantMessages(messages.value, event.participantId);
    if (event.message?.id && !messages.value.some(message => message.id === event.message.id)) messages.value.push(event.message);
    participants.value = participants.value.filter(person => person.id !== event.participantId);
    joinRequests.value = joinRequests.value.filter(request => request.id !== event.participantId);
    scrollIfFollowing();
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
  joinRequests.value = [];
  selfId.value = '';
  admitted.value = false;
  unread.value = 0;
  following.value = true;
  draft.value = drafts.get(channel) || '';
  error.value = '';
  feedback.value = '';
  pendingChatName = '';
  chatState.value = {name: props.title || channel, isAnionAllowed: true, isConfirmationRequired: false};
  chatName.value = chatState.value.name;
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
      url: websocketUrl(props.apiBaseUrl), channel, getUser: chatUser,
      onEvent: receive,
      onStatus: value => {
        status.value = value;
        if (value.state === 'connected') admitted.value = true;
        if (['connecting', 'joining', 'pending', 'kicked', 'reconnecting'].includes(value.state)) admitted.value = false;
        if (!admitted.value) { participants.value = []; selfId.value = ''; }
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
  feedback.value = '';
  connection?.reconnect();
}
async function copyChatLink() {
  try {
    await navigator.clipboard.writeText(canonicalChatUrl(window.location.origin, normalizedChannel.value));
    feedback.value = t('Chat link copied.');
    error.value = '';
  } catch {
    error.value = t('Could not copy the chat link. Please copy it from the address bar.');
  }
}
function openVideoChat() {
  window.open(videoChatUrl(window.location.origin, normalizedChannel.value), '_blank', 'noopener,noreferrer');
}
function saveChatName() {
  const name = chatName.value.trim();
  chatName.value = name;
  if (!name || [...name].length > 200) {
    error.value = t('Chat name must contain 1–200 characters.');
    return;
  }
  if (name === chatState.value.name) return;
  if (!connected.value || !connection?.renameChat(name)) {
    error.value = t('Could not save the chat name. Reconnect and try again.');
    return;
  }
  pendingChatName = name;
  feedback.value = t('Saving chat name…');
  error.value = '';
}
function approveParticipant(participantId) {
  if (!connected.value || !connection?.approve(participantId)) {
    error.value = t('Could not approve the participant. Reconnect and try again.');
    return;
  }
  joinRequests.value = joinRequests.value.filter(request => request.id !== participantId);
}
function kickParticipant(participantId) {
  if (!connected.value || !connection?.kick(participantId)) {
    error.value = t('Could not remove the participant. Reconnect and try again.');
  }
}
function onInput() {
  error.value = '';
  if (connected.value) connection?.typing(!!draft.value.trim());
}
function onKeydown(event) {
  if (event.ctrlKey && event.key === 'Enter' && !event.isComposing) {
    event.preventDefault();
    sendMessage();
  }
}
async function uploadFiles(event) {
  const files = event.target.files;
  if (!files?.length || uploading.value || !connected.value) return;
  const channel = normalizedChannel.value;
  const current = generation;
  uploading.value = true;
  error.value = '';
  try {
    const ajax = await AjaxAlina.newInst({
      method: 'POST', url: new URL('/FileUpload', props.apiBaseUrl).href,
      enctype: 'multipart/form-data',
      postParams: {
        entity_id: user.attributes.id, entity_table: 'user', container: 'FILE',
        root_id: null, parent_id: null, level: 1, order: 0,
        form_id: 'actionIndex', userfile: files,
      },
    }).go();
    const data = ajax?.respBody?.data;
    const links = (Array.isArray(data) ? data : Object.values(data || {}))
      .map(file => uploadedFileUrl(file.url_path, window.location.origin)).filter(Boolean);
    if (!links.length) throw new Error('No uploaded files');
    const existing = current === generation ? draft.value : drafts.get(channel) || '';
    const updated = [existing.trimEnd(), ...links].filter(Boolean).join('\n');
    if (current === generation) {
      draft.value = updated;
      input.value?.focus();
    } else {
      drafts.set(channel, updated);
    }
  } catch {
    if (current === generation) error.value = t('Could not upload files. Please try again.');
  } finally {
    uploading.value = false;
    if (fileInput.value) fileInput.value.value = '';
  }
}
function sendMessage() {
  if (uploading.value) return;
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
  window.removeEventListener('storage', syncGuestNickname);
  clearTimeout(nicknameTimer);
  pageSettings.showMainMenu = previousShowMainMenu;
  generation++;
  identityAbort?.abort();
  clearTimeout(identityTimeout);
  connection?.stop();
});
</script>
