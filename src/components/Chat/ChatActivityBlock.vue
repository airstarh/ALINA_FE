<template>
  <section class="chat-activity-block" role="group" :aria-label="$t('Activity updates')">
    <header class="chat-activity-summary">
      <span>{{ $t(messages.length === 1 ? '1 activity update' : '{count} activity updates', {count: messages.length}) }}</span>
      <time v-if="latestTime" :datetime="latestTimestamp">{{ latestTime }}</time>
      <button type="button" class="chat-activity-toggle" :aria-expanded="expanded" :aria-controls="rowsId"
              :aria-label="$t(expanded ? 'Collapse activity' : 'Expand activity')" @click="expanded = !expanded">
        {{ expanded ? '−' : '+' }}
      </button>
    </header>
    <div v-if="expanded" :id="rowsId" class="chat-activity-rows">
      <ChatMessage v-for="(message, index) in messages" :key="message.id" :message="message"
                   :first-message="startIndex + index === 0" :discussion-room="discussionRoom"
                   :can-manage="canManageMessage(message)" :base-url="baseUrl"
                   @delete="$emit('delete', $event)" />
    </div>
  </section>
</template>

<script setup>
import {computed, ref, useId} from 'vue';
import ChatMessage from './ChatMessage.vue';
import {formatChatTimestamp} from './chatProtocol.js';

const props = defineProps({
  messages: {type: Array, required: true},
  startIndex: {type: Number, required: true},
  discussionRoom: Boolean,
  baseUrl: {type: String, required: true},
  canManageMessage: {type: Function, required: true},
});
defineEmits(['delete']);
const expanded = ref(false);
const rowsId = `chat-activity-${useId()}`;
const latestTimestamp = computed(() => props.messages.at(-1)?.timestamp || '');
const latestTime = computed(() => latestTimestamp.value ? formatChatTimestamp(latestTimestamp.value) : '');
</script>
