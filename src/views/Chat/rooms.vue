<template>
  <main class="container chat-rooms-page">
    <header class="mb-4">
      <h1 class="mb-3">{{ $t('Chat rooms') }}</h1>
    </header>
    <form v-if="user.attributes.id" class="chat-room-create mb-4" @submit.prevent="createChatRoom">
      <label for="chat-room-create-name" class="form-label">{{ $t('Create my chat:') }}</label>
      <div class="input-group">
        <input id="chat-room-create-name" v-model="newChatName" type="text" class="form-control" maxlength="200" required />
        <button type="submit" class="btn btn-primary" :aria-label="$t('Create my chat:')">→</button>
      </div>
    </form>
    <div class="mb-5">&nbsp;</div>
    <ChatRoomsDirectory />
  </main>
</template>

<script setup>
import {ref} from 'vue';
import { useRouter } from 'vue-router';
import CurrentUser from '@/services/CurrentUser';
import ChatRoomsDirectory from '@/components/Chat/ChatRoomsDirectory.vue';
import { createChatRoomTarget } from '@/components/Chat/chatRoomCreation.js';

const user = CurrentUser.obj();
const router = useRouter();
const newChatName = ref('');

function createChatRoom() {
  const target = createChatRoomTarget(newChatName.value, user.attributes.id);
  if (!target) return;
  newChatName.value = '';
  router.push(target);
}

</script>
<style scoped>
.chat-rooms-page {
  padding: 2px;
}
</style>
