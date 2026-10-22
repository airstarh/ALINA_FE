function normalizeQueryValue(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeQueryValue);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((normalized, key) => {
        normalized[key] = normalizeQueryValue(value[key]);
        return normalized;
      }, {});
  }

  return value;
}

export function feedContext(route) {
  return route?.meta?.feedContext || null;
}

export function shouldReloadFeedForRouteChange(to, from, expectedContext) {
  if (
    feedContext(to) !== expectedContext
    || feedContext(from) !== expectedContext
  ) {
    return false;
  }

  if (
    expectedContext === "profile"
    && to?.params?.id !== from?.params?.id
  ) {
    return false;
  }

  return JSON.stringify(normalizeQueryValue(to.query || {}))
    !== JSON.stringify(normalizeQueryValue(from.query || {}));
}
