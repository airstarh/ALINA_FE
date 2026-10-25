<template>
  <b-modal v-model="open" class="chat-reaction-modal" :title="$t('Reactions')" :ok-only="true" size="sm">
    <table class="chat-reaction-table">
      <thead><tr><th>+</th><th>−</th></tr></thead>
      <tbody>
        <tr><td><div v-for="person in positive" :key="`${person.senderType}:${person.senderId}`">{{ person.name }}</div><span v-if="!positive.length">—</span></td>
            <td><div v-for="person in negative" :key="`${person.senderType}:${person.senderId}`">{{ person.name }}</div><span v-if="!negative.length">—</span></td></tr>
      </tbody>
    </table>
  </b-modal>
</template>
<script setup>
defineProps({positive: {type: Array, default: () => []}, negative: {type: Array, default: () => []}});
const open = defineModel({type: Boolean, default: false});
</script>
