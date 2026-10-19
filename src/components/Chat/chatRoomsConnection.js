import {publicChatUser} from './chatProtocol.js';

export function createChatRoomsConnection({url, getUser, getPagination, onRooms, onStatus, WebSocketClass = WebSocket}) {
  let socket = null;
  let retryTimer = null;
  let stopped = true;
  let attempts = 0;

  function status(state, extra = {}) {
    onStatus({state, ...extra});
  }

  function clearSocket() {
    if (!socket) return;
    socket.onopen = socket.onmessage = socket.onerror = socket.onclose = null;
    socket.close();
    socket = null;
  }

  function scheduleRetry() {
    if (stopped || retryTimer !== null) return;
    const delay = Math.min(3000 * 2 ** Math.min(attempts++, 4), 30000);
    status('reconnecting', {delay, attempt: attempts});
    retryTimer = setTimeout(() => {
      retryTimer = null;
      connect();
    }, delay);
  }

  function connect() {
    if (stopped) return;
    clearSocket();
    status('connecting');
    let active;
    try {
      active = new WebSocketClass(url);
      socket = active;
    } catch {
      scheduleRetry();
      return;
    }

    active.onopen = () => {
      if (stopped || socket !== active) return;
      try {
        active.send(JSON.stringify({
          version: 2,
          type: 'list_rooms',
          CurrentUser: publicChatUser(getUser()),
          pagination: getPagination(),
        }));
        attempts = 0;
        status('loading');
      } catch {
        status('error', {error: 'Unable to request chat rooms.'});
      }
    };
    active.onmessage = event => {
      if (stopped || socket !== active) return;
      let data;
      try { data = JSON.parse(event.data); } catch { return; }
      if (!data || Array.isArray(data) || data.version !== 2) return;
      if (data.type === 'rooms' && data.mine && data.others) {
        onRooms({mine: data.mine, others: data.others});
        status('connected');
      } else if (data.type === 'error') {
        status('error', {error: data.error || 'Unable to load chat rooms.'});
      }
    };
    active.onerror = () => {
      if (!stopped && socket === active) status('error', {error: 'Chat room connection interrupted.'});
    };
    active.onclose = () => {
      if (stopped || socket !== active) return;
      active.onopen = active.onmessage = active.onerror = active.onclose = null;
      socket = null;
      scheduleRetry();
    };
  }

  function stop() {
    stopped = true;
    clearTimeout(retryTimer);
    retryTimer = null;
    clearSocket();
  }

  function retry() {
    clearTimeout(retryTimer);
    retryTimer = null;
    stopped = false;
    connect();
  }

  return {
    start() { if (stopped) { stopped = false; connect(); } },
    stop,
    retry,
  };
}
