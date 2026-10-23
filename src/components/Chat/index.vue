<template>
  <section class="alina-chat" :aria-label="$t('Chat')">
    <header class="chat-header">
      <div class="chat-title">
        <router-link to="/chat/rooms" class="chat-button chat-rooms-back" :title="$t('Chat rooms')" :aria-label="$t('Chat rooms')">←</router-link>
        <span class="chat-connection-status" :class="{'is-connected': connected}" role="status" :title="statusText" :aria-label="statusText">
          <i class="bi" :class="statusIcon" aria-hidden="true"></i>
        </span>
        <label class="chat-sr-only" :for="chatNameId">{{ $t('Chat name') }}</label>
        <input :id="chatNameId" v-model="chatName" class="chat-name-input" maxlength="200" :disabled="!connected || !canManageChatRoom"
               :aria-label="$t('Chat name')" @keydown.enter.prevent="saveChatName" @blur="saveChatName" />
        <button v-if="canManageChatRoom" type="button" class="chat-button chat-anonymous-control"
                :class="chatState.isAnionAllowed ? 'is-allowed' : 'is-denied'"
                :aria-pressed="chatState.isAnionAllowed" :disabled="!connected"
                @click="setAnonymousAllowed(!chatState.isAnionAllowed)">ANON</button>
        <button v-if="canManageChatRoom" type="button" class="chat-button chat-confirmation-control"
                :class="chatState.isConfirmationRequired ? 'is-closed' : 'is-opened'"
                :aria-pressed="chatState.isConfirmationRequired" :disabled="!connected"
                @click="setConfirmationRequired(!chatState.isConfirmationRequired)">
          {{ $t(chatState.isConfirmationRequired ? 'i_lock' : 'i_open') }}
        </button>
      </div>
      <div class="chat-header-actions">
        <button type="button" class="chat-button chat-people-toggle" :aria-expanded="peopleOpen" :aria-controls="peopleId" @click="toggleSidebar('people')">
          {{ $t('i_people') }} ({{ participants.length }})
        </button>
        <input v-if="!user.attributes.id" class="chat-guest-nickname" :value="guestNickname" maxlength="25"
               :placeholder="$t('Your nickname')" :aria-label="$t('Your nickname')" @input="changeGuestNickname" />
        <router-link v-if="!user.attributes.id" to="/auth/register" class="chat-button chat-register">{{ $t('SignUp') }}</router-link>
        <button type="button" class="chat-button chat-copy-link" :title="$t('Copy chat link')" :aria-label="$t('Copy chat link')" @click="copyChatLink">
          <i class="bi bi-link-45deg" aria-hidden="true"></i>
        </button>
        <a :href="videoChatHref" class="chat-button chat-video-link" :title="$t('Open video chat')" :aria-label="$t('Open video chat')">
          <i class="bi bi-camera-video" aria-hidden="true"></i>
        </a>
        <button type="button" class="chat-button" :title="$t('Reconnect')" :aria-label="$t('Reconnect')" @click="reconnect">↻</button>
        <button v-if="canKick" type="button" class="chat-button chat-delete-room" :title="$t('Delete chat')" :aria-label="$t('Delete chat')" @click="deleteCurrentChat">X</button>
        <button type="button" class="chat-button chat-page-toggle"
                :title="$t(pageSettings.showMainMenu ? 'Hide menu and footer' : 'Show menu and footer')"
                :aria-label="$t(pageSettings.showMainMenu ? 'Hide menu and footer' : 'Show menu and footer')"
                :aria-pressed="!pageSettings.showMainMenu"
                @click="pageSettings.showMainMenu = !pageSettings.showMainMenu">
          <i class="bi" :class="pageSettings.showMainMenu ? 'bi-fullscreen' : 'bi-fullscreen-exit'" aria-hidden="true"></i>
        </button>
        <button type="button" class="chat-button chat-rooms-toggle" :title="$t('Chat rooms')" :aria-label="$t('Chat rooms')"
                :aria-expanded="roomsOpen" :aria-controls="roomsId" @click="toggleSidebar('rooms')">
          <i class="bi bi-chat-square-text" aria-hidden="true"></i>
        </button>
      </div>
    </header>
    <p v-if="feedback" class="chat-feedback" role="status">{{ feedback }}</p>
    <p v-if="status.state === 'pending'" class="chat-pending" role="status">{{ $t('Waiting for a participant to approve your request.') }}</p>
    <div class="chat-layout" :class="{'chat-people-open': peopleOpen, 'chat-rooms-open': roomsOpen}">
      <ChatParticipants :id="peopleId" :participants="participants" :self-id="selfId" :self-user="chatUser()" :base-url="apiBaseUrl" :connected="connected"
                        :can-kick="canKick" :join-requests="joinRequests" @approve="approveParticipant" @kick="kickParticipant" />
      <div class="chat-conversation">
        <div ref="messageList" class="chat-messages" role="log" :aria-label="$t('Messages')" aria-live="polite" aria-relevant="additions" @scroll="trackScroll">
          <p v-if="!messages.length" class="chat-empty">{{ connected ? $t('No messages yet. Start the conversation.') : $t('Connecting to chat…') }}</p>
          <ChatMessage v-for="(message, messageIndex) in messages" :key="message.id" :message="message" :first-message="messageIndex === 0" :discussion-room="!!chatState.discussionOfMessageId" :own="isOwn(message)"
                       :can-manage="canManageMessage(message)" :editing="editingMessageId === message.id"
                       :can-tag="canTagMessage(message)" :private-href="privateMessageHref(message)" :can-rename-guest="canRenameGuestAuthor(message)"
                       :edited="editedMessageIds.has(message.id)" :edited-blinking="blinkingMessageIds.has(message.id)" :base-url="apiBaseUrl"
                       :replying="replyingMessageId === message.id" :reply-disabled="!!editingMessageId"
                       @reply="toggleReplyMessage" @discuss="discussMessage" @edit="startEditingMessage" @delete="deleteMessage" @tag="tagMessageAuthor" @rename-guest="renameGuestAuthor" @open-private="openPrivateMessage"
                       @media-load="scrollIfFollowing" @copy-error="error = $t('Could not copy the URL. Please copy the link manually.')" />
        </div>
        <button v-if="unread" type="button" class="chat-new-messages" @click="jumpToLatest">{{ $t('New messages') }} ({{ unread }}) ↓</button>
        <p v-if="typingNames" class="chat-typing-summary" role="status">{{ typingNames }} — {{ $t('Typing…') }}</p>
        <p v-if="error" class="chat-error" role="alert">{{ error }} <button type="button" :aria-label="$t('Dismiss')" @click="error = ''">×</button></p>
        <form class="chat-composer" @submit.prevent="sendMessage">
          <div v-if="mentionSuggestions.length" class="chat-mention-selector" role="listbox" :aria-label="$t('Mention a creature')">
            <button v-for="(candidate, index) in mentionSuggestions" :key="`${candidate.senderType}:${candidate.senderId}`" type="button"
                    class="chat-mention-option" :class="{'is-active': index === mentionOptionIndex}" role="option"
                    @mousedown.prevent="selectMention(candidate)">{{ candidate.senderName }}</button>
          </div>
          <label class="chat-sr-only" :for="inputId">{{ $t('Message') }}</label>
          <textarea :id="inputId" ref="input" v-model="draft" class="chat-composer-input" :placeholder="$t('Type a message…')" rows="2" maxlength="16000" :disabled="!connected"
                    @input="onInput" @click="updateMentionQuery" @keyup="updateMentionQuery" @keydown="onKeydown" @blur="connection?.typing(false)"></textarea>
          <input ref="fileInput" type="file" multiple class="chat-sr-only" :aria-label="$t('Attach files')" :disabled="uploading || !user.attributes.id || !connected" @change="uploadFiles" />
          <button type="button" class="chat-button chat-attach" :title="$t(user.attributes.id ? 'Attach files' : 'Sign in to upload files')"
                  :aria-label="$t('Attach files')" :disabled="uploading || recordingVoice || processingVoice || !user.attributes.id || !connected" @click="fileInput?.click()">
            <i class="bi bi-paperclip" aria-hidden="true"></i>
          </button>
          <button type="button" class="chat-button chat-voice me-1" :class="{'is-recording': recordingVoice}"
                  :title="$t(recordingVoice ? 'Stop and send voice recording' : 'Start voice recording')"
                  :aria-label="$t(recordingVoice ? 'Stop and send voice recording' : 'Start voice recording')"
                  :aria-pressed="recordingVoice"
                  :disabled="processingVoice || (!recordingVoice && (uploading || !user.attributes.id || !connected))"
                  @click="toggleVoiceRecording">{{ $t(recordingVoice ? 'i_mic_off' : 'i_mic') }}</button>
          <button v-if="editingMessageId" type="button" class="chat-button chat-edit-cancel"
                  :title="$t('Cancel editing')" :aria-label="$t('Cancel editing')" @click="cancelEditingMessage">{{ $t('i_cancel') }}</button>
          <small v-if="recordingVoice" class="chat-composer-hint" role="status">{{ $t('Recording voice… Press again to send.') }}</small>
          <small v-else-if="uploading" class="chat-composer-hint" role="status">{{ $t('Uploading files…') }}</small>
          <button type="submit" class="chat-send" :disabled="uploading || recordingVoice || processingVoice || !connected || !draft.trim()">{{ $t('i_save') }}</button>
          <small class="chat-composer-hint">{{ $t('Ctrl+Enter to send · Enter for a new line') }}</small>
        </form>
      </div>
      <aside :id="roomsId" class="chat-rooms-drawer">
        <ChatRoomsDirectory :api-base-url="apiBaseUrl" :current-channel="normalizedChannel" compact />
      </aside>
    </div>
  </section>
