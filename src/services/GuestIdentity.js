const idKey = 'alina.chat.guestId';
const nicknameKey = 'alina.chat.guestNickname';
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
let sessionId;
function createGuestId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  // getRandomValues is available on HTTP as well as HTTPS.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
export function guestId() {
  if (sessionId) return sessionId;
  let stored;
  try { stored = localStorage.getItem(idKey); } catch { /* Use an in-memory identity when storage is blocked. */ }
  sessionId = uuidPattern.test(stored || '') ? stored.toLowerCase() : createGuestId();
  try { localStorage.setItem(idKey, sessionId); } catch { /* Still usable for this page session. */ }
  return sessionId;
}
export function defaultGuestName(id = guestId()) { return `Guest ${id.slice(0, 8)}`; }
export function guestNickname() {
  let stored;
  try { stored = localStorage.getItem(nicknameKey); } catch { /* Storage may be unavailable. */ }
  return stored ? Array.from(stored).slice(0, 25).join('') : defaultGuestName();
}
export function saveGuestNickname(value) {
  const nickname = Array.from(value).slice(0, 25).join('');
  try { localStorage.setItem(nicknameKey, nickname); } catch { /* Retain the field value in Vue state. */ }
  return nickname;
}
export const guestNicknameStorageKey = nicknameKey;
