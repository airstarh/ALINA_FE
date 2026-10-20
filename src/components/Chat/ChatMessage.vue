<template>
  <article class="chat-message" :class="{'chat-message-own': own, 'chat-message-bot': isRobocop, 'chat-message-editing': editing, 'chat-message-edited': edited, 'chat-message-edited-blinking': editedBlinking, 'chat-message-replying': replying}">
    <div class="chat-message-heading">
      <span v-if="isRobocop" class="chat-avatar chat-avatar-robocop chat-message-avatar" aria-hidden="true">🤖</span>
      <img v-else-if="avatar && !avatarFailed" :src="avatar" alt="" class="chat-avatar chat-message-avatar" @error="avatarFailed = true" />
      <span v-else class="chat-avatar chat-avatar-fallback chat-message-avatar" aria-hidden="true">{{ name.slice(0, 1).toUpperCase() }}</span>
      <router-link v-if="profilePath" :to="profilePath" target="_blank" rel="noopener noreferrer" class="chat-message-author"><strong>{{ name }}</strong></router-link>
      <strong v-else>{{ name }}</strong>
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
          <a v-if="part.type === 'image' && !failedMedia[index]" :href="part.url" target="_blank" rel="noopener noreferrer">
            <img :src="part.url" alt="Shared image" loading="lazy" class="chat-shared-image" @load="$emit('media-load')" @error="failedMedia[index] = true; $emit('media-load')" />
          </a>
          <video v-else-if="part.type === 'video' && !failedMedia[index]" :src="part.url" controls playsinline preload="metadata"
                 class="chat-shared-video" @loadedmetadata="$emit('media-load')" @error="failedMedia[index] = true; $emit('media-load')"></video>
          <audio v-else-if="(part.type === 'voice' || part.type === 'audio') && !failedMedia[index]" :src="part.url" controls preload="none"
                 class="chat-shared-audio" @loadedmetadata="$emit('media-load')" @error="failedMedia[index] = true; $emit('media-load')"></audio>
          <a :href="part.url" target="_blank" rel="noopener noreferrer" class="chat-shared-link">{{ part.url }}</a>
          <button type="button" class="chat-copy-button" :title="$t('Copy URL')" :aria-label="$t('Copy URL')" @click="copyUrl(part.url, index)">
            {{ copied === index ? '✓' : '⧉' }}
          </button>
        </span>
      </template>
    </div>
    <footer class="chat-message-footer">
      <button type="button" class="chat-copy-button chat-message-reply" :disabled="replyDisabled"
              :title="$t('Reply')" :aria-label="$t('Reply')" @click="$emit('reply', message)">{{ $t('Reply') }}</button>
      <span class="chat-message-actions">
        <button v-if="canManage" type="button" class="chat-copy-button chat-message-edit"
                :title="$t('Edit message')" :aria-label="$t('Edit message')" @click="$emit('edit', message)">{{ $t('i_edit') }}</button>
        <button v-if="canManage" type="button" class="chat-copy-button chat-message-delete"
                :title="$t('Delete message')" :aria-label="$t('Delete message')" @click="$emit('delete', message)">{{ $t('i_delete') }}</button>
      </span>
    </footer>
  </article>
</template>
<script setup>
import {computed, onBeforeUnmount, reactive, ref} from 'vue';
import {displayName, formatChatTimestamp, messageParts, parseReplyMessage, safeHttpUrl} from './chatProtocol.js';
const props = defineProps({message: {type: Object, required: true}, own: Boolean, canManage: Boolean, editing: Boolean, edited: Boolean, editedBlinking: Boolean, replying: Boolean, replyDisabled: Boolean, baseUrl: {type: String, required: true}});
const emit = defineEmits(['media-load', 'copy-error', 'edit', 'delete', 'reply']);
const avatarFailed = ref(false);
const failedMedia = reactive({});
const copied = ref(null);
let copyTimer;
const name = computed(() => displayName(props.message.CurrentUser, props.message.participantId));
const isRobocop = computed(() => props.message.participantId === 'bot:robocop');
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