</template>
<script setup>
import {computed, nextTick, onBeforeUnmount, reactive, ref, useId, watch} from 'vue';
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {guestNickname as storedGuestNickname, saveGuestNickname, guestNicknameStorageKey} from '@/services/GuestIdentity';
import CurrentUser from '@/services/CurrentUser';
import ConfigApi from '@/configs/ConfigApi';
import AjaxAlina from '@/services/AjaxAlina';
import PageSettings from '@/services/PageSettings';
import ChatMessage from './ChatMessage.vue';
import ChatParticipants from './ChatParticipants.vue';
import ChatRoomsDirectory from './ChatRoomsDirectory.vue';
import {createChatConnection} from './chatConnection.js';
import {nextChatSidebar} from './chatSidebar.js';
import {createVoiceRecorder} from './chatVoiceRecorder.js';
import {activeMentionQuery, appendMention, filterMentionCandidates, insertMention, synchronizeSelectedMentions} from './chatMentions.js';
import {canManageChat, canManageMessage as mayManageMessage, canRenameGuest} from './chatPermissions.js';
import {acceptGuestRename, refreshChatIdentity, watchChatIdentity} from './chatIdentity.js';
import {
  canKickParticipants,
  canonicalChatUrl,
  displayName,
  parseReplyMessage,
  privateChat,
  uploadedFileUrl,
  videoChatUrl,
  websocketUrl,
  withoutParticipantMessages,
} from './chatProtocol.js';
import './chat.css';

