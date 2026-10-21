<template>
  <main class="chat-page"><Chat :channel="channel" :title="title" /></main>
</template>
<script setup>
import {computed} from 'vue';
import {useRoute} from 'vue-router';
import Chat from '@/components/Chat/index.vue';
const route = useRoute();
const channel = computed(() => typeof route.query.channel === 'string' && route.query.channel.trim() ? route.query.channel.trim() : '1');
const title = computed(() => typeof route.query.name === 'string' && [...route.query.name.trim()].length <= 200 ? route.query.name.trim() : '');
</script>
<style scoped>
.chat-page { flex: 1 1 0; min-height: 0; width: 100%; max-width: 1200px; margin: 0 auto; padding: 2px; display: flex; flex-direction: column; }
.chat-page > :deep(.alina-chat) { flex: 1 1 0; }
</style>
