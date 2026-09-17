import {publicChatUser} from './chatProtocol.js';

// Framework-independent transport. All timers and handlers belong to this instance.
export function createChatConnection({url, channel, getUser, onEvent, onStatus, WebSocketClass = WebSocket}) {
  let socket = null;
  let retryTimer = null;
  let typingTimer = null;
  let stopped = true;
  let attempts = 0;
  let lastTypingAt = 0;

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
      if (send({type: 'join', CurrentUser: publicChatUser(getUser())})) {
        attempts = 0;
        status('connected');
      } else {
        active.close();
      }
    };
    active.onmessage = event => {
      if (stopped || socket !== active) return;
      let data;
      try { data = JSON.parse(event.data); } catch { return; }
      if (data?.version === 2 && (data.channel === channel || data.type === 'error')) onEvent(data);
    };
    active.onerror = () => {
      if (!stopped && socket === active) status('error', {error: 'Connection interrupted. Waiting to reconnect…'});
    };
    active.onclose = () => {
      if (stopped || socket !== active) return;
      active.onopen = active.onmessage = active.onerror = active.onclose = null;
      socket = null;
      clearTimeout(typingTimer);
      typingTimer = null;
      lastTypingAt = 0;
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
    sendMessage(text) {
      if (!send({type: 'message', msg: text, CurrentUser: publicChatUser(getUser())})) return false;
      typing(false);
      return true;
    },
    typing,
  };
}
