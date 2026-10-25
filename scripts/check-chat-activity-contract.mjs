import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compileScript, compileTemplate, parse} from '@vue/compiler-sfc';
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

const component = readFileSync(new URL('../src/components/Chat/ChatActivityBlock.vue', import.meta.url), 'utf8');
const messageComponent = readFileSync(new URL('../src/components/Chat/ChatMessage.vue', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/components/Chat/chat.css', import.meta.url), 'utf8');
const locales = readFileSync(new URL('../src/locales/index.js', import.meta.url), 'utf8');
assert.match(component, /ref\(false\)/, 'activity block must default to collapsed');
assert.match(component, /aria-expanded/, 'activity toggle must expose expanded state');
assert.match(component, /aria-controls/, 'activity toggle must identify controlled rows');
assert.match(component, /v-if="expanded"/, 'collapsed block must remove hidden rows from the accessibility tree');
assert.match(component, /1 activity update/, 'activity block must provide singular neutral count');
assert.match(component, /\{count\} activity updates/, 'activity block must provide plural neutral count');
assert.match(messageComponent, /chat-service-row/, 'expanded service content, date and controls must share one row');
assert.match(css, /\.chat-message-service[^}]*border-left:\s*3px solid #8b5cf6/, 'expanded service rows retain purple border');
assert.match(css, /\.chat-service-row[^}]*display:\s*flex/, 'expanded service row must use flex layout');

const parsed = parse(component, {filename: 'ChatActivityBlock.vue'});
assert.deepEqual(parsed.errors, [], 'activity component must parse as a Vue SFC');
const script = compileScript(parsed.descriptor, {id: 'chat-activity-contract'});
const template = compileTemplate({
  id: 'chat-activity-contract', filename: 'ChatActivityBlock.vue',
  source: parsed.descriptor.template.content, compilerOptions: {bindingMetadata: script.bindings},
});
assert.deepEqual(template.errors, [], 'activity component template must compile');
assert.match(component, /:first-message="startIndex \+ index === 0"/, 'activity rows must use the camel-cased startIndex prop');

console.log('Chat activity contract passed.');
