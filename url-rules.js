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

if (typeof module !== 'undefined') module.exports = { canonicalHistoryUrl };