<template>
  <form v-if="user.attributes.id" class="chat-room-create" :class="{'is-compact': compact}" @submit.prevent="createChatRoom">
    <label :for="inputId" :class="compact ? 'visually-hidden' : 'form-label'">{{ $t('Create my chat:') }}</label>
    <div class="input-group">
      <span class="input-group-text" aria-hidden="true"><i class="bi bi-chat-square-text"></i></span>
      <input :id="inputId" v-model="newChatName" type="text" class="form-control" maxlength="200" required
             :placeholder="$t('Create my chat:')" :aria-label="$t('Create my chat:')" />
      <button type="submit" class="btn btn-primary" :aria-label="$t('Create my chat:')">→</button>
    </div>
  </form>
</template>
<script setup>
import {ref, useId} from 'vue';
import {useRouter} from 'vue-router';
import CurrentUser from '@/services/CurrentUser';
import {createChatRoomTarget} from './chatRoomCreation.js';

defineProps({compact: Boolean});
const user = CurrentUser.obj();
const router = useRouter();
const inputId = `chat-room-create-${useId()}`;
const newChatName = ref('');

function createChatRoom() {
  const target = createChatRoomTarget(newChatName.value, user.attributes.id);
  if (!target) return;
  newChatName.value = '';
  router.push(target);
}
</script>
<style scoped>
.chat-room-create.is-compact { margin: 0 0 14px; }
.chat-room-create.is-compact .input-group { flex-wrap: nowrap; }
.chat-room-create.is-compact .input-group-text { padding: 5px 7px; color: #a8b7c9; background: #151c27; border-color: #53637a; }
.chat-room-create.is-compact .form-control { min-width: 0; padding: 5px 7px; color: #edf2f8; background: #080b10; border-color: #53637a; }
.chat-room-create.is-compact .form-control::placeholder { color: #8fa0b5; }
.chat-room-create.is-compact .btn { padding: 5px 9px; }
</style>
