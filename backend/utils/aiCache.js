const resultCache = new Map();
const inflightMap = new Map();

function now() {
  return Date.now();
}

function clearExpired() {
  const t = now();
  for (const [key, value] of resultCache.entries()) {
    if (!value || typeof value.expiresAt !== 'number' || value.expiresAt <= t) {
      resultCache.delete(key);
    }
  }
}

function getCache(key) {
  const hit = resultCache.get(key);
  if (!hit) return undefined;
  if (hit.expiresAt <= now()) {
    resultCache.delete(key);
    return undefined;
  }
  return hit.value;
}

function setCache(key, value, ttlMs) {
  if (!ttlMs || ttlMs <= 0) return;
  resultCache.set(key, {
    value,
    expiresAt: now() + ttlMs,
  });
}

function getInflight(key) {
  return inflightMap.get(key);
}

function setInflight(key, promise) {
  inflightMap.set(key, promise);
}

function clearInflight(key) {
  inflightMap.delete(key);
}

module.exports = {
  clearExpired,
  getCache,
  setCache,
  getInflight,
  setInflight,
  clearInflight,
};

