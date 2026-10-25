import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compileScript, compileTemplate, parse} from '@vue/compiler-sfc';
import {prependOlderMessages, preservedScrollTop} from '../src/components/Chat/chatHistory.js';

assert.deepEqual(prependOlderMessages([{id: '3'}, {id: '4'}], [{id: '1'}, {id: '2'}, {id: '3'}]).map(row => row.id), ['1', '2', '3', '4']);
assert.equal(preservedScrollTop(8, 500, 900), 408, 'prepending must retain the same visible content');

const source = readFileSync(new URL('../src/components/Chat/index.vue', import.meta.url), 'utf8');
assert.match(source, /v-if="showLoadOlder"/, 'older-history button must be hidden initially');
assert.match(source, /\$t\('Load older'\)/, 'older-history button must be translated');
assert.match(source, /@wheel\.passive="trackHistoryIntent"/, 'upward scrolling at the beginning must reveal the button');
const parsed = parse(source, {filename: 'Chat/index.vue'});
assert.deepEqual(parsed.errors, []);
const script = compileScript(parsed.descriptor, {id: 'chat-history-contract'});
const template = compileTemplate({id: 'chat-history-contract', filename: 'Chat/index.vue', source: parsed.descriptor.template.content, compilerOptions: {bindingMetadata: script.bindings}});
assert.deepEqual(template.errors, []);

console.log('Chat history contract passed.');
