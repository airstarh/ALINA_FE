export const FEED_SESSION_TTL_MS = 5 * 60 * 1000;

function normalizeValue(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((normalized, key) => {
        normalized[key] = normalizeValue(value[key]);
        return normalized;
      }, {});
  }

  return value;
}

function createSessionKey(view, identity, query = {}) {
  return [
    "alina-session-v1",
    view,
    identity ?? "",
    JSON.stringify(normalizeValue(query)),
  ].join(":");
}

export function createFeedSessionKey(context, owner, query = {}) {
  return createSessionKey(`feed-${context}`, owner, query);
}

export function createProfileSessionKey(owner) {
  return createSessionKey("profile", owner);
}

export function writeSessionState(storage, key, state, now = Date.now()) {
  try {
    storage.setItem(key, JSON.stringify({savedAt: now, state}));
    return true;
  } catch {
    return false;
  }
}

export function readSessionState(
  storage,
  key,
  now = Date.now(),
  ttl = FEED_SESSION_TTL_MS,
) {
  try {
    const saved = JSON.parse(storage.getItem(key));

    if (
      !saved
      || typeof saved.savedAt !== "number"
      || now - saved.savedAt > ttl
      || !saved.state
      || typeof saved.state !== "object"
    ) {
      storage.removeItem(key);
      return null;
    }

    return saved.state;
  } catch {
    storage.removeItem(key);
    return null;
  }
}
