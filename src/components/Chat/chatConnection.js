import {createClientMessageId, publicChatUser} from './chatProtocol.js';

// Framework-independent transport. All timers and handlers belong to this instance.
export function createChatConnection({url, channel, chatName = '', getUser, onEvent, onStatus, WebSocketClass = WebSocket}) {
  let socket = null;
  let retryTimer = null;
  let typingTimer = null;
  let stopped = true;
  let attempts = 0;
  let lastTypingAt = 0;
  let historyRequests = [];
  let selfParticipantId = '';
  let kicked = false;
  const failedMessageIds = new Map();

  function status(state, extra = {}) {
    onStatus({state, ...extra});
  }

  function send(payload) {
    if (stopped || socket?.readyState !== WebSocketClass.OPEN) return false;
    try {
      socket.send(JSON.stringify({version: 2, channel, ...payload}));
      return true;
    } catch {
      status('error', {error: 'Unable to send. Your draft is preserved.'});
      return false;
    }
  }

  function retry() {
    if (stopped || retryTimer !== null) return;
    const delay = Math.min(11000 * 2 ** Math.min(attempts++, 3), 60000);
    status('reconnecting', {delay, attempt: attempts});
    retryTimer = setTimeout(() => {
      retryTimer = null;
      connect();
    }, delay);
  }

  function connect() {
    if (stopped) return;
    status('connecting');
    let active;
    try {
      active = new WebSocketClass(url);
      socket = active;
    } catch {
      retry();
      return;
    }
    active.onopen = () => {
      if (stopped || socket !== active) return;
      if (send({type: 'join', ...(chatName ? {chatName} : {}), CurrentUser: publicChatUser(getUser())})) {
        historyRequests.push('initial');
        attempts = 0;
        status('joining');
      } else {
        active.close();
      }
    };
    active.onmessage = event => {
      if (stopped || socket !== active) return;
      let data;
      try { data = JSON.parse(event.data); } catch { return; }
      if (!data || typeof data !== 'object' || Array.isArray(data) || data.version !== 2) return;
      if (data?.version === 2 && data.channel === channel && data.type === 'history' && historyRequests.shift() === 'identity') return;
      if (data.channel !== channel && data.type !== 'error') return;

      if (['joined', 'join_approved', 'join_pending'].includes(data.type) && typeof data.participantId === 'string') {
        selfParticipantId = data.participantId;
      }
      if (data.type === 'presence' && typeof data.selfId === 'string') selfParticipantId = data.selfId;

      if (data.type === 'joined' || data.type === 'join_approved') {
        kicked = false;
        status('connected');
      } else if (data.type === 'join_pending') {
        status('pending');
      } else if (data.type === 'participant_kicked' && data.participantId === selfParticipantId) {
        kicked = true;
        status('kicked');
      } else if (data.type === 'error') {
        status('error', {error: data.error || 'Chat request failed.'});
      }

      onEvent(data);
    };
    active.onerror = () => {
      if (!stopped && socket === active) status('error', {error: 'Connection interrupted. Waiting to reconnect…'});
    };
    active.onclose = event => {
      if (stopped || socket !== active) return;
      console.info('[ALINA Chat] WebSocket closed', {
        code: event?.code, reason: event?.reason || '', wasClean: event?.wasClean,
      });
      active.onopen = active.onmessage = active.onerror = active.onclose = null;
      socket = null;
      historyRequests = [];
      clearTimeout(typingTimer);
      typingTimer = null;
      lastTypingAt = 0;
      if (kicked) return;
      retry();
    };
  }

  function typing(value) {
    clearTimeout(typingTimer);
    typingTimer = null;
    if (!value) {
      if (lastTypingAt) send({type: 'typing', typing: false});
      lastTypingAt = 0;
      return;
    }
    const now = Date.now();
    if (!lastTypingAt || now - lastTypingAt >= 2000) {
      if (send({type: 'typing', typing: true})) lastTypingAt = now;
    }
    typingTimer = setTimeout(() => typing(false), 3000);
  }

  function disconnect() {
    stopped = true;
    kicked = false;
    selfParticipantId = '';
    historyRequests = [];
    clearTimeout(retryTimer);
    clearTimeout(typingTimer);
    retryTimer = typingTimer = null;
    lastTypingAt = 0;
    if (socket) {
      socket.onopen = socket.onmessage = socket.onerror = socket.onclose = null;
      socket.close();
      socket = null;
    }
  }

  return {
    start() { if (stopped) { stopped = false; connect(); } },
    stop: disconnect,
    reconnect() { disconnect(); attempts = 0; stopped = false; connect(); },
    updateUser() {
      // Reuse join to update presence without replacing the current message list.
      if (!send({type: 'join', CurrentUser: publicChatUser(getUser())})) return false;
      historyRequests.push('identity');
      return true;
    },
    sendMessage(text, mentions = [], requestedMessageId = '') {
      const normalizedMentions = mentions.map(({senderType, senderId}) => ({senderType, senderId: String(senderId)}));
      const key = `${String(text)}\0${JSON.stringify(normalizedMentions)}`;
      const clientMessageId = requestedMessageId || failedMessageIds.get(key) || createClientMessageId();
      if (!send({type: 'message', msg: text, mentions: normalizedMentions, clientMessageId, CurrentUser: publicChatUser(getUser())})) {
        failedMessageIds.set(key, clientMessageId);
        return false;
      }
      if (failedMessageIds.get(key) === clientMessageId) failedMessageIds.delete(key);
      typing(false);
      return clientMessageId;
    },
    loadMentionDirectory() { return send({type: 'mentions_directory'}); },
    loadOlder(beforeMessageId) { return send({type: 'history_before', beforeMessageId: String(beforeMessageId)}); },
    reactMessage(messageId, reaction) { return send({type: 'react_message', messageId: String(messageId), reaction}); },
    loadReactionList(messageId) { return send({type: 'reaction_list', messageId: String(messageId)}); },
    searchMentions(query) { return send({type: 'mentions_search', query: String(query)}); },
    searchParticipants(query) { return send({type: 'participants_search', query: String(query)}); },
    replyMessage(replyToMessageId, text, requestedMessageId = '') {
      const key = `reply:${String(replyToMessageId)}\0${String(text)}`;
      const clientMessageId = requestedMessageId || failedMessageIds.get(key) || createClientMessageId();
      if (!send({type: 'reply_message', replyToMessageId: String(replyToMessageId), msg: text, clientMessageId, CurrentUser: publicChatUser(getUser())})) {
        failedMessageIds.set(key, clientMessageId);
        return false;
      }
      if (failedMessageIds.get(key) === clientMessageId) failedMessageIds.delete(key);
      typing(false);
      return clientMessageId;
    },
    editMessage(messageId, text) { return send({type: 'edit_message', messageId: String(messageId), text}); },
    deleteMessage(messageId) { return send({type: 'delete_message', messageId: String(messageId)}); },
    discussMessage(messageId) { return send({type: 'discuss_message', messageId: String(messageId)}); },
    deleteChat() { return send({type: 'delete_chat'}); },
    renameChat(name) { return send({type: 'rename', name}); },
    renameGuest(guestId, name) { return send({type: 'rename_guest', guestId: String(guestId), name: String(name)}); },
    setAnonymousAllowed(allowed) { return send({type: 'set_anonymous', allowed}); },
    setConfirmationRequired(required) { return send({type: 'set_confirmation', required}); },
    approve(participantId) { return send({type: 'approve', participantId}); },
    kick(participantId) { return send({type: 'kick', participantId}); },
    typing,
  };
}
