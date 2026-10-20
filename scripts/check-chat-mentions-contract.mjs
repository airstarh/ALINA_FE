import assert from 'node:assert/strict';
import {activeMentionQuery, appendMention, filterMentionCandidates, insertMention, synchronizeSelectedMentions} from '../src/components/Chat/chatMentions.js';

assert.deepEqual(activeMentionQuery('@de', 3), {start: 0, query: 'de'});
assert.deepEqual(activeMentionQuery('hello @de', 9), {start: 6, query: 'de'});
assert.equal(activeMentionQuery('mail@de', 7), null);
assert.equal(activeMentionQuery('hello\n@de', 9), null, 'newline does not activate mentions');

const candidates = [
  {senderType: 'user', senderId: '1', senderName: 'Codex', latestActivityAt: 5},
  {senderType: 'user', senderId: '2', senderName: 'Dexp', latestActivityAt: 4},
  {senderType: 'user', senderId: '3', senderName: 'Unexpected', latestActivityAt: 3},
  {senderType: 'guest', senderId: 'g-4', senderName: 'DE Guest', latestActivityAt: 2},
];
assert.deepEqual(filterMentionCandidates(candidates, 'de', [], {senderType: 'user', senderId: '9'}).map(x => x.senderId), ['1', '2', 'g-4']);
assert.deepEqual(filterMentionCandidates(candidates, '', [candidates[0]], {senderType: 'user', senderId: '2'}).map(x => x.senderId), ['3', 'g-4']);

const inserted = insertMention('hello @co', {start: 6, end: 9}, candidates[0]);
assert.equal(inserted.text, 'hello @Codex ');
assert.equal(inserted.caret, 13);
assert.deepEqual(synchronizeSelectedMentions('@Codex hi', [candidates[0], candidates[0]]), [candidates[0]]);
assert.deepEqual(synchronizeSelectedMentions('@Code hi', [candidates[0]]), []);

const tagged = appendMention('hello', 5, candidates[0], []);
assert.equal(tagged.text, 'hello @Codex ');
assert.equal(tagged.caret, 13);
assert.deepEqual(tagged.mentions, [candidates[0]]);
assert.deepEqual(appendMention(tagged.text, tagged.caret, candidates[0], tagged.mentions), tagged, 'TAG must not duplicate an existing structured mention');

console.log('Chat mentions contract passed.');
