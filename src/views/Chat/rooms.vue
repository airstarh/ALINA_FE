<template>
  <main class="container chat-rooms-page">
    <header class="mb-4">
      <h1 class="mb-3">{{ $t('Chat rooms') }}</h1>
    </header>
    <ChatRoomCreateForm class="mb-4" />
    <div class="mb-5">&nbsp;</div>
    <ChatRoomsDirectory />
  </main>
</template>

<script setup>
import ChatRoomsDirectory from '@/components/Chat/ChatRoomsDirectory.vue';
import ChatRoomCreateForm from '@/components/Chat/ChatRoomCreateForm.vue';

</script>
<style scoped>
.chat-rooms-page {
  padding: 2px;
}
</style>
