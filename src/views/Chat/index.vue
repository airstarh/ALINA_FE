<template>
  <main class="chat-page"><Chat :channel="channel" /></main>
</template>
<script setup>
import {computed} from 'vue';
import {useRoute} from 'vue-router';
import Chat from '@/components/Chat/index.vue';
const route = useRoute();
const channel = computed(() => typeof route.query.channel === 'string' && route.query.channel.trim() ? route.query.channel.trim() : '1');
</script>
<style scoped>
.chat-page { flex: 1 1 0; min-height: 0; width: 100%; max-width: 1200px; margin: 0 auto; padding: 8px; display: flex; flex-direction: column; }
.chat-page > :deep(.alina-chat) { flex: 1 1 0; }
@media (max-width: 700px) { .chat-page { padding: 0; } }
</style>
