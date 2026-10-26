<template>
  <aside class="chat-participants" aria-label="Chat participants">
    <div class="chat-sidebar-title">
      <h2>{{ $t('People') }}</h2><span>{{ displayedParticipants.length }}</span>
    </div>
    <label class="chat-sr-only" :for="searchId">{{ $t('Search users') }}</label>
    <input :id="searchId" v-model="searchQuery" type="search" class="chat-participant-search"
           :placeholder="$t('Search users')" maxlength="200" @input="$emit('search', searchQuery)" />
    <p v-if="!connected" class="chat-muted">{{ $t('Waiting for connection…') }}</p>
    <p v-else-if="!searchActive && !participants.length" class="chat-muted">{{ $t('Loading participants…') }}</p>
    <section v-if="connected && joinRequests.length" class="chat-join-requests" :aria-label="$t('Join requests')">
      <h3>{{ $t('Join requests') }}</h3>
      <ul>
        <li v-for="request in joinRequests" :key="request.id">
          <span>{{ displayName(request.user, request.id) }}</span>
          <button type="button" class="chat-button chat-approve" @click="$emit('approve', request.id)">{{ $t('Approve') }}</button>
        </li>
      </ul>
    </section>
    <ul class="chat-people-list">
      <li v-for="person in displayedParticipants" :key="person.id" class="chat-person">
        <div class="chat-person-main">
          <component :is="privateHref(person) ? 'a' : 'span'" :href="privateHref(person) || undefined"
                     :title="privateHref(person) ? $t('Open a separate chat') : undefined"
                     :aria-label="privateHref(person) ? `${$t('Open a separate chat')}: ${displayName(person.user, person.id)}` : undefined"
                     class="chat-person-avatar-link" @click.prevent="openPrivate(person)">
            <img v-if="avatar(person.user) && !failedAvatars[person.id]" :src="avatar(person.user)"
                 alt="" class="chat-avatar" @error="failedAvatars[person.id] = true" />
            <span v-else class="chat-avatar chat-avatar-fallback" aria-hidden="true">{{ displayName(person.user, person.id).slice(0, 1).toUpperCase() }}</span>
          </component>
          <div class="chat-person-details">
            <router-link v-if="person.user?.id" :to="`/auth/profile/${person.user.id}`" class="chat-person-name chat-person-profile">
              {{ displayName(person.user, person.id) }} <small v-if="person.id === selfId">({{ $t('you') }})</small>
            </router-link>
            <span v-else class="chat-person-name">{{ displayName(person.user, person.id) }} <small v-if="person.id === selfId">({{ $t('you') }})</small></span>
            <span class="chat-person-status" :class="{'is-typing': person.typing}">
              <span class="chat-online-dot" :class="{'is-online': person.online}" aria-hidden="true"></span>{{ person.typing ? $t('Typing…') : person.inChat ? $t('In chat') : $t('Not in chat') }}
            </span>
            <div v-if="person.id !== selfId" class="chat-person-actions">
              <button type="button" class="chat-button chat-person-tag"
                      :title="$t('Mention a creature')" :aria-label="`${$t('Mention a creature')}: ${displayName(person.user, person.id)}`"
                      @click="$emit('tag', person)">{{ $t('i_tag') }}</button>
              <button type="button" class="chat-button chat-person-private"
                      :title="$t('Open a separate chat')" :aria-label="`${$t('Open a separate chat')}: ${displayName(person.user, person.id)}`"
                      @click="openPrivate(person)">{{ $t('i_private') }}</button>
              <button v-if="canKick" type="button" class="chat-button chat-kick"
                      :title="$t('Remove from chat')" :aria-label="`${$t('Remove from chat')}: ${displayName(person.user, person.id)}`"
                      @click="$emit('kick', person.id)">×</button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </aside>
</template>
<script setup>
import {computed, reactive, ref, useId} from 'vue';
import {useRouter} from 'vue-router';
import {displayName, privateChat, prioritizeSelfParticipant, safeHttpUrl} from './chatProtocol.js';
const props = defineProps({
  participants: {type: Array, default: () => []},
  joinRequests: {type: Array, default: () => []},
  selfId: {type: String, default: ''},
  selfUser: {type: Object, default: () => ({})},
  baseUrl: {type: String, required: true},
  connected: Boolean,
  canKick: Boolean,
  searchResults: {type: Array, default: () => []},
  searchActive: Boolean,
});
defineEmits(['approve', 'kick', 'tag', 'search']);
const router = useRouter();
const orderedParticipants = computed(() => prioritizeSelfParticipant(props.participants, props.selfId));
const displayedParticipants = computed(() => props.searchActive ? props.searchResults : orderedParticipants.value);
const searchQuery = ref('');
const searchId = `chat-participant-search-${useId()}`;
function privateHref(person) {
  const target = privateTarget(person);
  return target ? router.resolve({path: '/chat', query: {channel: target.channel}}).href : '';
}
function privateTarget(person) {
  return privateChat(props.selfId, displayName(props.selfUser, props.selfId), person.id, displayName(person.user, person.id));
}
function openPrivate(person) {
  const target = privateTarget(person);
  if (target) router.push({path: '/chat', query: {channel: target.channel}, state: {privateChatChannel: target.channel, privateChatName: target.name}});
}
const failedAvatars = reactive({});
const avatar = user => safeHttpUrl(user?.emblem, props.baseUrl);
</script>
<style scoped>
.chat-person-profile {
  color: inherit;
  font-weight: bold;
  text-decoration: none;
}
</style>
