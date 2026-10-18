import {watch} from 'vue';
import {publicChatUser} from './chatProtocol.js';

export function watchChatIdentity(user, synchronize) {
  return watch(
    () => publicChatUser(user.attributes),
    identity => synchronize(identity),
    {deep: true},
  );
}
