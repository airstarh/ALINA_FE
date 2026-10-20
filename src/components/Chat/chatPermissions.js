export function canManageChat(user) {
  return !!(user?.isAdmin?.() || user?.isModerator?.() || user?.isPrivileged?.());
}

export function canManageMessage(user, message, selfId) {
  if (message?.senderType === 'user_service') {
    const ownsService = ['user', 'guest'].some(type => selfId === `${type}:${message.senderId}`);
    return ownsService || canManageChat(user);
  }
  if (message?.senderType === 'user') {
    return !!user?.ownsOrAdminOrModeratorOrPrivileged?.(message.senderId);
  }
  return (!!selfId && message?.participantId === selfId) || canManageChat(user);
}

export function canRenameGuest(user) {
  return !!user?.isAdmin?.();
}
