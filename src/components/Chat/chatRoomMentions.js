const storageKey = 'alina.chat.roomMentionAcknowledgements.v1';

export function isRoomMentionUnread(room, seenAt = 0) {
  const latestMentionAt = Number(room?.latestMentionAt || 0);
  return !!room?.isMentioned && latestMentionAt > Number(seenAt || 0);
}

export function loadRoomMentionAcknowledgements(storage) {
  try {
    const value = JSON.parse(storage?.getItem(storageKey) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

export function acknowledgeRoomMention(acknowledgements, room, storage) {
  const latestMentionAt = Number(room?.latestMentionAt || 0);
  if (!room?.channel || latestMentionAt <= Number(acknowledgements[room.channel] || 0)) return acknowledgements;
  const updated = {...acknowledgements, [room.channel]: latestMentionAt};
  try { storage?.setItem(storageKey, JSON.stringify(updated)); } catch { /* Session storage may be unavailable. */ }
  return updated;
}
