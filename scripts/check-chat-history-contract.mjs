import assert from 'node:assert/strict';
import {prependOlderMessages, preservedScrollTop} from '../src/components/Chat/chatHistory.js';

assert.deepEqual(prependOlderMessages([{id: '3'}, {id: '4'}], [{id: '1'}, {id: '2'}, {id: '3'}]).map(row => row.id), ['1', '2', '3', '4']);
assert.equal(preservedScrollTop(8, 500, 900), 408, 'prepending must retain the same visible content');

console.log('Chat history behavior checks passed.');
