const identityKey = creature => `${creature?.senderType || ''}:${creature?.senderId || ''}`;

export function activeMentionQuery(text, caret) {
  const before = String(text || '').slice(0, caret);
  const match = before.match(/(?:^|[\s\u00a0])@([^@\n]*)$/u);
  if (!match) return null;
  return {start: before.length - match[1].length - 1, query: match[1]};
}

export function filterMentionCandidates(candidates, query, selected = [], self = {}, limit = 5) {
  const needle = String(query || '').toLocaleLowerCase();
  const excluded = new Set([...selected.map(identityKey), identityKey(self)]);
  return candidates.filter(candidate => !excluded.has(identityKey(candidate))
    && String(candidate.senderName || '').toLocaleLowerCase().includes(needle)).slice(0, limit);
}

export function synchronizeSelectedMentions(text, selected = []) {
  const source = String(text || '');
  const seen = new Set();
  return selected.filter(candidate => {
    const key = identityKey(candidate);
    if (seen.has(key) || !source.includes(`@${candidate.senderName}`)) return false;
    seen.add(key);
    return true;
  });
}

export function insertMention(text, range, candidate) {
  const replacement = `@${candidate.senderName} `;
  const updated = String(text || '').slice(0, range.start) + replacement + String(text || '').slice(range.end);
  return {text: updated, caret: range.start + replacement.length, mention: candidate};
}

export function appendMention(text, caret, candidate, selected) {
  const source = String(text ?? '');
  const mentions = synchronizeSelectedMentions(source, selected);
  const key = identityKey(candidate);
  if (mentions.some(item => identityKey(item) === key)) {
    return {text: source, caret, mentions};
  }
  const prefix = caret > 0 && source[caret - 1] !== ' ' ? ' ' : '';
  const prefixed = source.slice(0, caret) + prefix + source.slice(caret);
  const insertionPoint = caret + prefix.length;
  const result = insertMention(prefixed, {start: insertionPoint, end: insertionPoint}, candidate);
  return {text: result.text, caret: result.caret, mentions: [...mentions, candidate]};
}