const props = defineProps({channel: {type: String, default: '1'}, title: {type: String, default: ''}, initialChatName: {type: String, default: ''}, apiBaseUrl: {type: String, default: () => ConfigApi.url_base}});
const {t} = useI18n();
const router = useRouter();
const pageSettings = reactive(PageSettings);
const previousShowMainMenu = pageSettings.showMainMenu;
pageSettings.showMainMenu = false;
const inputId = `chat-input-${useId()}`;
const chatNameId = `chat-name-${useId()}`;
const peopleId = `chat-people-${useId()}`;
const roomsId = `chat-rooms-${useId()}`;
const normalizedChannel = computed(() => props.channel.trim() || '1');
const videoChatHref = computed(() => videoChatUrl(window.location.origin, normalizedChannel.value));
const messages = ref([]);
const participants = ref([]);
const selfId = ref('');
const draft = ref('');
const editingMessageId = ref('');
const replyingMessageId = ref('');
const editedMessageIds = reactive(new Set());
const blinkingMessageIds = reactive(new Set());
const error = ref('');
const feedback = ref('');
const openSidebar = ref('');
const peopleOpen = computed(() => openSidebar.value === 'people');
const roomsOpen = computed(() => openSidebar.value === 'rooms');
const status = ref({state: 'connecting'});
const admitted = ref(false);
const connected = computed(() => admitted.value);
const messageList = ref(null);
const input = ref(null);
const fileInput = ref(null);
const uploading = ref(false);
const recordingVoice = ref(false);
const processingVoice = ref(false);
const mentionCandidates = ref([]);
const listTaggedUsers = ref([]);
const mentionQuery = ref(null);
const mentionOptionIndex = ref(0);
const following = ref(true);
const unread = ref(0);
const user = CurrentUser.obj();
const stopIdentityWatch = watchChatIdentity(user, () => connection?.updateUser());
const canKick = computed(() => canKickParticipants(user));
const canManageChatRoom = computed(() => canManageChat(user));
const chatState = ref({name: props.title || normalizedChannel.value, isAnionAllowed: true, isConfirmationRequired: false});
const chatName = ref(chatState.value.name);
const joinRequests = ref([]);
let pendingChatName = '';
let requestedChatNameApplied = false;
const pendingDiscussionRequests = new Set();
const guestNickname = ref(storedGuestNickname());
let nicknameTimer;
let mentionSearchTimer;
function toggleSidebar(requested) {
  openSidebar.value = nextChatSidebar(openSidebar.value, requested);
}
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
const voiceRecorder = createVoiceRecorder({
  onState: state => {
    recordingVoice.value = state === 'recording';
    processingVoice.value = state === 'processing';
  },
  onComplete: file => sendVoiceFile(file),
  onError: cause => {
    if (cause?.message === 'unsupported') error.value = t('Voice recording is not supported by this browser.');
    else if (cause?.message === 'empty') error.value = t('Voice recording was empty.');
    else if (cause?.name === 'NotAllowedError' || cause?.name === 'SecurityError') error.value = t('Microphone access was denied.');
    else error.value = t('Could not record voice message.');
  },
});
const statusText = computed(() => {
  if (status.value.state === 'connected') return t("i_ok");
  if (status.value.state === 'joining') return t('Joining chat…');
  if (status.value.state === 'pending') return t('Approval required');
  if (status.value.state === 'kicked') return t('Removed from chat');
  if (status.value.state === 'reconnecting') return `${t('i_reconnect')} ${Math.ceil(status.value.delay / 1000)}s`;
  if (status.value.state === 'error') return t('i_fail');
  return t('...');
});
const statusIcon = computed(() => {
  if (status.value.state === 'connected') return 'bi-check-circle-fill';
  if (status.value.state === 'pending') return 'bi-hourglass-split';
  if (status.value.state === 'reconnecting') return 'bi-arrow-repeat';
  if (['error', 'kicked'].includes(status.value.state)) return 'bi-exclamation-triangle-fill';
  return 'bi-circle';
});
const typingNames = computed(() => participants.value.filter(person => person.typing && person.id !== selfId.value).map(person => displayName(person.user, person.id)).join(', '));
const mentionSelf = computed(() => {
  const [senderType = '', ...id] = selfId.value.split(':');
  return {senderType, senderId: id.join(':')};
});
const mentionSuggestions = computed(() => mentionQuery.value
  ? filterMentionCandidates(mentionCandidates.value, mentionQuery.value.query, listTaggedUsers.value, mentionSelf.value, 5)
  : []);
