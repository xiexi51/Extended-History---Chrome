const assert = require('node:assert/strict');
const { canonicalHistoryUrl } = require('../url-rules.js');

for (const [input, expected] of [
  ['https://lichess.org/0FF85WTT6RwD', 'https://lichess.org/0FF85WTT6RwD'],
  ['https://lichess.org/0FF85WTT6RwD/black?foo=bar#board', 'https://lichess.org/0FF85WTT6RwD'],
  ['https://lichess.org/DrRYaLgg/white', 'https://lichess.org/DrRYaLgg'],
  ['https://lishogi.org/HSDAFWsD0u6O', 'https://lishogi.org/HSDAFWsD0u6O'],
  ['https://lishogi.org/HSDAFWsD0u6O/review', 'https://lishogi.org/HSDAFWsD0u6O'],
  ['https://lichess.org/analysis', ''],
  ['https://lichess.org/settings', ''],
  ['https://lichess.org/study/example', ''],
  ['https://lichess.org/@/a-player', ''],
  ['https://lishogi.org/analysis', ''],
  ['https://lishogi.org/forum/general', ''],
  ['https://lishogi.org/profile', ''],
  ['https://example.com/path/?a=1#section', 'https://example.com/path/?a=1'],
]) {
  assert.equal(canonicalHistoryUrl(input), expected, input);
}

const gameUrls = [
  'https://lichess.org/0FF85WTT6RwD',
  'https://lichess.org/0FF85WTT6RwD/black',
  'https://lichess.org/0FF85WTT6RwD/white?view=analysis',
];
assert.equal(new Set(gameUrls.map(canonicalHistoryUrl)).size, 1);

console.log('URL rule tests passed');