import assert from 'node:assert/strict';
import {groupChatTimeline} from '../src/components/Chat/chatActivity.js';

const ordinary = id => ({id, senderType: 'user', msg: `message ${id}`});
const bot = id => ({id, senderType: 'bot', msg: `bot ${id}`});
const service = id => ({id, senderType: 'user_service', msg: `service ${id}`});

assert.deepEqual(groupChatTimeline([]), []);
assert.deepEqual(groupChatTimeline([ordinary(1)]), [{type: 'message', key: 'message-1', message: ordinary(1), index: 0}]);
assert.deepEqual(groupChatTimeline([service(2)]), [{type: 'activity', key: 'activity-2', messages: [service(2)], startIndex: 0}]);

const source = [service(2), service(3), ordinary(4), service(5), service(6), bot(7), service(8)];
const snapshot = structuredClone(source);
const grouped = groupChatTimeline(source);
assert.deepEqual(source, snapshot, 'grouping must not mutate messages');
assert.deepEqual(grouped.map(entry => [entry.type, entry.key, entry.messages?.length ?? 1]), [
  ['activity', 'activity-2', 2], ['message', 'message-4', 1], ['activity', 'activity-5', 2],
  ['message', 'message-7', 1], ['activity', 'activity-8', 1],
]);
assert.equal(groupChatTimeline([...source, service(9)])[4].key, 'activity-8', 'append must preserve activity identity');
assert.equal(groupChatTimeline([service(2), service(3)].filter(message => message.id !== 2))[0].key, 'activity-3', 'deleting first row must re-key surviving block');
assert.deepEqual(groupChatTimeline([service(2)].filter(message => message.id !== 2)), [], 'deleting final row removes block');

console.log('Chat activity behavior checks passed.');
