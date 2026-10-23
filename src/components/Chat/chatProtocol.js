export function publicChatUser(user = {}) {
  return Object.fromEntries(['id', 'guestId', 'firstname', 'lastname', 'nickname', 'emblem'].map(key => [key, user?.[key] ?? null]));
}

let fallbackMessageSequence = 0;

export function createClientMessageId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  const sequence = (fallbackMessageSequence++).toString(36);
  let random = '';
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    const values = new Uint32Array(4);
    globalThis.crypto.getRandomValues(values);
    random = Array.from(values, value => value.toString(36)).join('');
  } else {
    random = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  }

  return `m-${Date.now().toString(36)}-${sequence}-${random}`.slice(0, 64);
}

export function displayName(user = {}, participantId = '') {
  if (!user?.id) {
    const identifier = user?.guestId || (participantId.startsWith('guest:') ? participantId.slice(6) : '');
    if (identifier) {
      const base = `Guest ${identifier.slice(0, 8)}`;
      const nickname = user?.nickname?.trim() || [user?.firstname, user?.lastname].filter(Boolean).join(' ').trim();
      if (nickname.endsWith(` (${base})`)) return nickname;
      return nickname && nickname !== base ? `${nickname} (${base})` : base;
    }
  }
  return user?.name || user?.nickname || [user?.firstname, user?.lastname].filter(Boolean).join(' ') || 'Guest';
}

function decodeReplyText(value) {
  return String(value)
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&amp;', '&');
}

export function parseReplyMessage(text) {
  const source = String(text || '');
  const match = source.match(/^<div class="reply-quote" data-timestamp="([0-9]+)"><div class="reply-quote-author">([\s\S]*?)<\/div><div class="reply-quote-text">([\s\S]*?)<\/div><\/div>\n([\s\S]*)$/);
  if (!match) return {quote: null, body: source};
  const timestamp = Number(match[1]);
  if (!Number.isSafeInteger(timestamp)) return {quote: null, body: source};
  return {
    quote: {author: decodeReplyText(match[2]), timestamp, text: decodeReplyText(match[3])},
    body: match[4],
  };
}

export function parseMentionNotification(text) {
  const source = String(text || '');
  if (!source.startsWith('MENTION:')) return null;
  try {
    const payload = JSON.parse(decodeURIComponent(source.slice('MENTION:'.length)));
    if (!payload || typeof payload.target !== 'string' || !payload.target.trim()
      || typeof payload.caller !== 'string' || !payload.caller.trim()) return null;
    return {target: payload.target, caller: payload.caller};
  } catch {
    return null;
  }
}

export function formatChatTimestamp(value, now = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = part => String(part).padStart(2, '0');
  const clock = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  const isToday = date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
  return isToday ? clock : `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${clock}`;
}

export function safeHttpUrl(value, baseUrl) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value, baseUrl);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

export function websocketUrl(baseUrl) {
  const url = new URL(baseUrl);
  url.protocol = url.protocol === 'http:' ? 'ws:' : 'wss:';
  url.pathname = '/ws';
  url.search = '';
  url.hash = '';
  return url.href;
}

export function canonicalChatUrl(baseUrl, channel) {
  const origin = new URL(baseUrl).origin;
  return `${origin}/#/chat?channel=${encodeURIComponent(channel)}`;
}

export function videoChatUrl(baseUrl, channel) {
  const url = new URL('/apps/vue3video/call', baseUrl);
  url.searchParams.set('cRoomId', channel);
  return url.href;
}

export function canKickParticipants(currentUser) {
  return currentUser?.isAdmin?.() === true || currentUser?.isModerator?.() === true;
}

export function withoutParticipantMessages(messages, participantId) {
  return messages.filter(message => message?.participantId !== participantId);
}

