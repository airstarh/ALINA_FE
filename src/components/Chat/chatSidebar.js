export function nextChatSidebar(current, requested) {
  return current === requested ? '' : requested;
}
