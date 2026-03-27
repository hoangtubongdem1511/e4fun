const crypto = require('crypto');

const resultCache = new Map();
const inflightMap = new Map();

function now() {
  return Date.now();
}

function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
}

function hashValue(input) {
  return crypto.createHash('sha256').update(String(input)).digest('hex');
}

function makeApiKeyScope(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') return 'server-default';
  return `user-${hashValue(apiKey.trim()).slice(0, 12)}`;
}

function makeAiCacheKey({ endpoint, model, apiKey, payload }) {
  const payloadHash = hashValue(stableStringify(payload)).slice(0, 24);
  return `${endpoint}|${model}|${makeApiKeyScope(apiKey)}|${payloadHash}`;
}

function getCachedResult(key) {
  const entry = resultCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= now()) {
    resultCache.delete(key);
    return null;
  }
  return entry.value;
}

function setCachedResult(key, value, ttlMs) {
  resultCache.set(key, { value, expiresAt: now() + ttlMs });
}

function getInflight(key) {
  return inflightMap.get(key) || null;
}

function setInflight(key, promise) {
  inflightMap.set(key, promise);
}

function clearInflight(key) {
  inflightMap.delete(key);
}

module.exports = {
  makeAiCacheKey,
  getCachedResult,
  setCachedResult,
  getInflight,
  setInflight,
  clearInflight,
  makeApiKeyScope,
};