export function messageParts(text) {
  const source = String(text || '');
  const parts = [];
  // Only complete, line-delimited fences are rendered as code.
  const fences = /^[ \t]*```[^`\r\n]*\r?\n([\s\S]*?)^[ \t]*```[ \t]*(?:\r?\n|$)/gm;
  let cursor = 0;
  for (const match of source.matchAll(fences)) {
    parts.push(...linkedMessageParts(source.slice(cursor, match.index)));
    parts.push({type: 'code', text: match[1]});
    cursor = match.index + match[0].length;
  }
  parts.push(...linkedMessageParts(source.slice(cursor)));
  return parts;
}

function linkedMessageParts(text) {
  const source = String(text || '');
  const voice = source.match(/^VOICE:(https?:\/\/[^\s"'<>()]+)$/i);
  if (voice) {
    const url = safeHttpUrl(voice[1]);
    if (url) return [{type: 'voice', url}];
  }
  const parts = [];
  const pattern = /https?:\/\/[^\s"'<>()]+/gi;
  let cursor = 0;
  for (const match of source.matchAll(pattern)) {
    if (match.index > cursor) parts.push({type: 'text', text: text.slice(cursor, match.index)});
    // Sentence punctuation should remain outside the hyperlink.
    const url = match[0].replace(/[.,!?;:]+$/, '');
    let pathname;
    try { pathname = new URL(url).pathname; } catch {
      parts.push({type: 'text', text: match[0]});
      cursor = match.index + match[0].length;
      continue;
    }
    const type = /\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(pathname) ? 'image'
      : /\.(mp4|webm|mov|avi|m4v)$/i.test(pathname) ? 'video'
      : /\.(mp3|wav|ogg|oga|m4a|aac|flac)$/i.test(pathname) ? 'audio' : 'link';
    parts.push({type, url});
    if (url.length < match[0].length) parts.push({type: 'text', text: match[0].slice(url.length)});
    cursor = match.index + match[0].length;
  }
  if (cursor < source.length) parts.push({type: 'text', text: source.slice(cursor)});
  return parts;
}

// Uploaded paths belong to the sender's website, even when sockets are shared.
export function uploadedFileUrl(path, origin) {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) return '';
  const url = safeHttpUrl(path, origin);
  return url && new URL(url).origin === new URL(origin).origin ? url : '';
}

// Canonical ordering is independent of display names and socket resource IDs.
export function privateChannel(first, second) {
  if (!first || !second || first === second) return '';
  const token = id => {
    if (/^user:[1-9][0-9]*$/.test(id)) return {guest: false, value: id.slice(5)};
    if (/^guest:(?:[0-9a-f]{8}-[0-9a-f-]{27}|[0-9]+)$/.test(id)) return {guest: true, value: id.slice(6)};
    return null;
  };
  const a = token(first), b = token(second);
  if (!a || !b) return '';
  const sorted = [a, b].sort((x, y) => {
    if (x.guest !== y.guest) return x.guest ? 1 : -1;
    if (!x.guest && x.value.length !== y.value.length) return x.value.length - y.value.length;
    return x.value < y.value ? -1 : x.value > y.value ? 1 : 0;
  });
  return sorted.map(x => `${x.guest ? 'guest_' : ''}${x.value}`).join('_');
}

export function privateChat(firstId, firstName, secondId, secondName) {
  const channel = privateChannel(firstId, secondId);
  const names = new Map([[firstId, String(firstName || '').trim()], [secondId, String(secondName || '').trim()]]);
  if (!channel || [...names.values()].some(name => !name)) return null;
  const orderedIds = [firstId, secondId].sort((a, b) => {
    const aGuest = a.startsWith('guest:'), bGuest = b.startsWith('guest:');
    if (aGuest !== bGuest) return aGuest ? 1 : -1;
    const x = a.slice(a.indexOf(':') + 1), y = b.slice(b.indexOf(':') + 1);
    if (!aGuest && x.length !== y.length) return x.length - y.length;
    return x < y ? -1 : x > y ? 1 : 0;
  });
  const name = `PRIVATE: ${names.get(orderedIds[0])} & ${names.get(orderedIds[1])}`;
  return [...name].length <= 200 ? {channel, name} : null;
}
