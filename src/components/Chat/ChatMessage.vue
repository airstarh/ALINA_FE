<template>
  <article v-if="isUserService" class="chat-message chat-message-service">
    <div class="chat-service-heading"><time :datetime="message.timestamp" :title="fullTime">{{ time }}</time></div>
    <div v-if="mentionNotification" class="chat-message-body">
      <strong class="chat-mention-target">{{ mentionNotification.target }}!!!</strong>
      {{ mentionNotification.caller }} {{ $t('calls you!') }}
    </div>
    <div v-else class="chat-message-body">{{ message.msg }}</div>
    <footer v-if="canManage" class="chat-message-footer chat-service-footer">
      <span></span><button type="button" class="chat-copy-button chat-message-delete" :title="$t('Delete message')" :aria-label="$t('Delete message')" @click="$emit('delete', message)">{{ $t('i_delete') }}</button>
    </footer>
  </article>
  <article v-else class="chat-message" :class="{'chat-message-own': own, 'chat-message-bot': isRobocop, 'chat-message-editing': editing, 'chat-message-edited': edited, 'chat-message-edited-blinking': editedBlinking, 'chat-message-replying': replying}">
    <div class="chat-message-heading">
      <span v-if="isRobocop" class="chat-avatar chat-avatar-robocop chat-message-avatar" aria-hidden="true">🤖</span>
      <img v-else-if="avatar && !avatarFailed" :src="avatar" alt="" class="chat-avatar chat-message-avatar" @error="avatarFailed = true" />
      <span v-else class="chat-avatar chat-avatar-fallback chat-message-avatar" aria-hidden="true">{{ name.slice(0, 1).toUpperCase() }}</span>
      <input v-if="canRenameGuest" class="chat-guest-nickname chat-message-guest-name" :value="guestNickname" maxlength="25"
             :aria-label="$t('Your nickname')" @blur="renameGuest" @keydown.enter.prevent="$event.target.blur()" />
      <router-link v-else-if="profilePath" :to="profilePath" class="chat-message-author"><strong>{{ name }}</strong></router-link>
      <strong v-else>{{ name }}</strong>
      <button v-if="canTag" type="button" class="chat-copy-button chat-message-tag" :disabled="replyDisabled"
              :title="$t('Mention a creature')" :aria-label="$t('Mention a creature')" @click="$emit('tag', message)">{{ $t('i_tag') }}</button>
      <a v-if="privateHref" :href="privateHref" class="chat-copy-button chat-message-private"
         :title="$t('Open a separate chat')" :aria-label="$t('Open a separate chat')">{{ $t('i_private') }}</a>
      <time :datetime="message.timestamp" :title="fullTime">{{ time }}</time>
    </div>
    <div v-if="parsed.quote" class="reply-quote">
      <div class="reply-quote-heading"><strong>{{ parsed.quote.author }}</strong><time>{{ formatChatTimestamp(parsed.quote.timestamp) }}</time></div>
      <div class="reply-quote-text">{{ parsed.quote.text }}</div>
    </div>
    <div class="chat-message-body">
      <template v-for="(part, index) in parts" :key="index">
        <span v-if="part.type === 'text'">{{ part.text }}</span>
        <pre v-else-if="part.type === 'code'"><code>{{ part.text }}</code></pre>
        <span v-else class="chat-message-link-block">
          <button v-if="part.type === 'image' && !failedMedia[index]" type="button" class="chat-media-popup" @click="openPopup(part)">
            <img :src="part.url" alt="Shared image" loading="lazy" class="chat-shared-image" @load="$emit('media-load')" @error="failedMedia[index] = true; $emit('media-load')" />
          </button>
          <video v-else-if="part.type === 'video' && !failedMedia[index]" :src="part.url" controls playsinline preload="metadata"
                 class="chat-shared-video" @loadedmetadata="$emit('media-load')" @error="failedMedia[index] = true; $emit('media-load')"></video>
          <audio v-else-if="(part.type === 'voice' || part.type === 'audio') && !failedMedia[index]" :src="part.url" controls preload="none"
                 class="chat-shared-audio" @loadedmetadata="$emit('media-load')" @error="failedMedia[index] = true; $emit('media-load')"></audio>
          <span class="chat-message-link-actions">
            <a v-if="part.type === 'link'" class="chat-shared-window" :href="part.url" target="_blank" rel="noopener noreferrer"
               :title="$t('Open in new window')" :aria-label="$t('Open in new window')">{{ $t('i_window') }}</a>
            <button type="button" class="chat-shared-link" @click="openPopup(part)">{{ part.url }}</button>
            <button type="button" class="chat-copy-button" :title="$t('Copy URL')" :aria-label="$t('Copy URL')" @click="copyUrl(part.url, index)">
              {{ copied === index ? '✓' : $t('i_copy') }}
            </button>
          </span>
        </span>
      </template>
    </div>
    <footer class="chat-message-footer">
      <span class="chat-message-secondary-actions">
        <button type="button" class="chat-copy-button chat-message-reply" :disabled="replyDisabled"
                :title="$t('Reply')" :aria-label="$t('Reply')" @click="$emit('reply', message)">{{ $t('Reply') }}</button>
        <a v-if="message.discussion" :href="discussionHref"
           class="chat-copy-button chat-message-discussion is-active">{{ $t('...in discussion') }} ({{ discussionResponseCount }})</a>
        <button v-else-if="!firstMessage" type="button" class="chat-copy-button chat-message-discussion"
                @click="$emit('discuss', message)">{{ $t('Discuss') }}</button>
      </span>
      <span class="chat-message-actions">
        <button v-if="canManage" type="button" class="chat-copy-button chat-message-edit"
                :title="$t('Edit message')" :aria-label="$t('Edit message')" @click="$emit('edit', message)">{{ $t('i_edit') }}</button>
        <button v-if="canManage && !message.discussion && !(discussionRoom && firstMessage)" type="button" class="chat-copy-button chat-message-delete"
                :title="$t('Delete message')" :aria-label="$t('Delete message')" @click="$emit('delete', message)">{{ $t('i_delete') }}</button>
      </span>
    </footer>
  </article>
