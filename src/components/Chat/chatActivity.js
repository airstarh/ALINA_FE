export function groupChatTimeline(messages) {
  const entries = [];
  messages.forEach((message, index) => {
    if (message.senderType !== 'user_service') {
      entries.push({type: 'message', key: `message-${message.id}`, message, index});
      return;
    }
    const previous = entries[entries.length - 1];
    if (previous?.type === 'activity') {
      previous.messages.push(message);
      return;
    }
    entries.push({type: 'activity', key: `activity-${message.id}`, messages: [message], startIndex: index});
  });
  return entries;
}
