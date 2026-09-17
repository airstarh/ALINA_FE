<template>
  <aside class="chat-participants" aria-label="Chat participants">
    <div class="chat-sidebar-title">
      <h2>{{ $t('People') }}</h2><span>{{ participants.length }}</span>
    </div>
    <p v-if="!connected" class="chat-muted">{{ $t('Waiting for connection…') }}</p>
    <p v-else-if="!participants.length" class="chat-muted">{{ $t('Loading participants…') }}</p>
    <ul class="chat-people-list">
      <li v-for="person in participants" :key="person.id" class="chat-person">
        <component :is="privateHref(person) ? 'a' : 'span'" :href="privateHref(person) || undefined"
                   :title="privateHref(person) ? $t('Open a separate chat') : undefined"
                   :aria-label="privateHref(person) ? `${$t('Open a separate chat')}: ${displayName(person.user, person.id)}` : undefined"
                   target="_blank" rel="noopener noreferrer" style="display: inline-flex; flex: 0 0 40px;">
        <img v-if="avatar(person.user) && !failedAvatars[person.id]" :src="avatar(person.user)"
             alt="" class="chat-avatar" @error="failedAvatars[person.id] = true" />
        <span v-else class="chat-avatar chat-avatar-fallback" aria-hidden="true">{{ displayName(person.user, person.id).slice(0, 1).toUpperCase() }}</span>
        </component>
        <div class="chat-person-details">
          <span class="chat-person-name">{{ displayName(person.user, person.id) }} <small v-if="person.id === selfId">({{ $t('you') }})</small></span>
          <span class="chat-person-status" :class="{'is-typing': person.typing}">
            <span class="chat-online-dot" aria-hidden="true"></span>{{ person.typing ? $t('Typing…') : $t('Online') }}
          </span>
        </div>
      </li>
    </ul>
  </aside>
</template>
<script setup>
import {reactive} from 'vue';
import {useRouter} from 'vue-router';
import {displayName, privateChannel, safeHttpUrl} from './chatProtocol.js';
const props = defineProps({participants: {type: Array, default: () => []}, selfId: {type: String, default: ''}, baseUrl: {type: String, required: true}, connected: Boolean});
const router = useRouter();
function privateHref(person) {
  const channel = privateChannel(props.selfId, person.id);
  return channel ? router.resolve({path: '/chat', query: {channel}}).href : '';
}
const failedAvatars = reactive({});
const avatar = user => safeHttpUrl(user?.emblem, props.baseUrl);
</script>
