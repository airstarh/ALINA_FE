export function publicChatUser(user = {}) {
  return Object.fromEntries(['id', 'guestId', 'firstname', 'lastname', 'nickname', 'emblem'].map(key => [key, user?.[key] ?? null]));
}

export function displayName(user = {}, participantId = '') {
  if (!user?.id) {
    const identifier = user?.guestId || (participantId.startsWith('guest:') ? participantId.slice(6) : '');
    if (identifier) {
      const base = `Guest ${identifier.slice(0, 8)}`;
      const nickname = user?.nickname?.trim() || [user?.firstname, user?.lastname].filter(Boolean).join(' ').trim();
      return nickname && nickname !== base ? `${nickname} (${base})` : base;
    }
  }
  return user?.name || user?.nickname || [user?.firstname, user?.lastname].filter(Boolean).join(' ') || 'Guest';
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
  const parts = [];
  const pattern = /https?:\/\/[^\s"'<>()]+/gi;
  let cursor = 0;
  for (const match of String(text || '').matchAll(pattern)) {
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
  if (cursor < String(text || '').length) parts.push({type: 'text', text: text.slice(cursor)});
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
