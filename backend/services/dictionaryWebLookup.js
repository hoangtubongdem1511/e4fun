const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Web lookup dictionary data (Gemini-only fallback).
 * Provider: dictionaryapi.dev
 *
 * Returns normalized shape so prompt can consume predictable fields.
 */
async function lookupDictionary(word, { requestId } = {}) {
  const cleanWord = typeof word === 'string' ? word.trim() : '';
  if (!cleanWord) return { ok: false, reason: 'empty_word' };

  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`;

  try {
    const response = await axios.get(url, { timeout: 8000 });
    const entries = response?.data;
    if (!Array.isArray(entries) || entries.length === 0) {
      return { ok: false, reason: 'no_entries' };
    }

    const entry = entries[0];

    const phonetics = Array.isArray(entry.phonetics)
      ? entry.phonetics
          .map((p) => (p?.text ? String(p.text).trim() : null))
          .filter(Boolean)
      : [];

    const meanings = Array.isArray(entry.meanings) ? entry.meanings : [];

    const definitions = [];
    const examples = [];
    const synonyms = new Set();
    const antonyms = new Set();
    const partsOfSpeech = new Set();

    for (const meaning of meanings) {
      const pos = meaning?.partOfSpeech;
      if (pos) partsOfSpeech.add(String(pos));

      const defs = Array.isArray(meaning?.definitions) ? meaning.definitions : [];
      for (const d of defs) {
        const defText = d?.definition ? String(d.definition).trim() : '';
        if (defText) definitions.push({ partOfSpeech: pos || '', definition: defText });

        const ex = d?.example ? String(d.example).trim() : '';
        if (ex) examples.push(ex);

        if (Array.isArray(d?.synonyms)) {
          for (const s of d.synonyms) if (s) synonyms.add(String(s));
        }
        if (Array.isArray(d?.antonyms)) {
          for (const a of d.antonyms) if (a) antonyms.add(String(a));
        }
      }
    }

    return {
      ok: true,
      data: {
        word: cleanWord,
        phonetics: phonetics.slice(0, 3),
        partsOfSpeech: Array.from(partsOfSpeech).slice(0, 6),
        definitions: definitions.slice(0, 8),
        examples: examples.slice(0, 4),
        synonyms: Array.from(synonyms).slice(0, 12),
        antonyms: Array.from(antonyms).slice(0, 12),
      },
    };
  } catch (err) {
    const status = err?.response?.status;
    if (status === 404) return { ok: false, reason: 'not_found' };

    logger.warn(
      { requestId, word: cleanWord, status, error: err?.message || String(err) },
      'dictionaryWebLookup failed',
    );
    return { ok: false, reason: 'lookup_error' };
  }
}

/**
 * Convert normalized data to a compact text block for prompt.
 */
function buildContextText(webData) {
  if (!webData || typeof webData !== 'object') return '';

  const { phonetics, partsOfSpeech, definitions, examples, synonyms, antonyms } = webData;

  const sections = [];

  if (Array.isArray(phonetics) && phonetics.length > 0) {
    sections.push(`- PHÁT ÂM (IPA): ${phonetics.join(' | ')}`);
  }

  if (Array.isArray(partsOfSpeech) && partsOfSpeech.length > 0) {
    sections.push(`- LOẠI TỪ: ${partsOfSpeech.join(', ')}`);
  }

  if (Array.isArray(definitions) && definitions.length > 0) {
    const defLines = definitions.map((d, idx) => {
      const pos = d.partOfSpeech ? `(${d.partOfSpeech})` : '';
      return `${idx + 1}. ${pos} ${d.definition}`.trim();
    });
    sections.push(`- ĐỊNH NGHĨA: \n${defLines.map((l) => `  ${l}`).join('\n')}`);
  }

  if (Array.isArray(examples) && examples.length > 0) {
    sections.push(`- VÍ DỤ (EN): ${examples.join(' | ')}`);
  }

  if (Array.isArray(synonyms) && synonyms.length > 0) {
    sections.push(`- TỪ ĐỒNG NGHĨA: ${synonyms.join(', ')}`);
  }

  if (Array.isArray(antonyms) && antonyms.length > 0) {
    sections.push(`- TỪ TRÁI NGHĨA: ${antonyms.join(', ')}`);
  }

  return sections.join('\n');
}

module.exports = {
  lookupDictionary,
  buildContextText,
};