function isOwn(message) {
  return !!selfId.value && message.participantId === selfId.value;
}
function canManageMessage(message) {
  return mayManageMessage(user, message, selfId.value);
}
function canTagMessage(message) {
  return !['bot', 'user_service'].includes(message.senderType) && !isOwn(message);
}
function privateMessageHref(message) {
  if (['bot', 'user_service'].includes(message.senderType)) return '';
  const target = privateMessageTarget(message);
  return target ? router.resolve({path: '/chat', query: {channel: target.channel}}).href : '';
}
function privateMessageTarget(message) {
  return privateChat(selfId.value, displayName(chatUser(), selfId.value), message.participantId, displayName(message.CurrentUser, message.participantId));
}
function openPrivateMessage(message) {
  const target = privateMessageTarget(message);
  if (target) router.push({path: '/chat', query: {channel: target.channel}, state: {privateChatChannel: target.channel, privateChatName: target.name}});
}
function canRenameGuestAuthor(message) {
  return message.senderType === 'guest' && canRenameGuest(user);
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
function markMessageEdited(messageId) {
  editedMessageIds.add(messageId);
  blinkingMessageIds.delete(messageId);
  nextTick(() => blinkingMessageIds.add(messageId));
}
function clearMissingReplySelection() {
  if (replyingMessageId.value && !messages.value.some(message => message.id === replyingMessageId.value)) {
    replyingMessageId.value = '';
  }
}
function receive(event) {
  if (event.type === 'history' && Array.isArray(event.messages)) {
    messages.value = event.messages;
    clearMissingReplySelection();
    unread.value = 0;
    following.value = true;
    scrollIfFollowing();
  } else if (event.type === 'message' && event.message?.id) {
    if (messages.value.some(message => message.id === event.message.id)) return;
    messages.value.push(event.message);
    // Bound DOM growth during long-lived sessions.
    if (messages.value.length > 500) {
      messages.value.shift();
      clearMissingReplySelection();
    }
    if (!following.value) unread.value++;
    scrollIfFollowing();
  } else if (event.type === 'message_edited' && event.message?.id) {
    const index = messages.value.findIndex(message => message.id === event.message.id);
    if (index !== -1) {
      messages.value[index] = event.message;
      markMessageEdited(event.message.id);
    }
  } else if (event.type === 'message_deleted' && event.messageId) {
    messages.value = messages.value.filter(message => message.id !== event.messageId);
    editedMessageIds.delete(event.messageId);
    blinkingMessageIds.delete(event.messageId);
    if (editingMessageId.value === event.messageId) editingMessageId.value = '';
    if (replyingMessageId.value === event.messageId) replyingMessageId.value = '';
  } else if (event.type === 'discussion_ready' && event.sourceMessageId && event.discussion) {
    const index = messages.value.findIndex(message => message.id === event.sourceMessageId);
    if (index !== -1) messages.value[index] = {...messages.value[index], discussion: event.discussion};
    if (pendingDiscussionRequests.delete(event.sourceMessageId)) router.push({path: '/chat', query: {channel: event.discussion.channel}});
  } else if (event.type === 'chat_deleted') {
    router.push('/chat/rooms');
  } else if (event.type === 'discussion_removed' && event.sourceMessageId) {
    const index = messages.value.findIndex(message => message.id === event.sourceMessageId);
    if (index !== -1) messages.value[index] = {...messages.value[index], discussion: null};
  } else if (event.type === 'presence' && Array.isArray(event.participants)) {
    selfId.value = event.selfId;
    participants.value = event.participants;
  } else if (event.type === 'guest_renamed' && event.participantId && event.guestId) {
    const renamedSelf = acceptGuestRename(event, selfId.value, saveGuestNickname);
    if (renamedSelf !== null) guestNickname.value = renamedSelf;
    messages.value = messages.value.map(message => message.participantId === event.participantId || (message.senderType === 'user_service' && message.senderId === event.guestId)
      ? {...message, CurrentUser: {...message.CurrentUser, guestId: event.guestId, nickname: event.nickname, name: event.name}}
      : message);
    participants.value = participants.value.map(person => person.id === event.participantId
      ? {...person, user: {...person.user, guestId: event.guestId, nickname: event.nickname, name: event.name}}
      : person);
    mentionCandidates.value = mentionCandidates.value.map(candidate => candidate.senderType === 'guest' && candidate.senderId === event.guestId
      ? {...candidate, senderName: event.name}
      : candidate);
  } else if (event.type === 'chat_state' && event.chat?.name) {
    chatState.value = event.chat;
    chatName.value = event.chat.name;
    const requestedName = props.title.trim();
    if (!requestedChatNameApplied && user.attributes.id && requestedName && [...requestedName].length <= 200 && event.chat.name === normalizedChannel.value) {
      requestedChatNameApplied = true;
      if (connection?.renameChat(requestedName)) {
        chatName.value = requestedName;
        pendingChatName = requestedName;
        feedback.value = t('Saving chat name…');
      }
    }
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
    clearMissingReplySelection();
    participants.value = participants.value.filter(person => person.id !== event.participantId);
    joinRequests.value = joinRequests.value.filter(request => request.id !== event.participantId);
    scrollIfFollowing();
  } else if (event.type === 'error') {
    pendingDiscussionRequests.clear();
    error.value = event.error || t('Could not send the message.');
  } else if (['mentions_directory', 'mentions_search'].includes(event.type) && Array.isArray(event.candidates)) {
    const merged = new Map(mentionCandidates.value.map(candidate => [`${candidate.senderType}:${candidate.senderId}`, candidate]));
    event.candidates.forEach(candidate => merged.set(`${candidate.senderType}:${candidate.senderId}`, candidate));
    mentionCandidates.value = [...merged.values()].sort((a, b) => b.latestActivityAt - a.latestActivityAt).slice(0, 1000);
  }
}
watch([normalizedChannel, () => props.apiBaseUrl], async ([channel], previous) => {
  cancelVoiceRecording();
  const current = ++generation;
  if (previous) drafts.set(previous[0], draft.value);
  connection?.stop();
  connection = null;
  identityAbort?.abort();
  clearTimeout(identityTimeout);
  messages.value = [];
  editingMessageId.value = '';
  replyingMessageId.value = '';
  mentionCandidates.value = [];
  listTaggedUsers.value = [];
  mentionQuery.value = null;
  editedMessageIds.clear();
  blinkingMessageIds.clear();
  participants.value = [];
  joinRequests.value = [];
  selfId.value = '';
  admitted.value = false;
  unread.value = 0;
  following.value = true;
  draft.value = drafts.get(channel) || '';
  error.value = '';
  feedback.value = '';
  openSidebar.value = '';
  pendingChatName = '';
  requestedChatNameApplied = false;
  chatState.value = {name: props.title || channel, isAnionAllowed: true, isConfirmationRequired: false};
  chatName.value = chatState.value.name;
  status.value = {state: 'connecting'};
  const controller = new AbortController();
  identityAbort = controller;
  identityTimeout = setTimeout(() => controller.abort(), 8000);
  try { await refreshChatIdentity(user, props.apiBaseUrl, controller.signal); } catch { /* Connect using the app's current identity if HTTP is temporarily unavailable. */ }
  if (current !== generation) return;
  clearTimeout(identityTimeout);
  identityAbort = null;
  try {
    connection = createChatConnection({
      url: websocketUrl(props.apiBaseUrl), channel, chatName: props.initialChatName, getUser: chatUser,
      onEvent: receive,
      onStatus: value => {
        status.value = value;
        if (value.state === 'connected') { admitted.value = true; connection?.loadMentionDirectory(); }
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
function setAnonymousAllowed(allowed) {
  if (!connected.value || !connection?.setAnonymousAllowed(allowed)) {
    error.value = t('Could not save anonymous access. Reconnect and try again.');
    return;
  }
  error.value = '';
}
function setConfirmationRequired(required) {
  if (!connected.value || !connection?.setConfirmationRequired(required)) {
    error.value = t('Could not save confirmation policy. Reconnect and try again.');
    return;
  }
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
function deleteCurrentChat() {
  if (window.confirm(`${t('Delete chat')} “${chatName.value}”?`)) connection?.deleteChat();
}
function discussMessage(message) {
  if (!connected.value || !connection?.discussMessage(message.id)) {
    pendingDiscussionRequests.delete(message.id);
    error.value = t('Could not open discussion. Reconnect and try again.');
    return;
  }
  pendingDiscussionRequests.add(message.id);
}
function onInput() {
  error.value = '';
  listTaggedUsers.value = synchronizeSelectedMentions(draft.value, listTaggedUsers.value);
  updateMentionQuery();
  if (connected.value) connection?.typing(!!draft.value.trim());
}
function onKeydown(event) {
  if (mentionSuggestions.value.length && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault();
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    mentionOptionIndex.value = (mentionOptionIndex.value + direction + mentionSuggestions.value.length) % mentionSuggestions.value.length;
    return;
  }
  if (mentionSuggestions.value.length && event.key === 'Enter' && !event.ctrlKey) {
    event.preventDefault();
    selectMention(mentionSuggestions.value[mentionOptionIndex.value]);
    return;
  }
  if (event.ctrlKey && event.key === 'Enter' && !event.isComposing) {
    event.preventDefault();
    sendMessage();
  }
}
function updateMentionQuery() {
  mentionQuery.value = activeMentionQuery(draft.value, input.value?.selectionStart ?? draft.value.length);
  mentionOptionIndex.value = 0;
  clearTimeout(mentionSearchTimer);
  if (mentionQuery.value && mentionQuery.value.query.length >= 3 && mentionSuggestions.value.length === 0) {
    const query = mentionQuery.value.query;
    mentionSearchTimer = setTimeout(() => connection?.searchMentions(query), 250);
  }
}
function selectMention(candidate) {
  if (!candidate || listTaggedUsers.value.length >= 22) {
    if (listTaggedUsers.value.length >= 22) error.value = t('A message may mention at most 22 creatures.');
    return;
  }
  const end = input.value?.selectionStart ?? draft.value.length;
  const result = insertMention(draft.value, {start: mentionQuery.value.start, end}, candidate);
  draft.value = result.text;
  listTaggedUsers.value = [...listTaggedUsers.value, result.mention];
  mentionQuery.value = null;
  nextTick(() => { input.value?.focus(); input.value?.setSelectionRange(result.caret, result.caret); });
}
function tagMessageAuthor(message) {
  if (!canTagMessage(message) || listTaggedUsers.value.length >= 22) {
    if (listTaggedUsers.value.length >= 22) error.value = t('A message may mention at most 22 creatures.');
    return;
  }
  const candidate = {
    senderType: message.senderType,
    senderId: String(message.senderId),
    senderName: displayName(message.CurrentUser, message.participantId),
    senderEmblem: message.CurrentUser?.emblem || '',
  };
  const caret = input.value?.selectionStart ?? draft.value.length;
  const result = appendMention(draft.value, caret, candidate, listTaggedUsers.value);
  draft.value = result.text;
  listTaggedUsers.value = result.mentions;
  mentionQuery.value = null;
  nextTick(() => { input.value?.focus(); input.value?.setSelectionRange(result.caret, result.caret); });
}
function renameGuestAuthor(message, nickname) {
  if (!canRenameGuestAuthor(message) || !connection?.renameGuest(message.senderId, nickname)) {
    error.value = t('Could not rename the guest. Reconnect and try again.');
  }
}
async function uploadChatFiles(files) {
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
  return links;
}
async function uploadFiles(event) {
  const files = event.target.files;
  if (!files?.length || uploading.value || recordingVoice.value || processingVoice.value || !connected.value) return;
  const channel = normalizedChannel.value;
  const current = generation;
  uploading.value = true;
  error.value = '';
  try {
    const links = await uploadChatFiles(files);
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
async function sendVoiceFile(file) {
  const current = generation;
  uploading.value = true;
  error.value = '';
  try {
    const [url] = await uploadChatFiles([file]);
    if (current !== generation) return;
    if (!connected.value || !connection?.sendMessage(`VOICE:${url}`)) {
      error.value = t('Could not send voice message.');
    } else {
      jumpToLatest();
    }
  } catch {
    if (current === generation) error.value = t('Could not upload voice message. Please try again.');
  } finally {
    if (current === generation) uploading.value = false;
  }
}
async function toggleVoiceRecording() {
  error.value = '';
  if (recordingVoice.value) {
    voiceRecorder.stop();
    return;
  }
  if (uploading.value || processingVoice.value || !user.attributes.id || !connected.value) return;
  await voiceRecorder.start();
}
function cancelVoiceRecording() {
  voiceRecorder.cancel();
}
function sendMessage() {
  if (uploading.value || recordingVoice.value || processingVoice.value) return;
  const text = draft.value.trim();
  if (!text) return;
  if (new TextEncoder().encode(text).length > 16000) {
    error.value = t('Message is too long (maximum 16000 bytes).');
    return;
  }
  listTaggedUsers.value = synchronizeSelectedMentions(draft.value, listTaggedUsers.value).slice(0, 22);
  const sent = editingMessageId.value
    ? connection?.editMessage(editingMessageId.value, text)
    : replyingMessageId.value
      ? connection?.replyMessage(replyingMessageId.value, text)
      : connection?.sendMessage(text, listTaggedUsers.value.map(({senderType, senderId}) => ({senderType, senderId})));
  if (!connected.value || !sent) {
    error.value = t('No active connection. Your draft is preserved.');
    return;
  }
  error.value = '';
  draft.value = '';
  editingMessageId.value = '';
  replyingMessageId.value = '';
  listTaggedUsers.value = [];
  mentionQuery.value = null;
  drafts.delete(normalizedChannel.value);
  jumpToLatest();
  input.value?.focus();
}
function startEditingMessage(message) {
  replyingMessageId.value = '';
  editingMessageId.value = message.id;
  draft.value = parseReplyMessage(message.msg).body;
  error.value = '';
  nextTick(() => input.value?.focus());
}
function toggleReplyMessage(message) {
  if (editingMessageId.value) return;
  replyingMessageId.value = replyingMessageId.value === message.id ? '' : message.id;
  input.value?.focus();
}
function cancelEditingMessage() {
  editingMessageId.value = '';
  input.value?.focus();
}
function deleteMessage(message) {
  if (!window.confirm(t('Delete this message?'))) return;
  if (!connected.value || !connection?.deleteMessage(message.id)) {
    error.value = t('No active connection. Your draft is preserved.');
  }
}
onBeforeUnmount(() => {
  cancelVoiceRecording();
  stopIdentityWatch();
  window.removeEventListener('storage', syncGuestNickname);
  clearTimeout(nicknameTimer);
  clearTimeout(mentionSearchTimer);
  pageSettings.showMainMenu = previousShowMainMenu;
  generation++;
  identityAbort?.abort();
  clearTimeout(identityTimeout);
  connection?.stop();
});
</script>
