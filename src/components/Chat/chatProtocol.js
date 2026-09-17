export function publicChatUser(user = {}) {
  return Object.fromEntries(['id', 'firstname', 'lastname', 'nickname', 'emblem'].map(key => [key, user?.[key] ?? null]));
}

export function displayName(user = {}) {
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
