import {createClientMessageId} from './chatProtocol.js';

export function createChatRoomTarget(name, userId, generatedId = createClientMessageId()) {
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedUserId = Number(userId);
  if (!Number.isSafeInteger(normalizedUserId) || normalizedUserId < 1) return null;
  if (!normalizedName || [...normalizedName].length > 200) return null;
  return {
    path: '/chat',
    query: {
      channel: `room_${normalizedUserId}_${generatedId}`,
      name: normalizedName,
    },
  };
}
