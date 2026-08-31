const GAME_HISTORY_HOSTS = new Set(['lichess.org', 'lishogi.org']);
const GAME_HISTORY_RESERVED_PATHS = new Set([
  'account', 'analysis', 'api', 'auth', 'broadcast', 'coach', 'contact',
  'coord', 'dasher', 'editor', 'embed', 'features', 'forum', 'games',
  'import', 'inbox', 'lobby', 'login', 'mobile', 'oauth', 'player',
  'practice', 'preferences', 'profile', 'puzzle', 'relay', 'round', 'search',
  'settings', 'streamer', 'study', 'team', 'tournament', 'training', 'tv',
  'video',
]);

function canonicalHistoryUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');

    if (GAME_HISTORY_HOSTS.has(host)) {
      const gameId = parsed.pathname.split('/').filter(Boolean)[0] || '';
      if (!/^[A-Za-z0-9]{8}(?:[A-Za-z0-9]{4})?$/.test(gameId)
          || GAME_HISTORY_RESERVED_PATHS.has(gameId.toLowerCase())) {
        return '';
      }
      return `${parsed.protocol}//${host}/${gameId}`;
    }

    parsed.hash = '';
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return url;
  }
}

function isGameHistoryUrl(url) {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    return GAME_HISTORY_HOSTS.has(host) && canonicalHistoryUrl(url) !== '';
  } catch {
    return false;
  }
}

function mergeGameHistoryEntries(entries) {
  const merged = [];
  const gameEntries = new Map();
  let changed = false;

  for (const entry of entries) {
    const canonicalUrl = canonicalHistoryUrl(entry.url);
    if (!isGameHistoryUrl(entry.url)) {
      try {
        const host = new URL(entry.url).hostname.toLowerCase().replace(/^www\./, '');
        if (GAME_HISTORY_HOSTS.has(host)) { changed = true; continue; }
      } catch {}
      merged.push(entry);
      continue;
    }

    if (canonicalUrl !== entry.url) changed = true;
    const existing = gameEntries.get(canonicalUrl);
    if (!existing) {
      const normalized = canonicalUrl === entry.url ? entry : { ...entry, url: canonicalUrl };
      gameEntries.set(canonicalUrl, normalized);
      merged.push(normalized);
      continue;
    }

    changed = true;
    const newer = (entry.visitTime || 0) > (existing.visitTime || 0) ? entry : existing;
    existing.visitTime = Math.max(existing.visitTime || 0, entry.visitTime || 0);
    existing.rawUrl = newer.rawUrl || newer.url;
    existing.title = newer.title || existing.title;
    existing.visitCount = (existing.visitCount || 1) + (entry.visitCount || 1);
  }

  return { entries: merged, changed };
}

if (typeof module !== 'undefined') {
  module.exports = { canonicalHistoryUrl, isGameHistoryUrl, mergeGameHistoryEntries };
}