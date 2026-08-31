const assert = require('node:assert/strict');
const {
  canonicalHistoryUrl,
  mergeGameHistoryEntries,
} = require('../url-rules.js');

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

const { entries: mergedGames } = mergeGameHistoryEntries([
  { id: 'one', url: 'https://lichess.org/0FF85WTT6RwD', visitTime: 100, title: 'First' },
  { id: 'two', url: 'https://lichess.org/0FF85WTT6RwD/black', visitTime: 200, title: 'Latest' },
  { id: 'three', url: 'https://lichess.org/DrRYaLgg/white', visitTime: 300 },
  { id: 'four', url: 'https://lishogi.org/HSDAFWsD0u6O/review', visitTime: 400 },
  { id: 'five', url: 'https://lishogi.org/analysis', visitTime: 500 },
  { id: 'six', url: 'https://example.com/page', visitTime: 600 },
  { id: 'seven', url: 'https://example.com/page', visitTime: 700 },
]);
assert.deepEqual(mergedGames.map(entry => entry.url).sort(), [
  'https://example.com/page',
  'https://example.com/page',
  'https://lichess.org/0FF85WTT6RwD',
  'https://lichess.org/DrRYaLgg',
  'https://lishogi.org/HSDAFWsD0u6O',
]);
const firstGame = mergedGames.find(entry => entry.url === 'https://lichess.org/0FF85WTT6RwD');
assert.equal(firstGame.visitTime, 200);
assert.equal(firstGame.visitCount, 2);
assert.equal(firstGame.title, 'Latest');

console.log('URL rule tests passed');