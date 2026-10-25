export function prependOlderMessages(current, older) {
  const known = new Set(current.map(message => String(message.id)));
  return [...older.filter(message => message?.id && !known.has(String(message.id))), ...current];
}

export function preservedScrollTop(previousTop, previousHeight, nextHeight) {
  return Math.max(0, previousTop + nextHeight - previousHeight);
}
