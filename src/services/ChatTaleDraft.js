const STORAGE_KEY = 'alina.chat.tale-draft';
const MAX_AGE_MS = 5 * 60 * 1000;
const ALLOWED_TAGS = new Set([
  'a', 'audio', 'b', 'blockquote', 'br', 'code', 'em', 'figcaption', 'figure',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'i', 'img', 'li', 'ol', 'p', 'pre',
  's', 'source', 'strong', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'u',
  'ul', 'video',
]);
const VOID_TAGS = new Set(['br', 'img', 'source']);

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function safeUrl(value, origin) {
  try {
    const url = new URL(String(value || ''), origin);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function attribute(source, name) {
  const match = source.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return match ? (match[1] ?? match[2] ?? match[3] ?? '') : '';
}

export function sanitizeChatMessageHtml(source, origin) {
  const tokens = String(source ?? '').split(/(<\/?[A-Za-z][^>]*>)/g);
  return tokens.map(token => {
    if (!token.startsWith('<')) return escapeHtml(token);
    const match = token.match(/^<(\/?)\s*([A-Za-z][\w-]*)([\s\S]*?)>$/);
    if (!match) return escapeHtml(token);
    const closing = match[1] === '/';
    const originalTag = match[2].toLowerCase();
    const tag = originalTag === 'div' ? 'p' : originalTag;
    if (!ALLOWED_TAGS.has(tag)) return '';
    if (closing) return VOID_TAGS.has(tag) ? '' : `</${tag}>`;

    const attributes = match[3];
    if (tag === 'a') {
      const href = safeUrl(attribute(attributes, 'href'), origin);
      return href ? `<a href="${escapeHtml(href)}">` : '<a>';
    }
    if (['img', 'video', 'audio', 'source'].includes(tag)) {
      const src = safeUrl(attribute(attributes, 'src'), origin);
      return `<${tag}${src ? ` src="${escapeHtml(src)}"` : ''}>`;
    }
    return `<${tag}>`;
  }).join('');
}

export function buildChatTaleDraft({channel, messageId, authorName, messageHtml, origin}) {
  const sourceUrl = `${String(origin).replace(/\/$/, '')}/#/chat?channel=${encodeURIComponent(channel)}#chat-message-${encodeURIComponent(messageId)}`;
  const safeSourceUrl = safeUrl(sourceUrl, origin);
  return {
    header: `MESSAGE: ${String(authorName || '').trim()}`,
    body: `<p><a href="${escapeHtml(safeSourceUrl)}">Link to message in chat system</a></p>${sanitizeChatMessageHtml(messageHtml, origin)}`,
  };
}

export function storeChatTaleDraft(storage, draft, now = Date.now()) {
  storage.setItem(STORAGE_KEY, JSON.stringify({createdAt: now, draft}));
}

export function consumeChatTaleDraft(storage, now = Date.now()) {
  const raw = storage.getItem(STORAGE_KEY);
  storage.removeItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const payload = JSON.parse(raw);
    if (!payload?.draft || !Number.isFinite(payload.createdAt) || now - payload.createdAt > MAX_AGE_MS) return null;
    return payload.draft;
  } catch {
    return null;
  }
}
