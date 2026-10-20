import {watch} from 'vue';
import {publicChatUser} from './chatProtocol.js';

export async function refreshChatIdentity(user, apiBaseUrl, signal) {
  const url = new URL('/root/status', apiBaseUrl);
  url.searchParams.set('isAjax', '1');
  const headers = {
    'x-requested-with': 'AlinaFetchApi',
    fgp: globalThis.navigator?.userAgent || '',
  };
  if (user.attributes.id && user.attributes.token) {
    headers.uid = String(user.attributes.id);
    headers.token = user.attributes.token;
  }
  const response = await fetch(url, {credentials: 'include', headers, signal});
  if (!response.ok) throw new Error('Identity refresh failed');
  const body = await response.json();
  if (body.CurrentUser) user.applyAttributes(body.CurrentUser);
}

export function watchChatIdentity(user, synchronize) {
  return watch(
    () => publicChatUser(user.attributes),
    identity => synchronize(identity),
    {deep: true},
  );
}

export function acceptGuestRename(event, selfId, saveNickname) {
  if (!selfId?.startsWith('guest:') || event?.participantId !== selfId || typeof event.nickname !== 'string') return null;
  return saveNickname(event.nickname);
}