</template>
<script setup>
import {computed, onBeforeUnmount, reactive, ref} from 'vue';
import {displayName, formatChatTimestamp, messageParts, parseMentionNotification, parseReplyMessage, safeHttpUrl} from './chatProtocol.js';
import PopupObj from '@/services/PopupObj';
import UtilsFS from '@/Utils/UtilsFS';
const props = defineProps({message: {type: Object, required: true}, firstMessage: Boolean, discussionRoom: Boolean, own: Boolean, canManage: Boolean, canTag: Boolean, canRenameGuest: Boolean, privateHref: {type: String, default: ''}, editing: Boolean, edited: Boolean, editedBlinking: Boolean, replying: Boolean, replyDisabled: Boolean, baseUrl: {type: String, required: true}});
const emit = defineEmits(['media-load', 'copy-error', 'edit', 'delete', 'reply', 'discuss', 'tag', 'rename-guest']);
const avatarFailed = ref(false);
const failedMedia = reactive({});
const copied = ref(null);
let copyTimer;
const name = computed(() => displayName(props.message.CurrentUser, props.message.participantId));
const guestNickname = computed(() => String(props.message.CurrentUser?.nickname || name.value).replace(/ \(Guest [^)]+\)$/, ''));
const isRobocop = computed(() => props.message.participantId === 'bot:robocop');
const isUserService = computed(() => props.message.senderType === 'user_service');
const mentionNotification = computed(() => isUserService.value ? parseMentionNotification(props.message.msg) : null);
const profilePath = computed(() => {
  const authorId = Number(props.message.CurrentUser?.id);
  return !isRobocop.value && Number.isInteger(authorId) && authorId > 0 ? `/auth/profile/${authorId}` : '';
});
const avatar = computed(() => safeHttpUrl(props.message.CurrentUser?.emblem, props.baseUrl));
const parsed = computed(() => parseReplyMessage(props.message.msg));
const parts = computed(() => messageParts(parsed.value.body));
const date = computed(() => new Date(props.message.timestamp));
const pad = value => String(value).padStart(2, '0');
const fullTime = computed(() => Number.isNaN(date.value.getTime())
  ? ''
  : `${date.value.getFullYear()}-${pad(date.value.getMonth() + 1)}-${pad(date.value.getDate())} ${pad(date.value.getHours())}:${pad(date.value.getMinutes())}`);
const time = computed(() => formatChatTimestamp(date.value));
const discussionResponseCount = computed(() => Number(props.message.discussion?.responseCount || 0));
const discussionChannel = computed(() => props.message.discussion?.channel || `discussion_${props.message.id}`);
const discussionHref = computed(() => `${window.location.origin}/#/chat?channel=${encodeURIComponent(discussionChannel.value)}`);
function renameGuest(event) {
  const nickname = event.target.value.trim();
  event.target.value = guestNickname.value;
  if (nickname && nickname !== guestNickname.value) emit('rename-guest', props.message, nickname);
}
function openPopup(part) {
  const types = {image: UtilsFS.typeImage, video: UtilsFS.typeVideo, voice: UtilsFS.typeAudio, audio: UtilsFS.typeAudio, link: UtilsFS.typeWeb};
  PopupObj.item.id = null;
  PopupObj.item.url = part.url;
  PopupObj.item.title = part.url;
  PopupObj.item.type = types[part.type] || UtilsFS.typeWeb;
  PopupObj.isOn = true;
}
async function copyUrl(url, index) {
  try {
    await navigator.clipboard.writeText(url);
    copied.value = index;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copied.value = null; }, 2000);
  } catch {
    emit('copy-error');
  }
}
onBeforeUnmount(() => clearTimeout(copyTimer));
</script>
