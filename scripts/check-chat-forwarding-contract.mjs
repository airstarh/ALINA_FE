import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseForwardMessage} from '../src/components/Chat/chatProtocol.js';

const markup = '<div class="forward-quote" data-channel="general" data-message-id="42" data-timestamp="1234"><div class="forward-quote-author">Visitor &lt;One&gt;</div><div class="forward-quote-text">Hello &amp; goodbye</div></div>';
assert.deepEqual(parseForwardMessage(markup), {
  channel: 'general', messageId: '42', timestamp: 1234, author: 'Visitor <One>', text: 'Hello & goodbye',
});
assert.equal(parseForwardMessage(`${markup}\nforged body`), null, 'forward markup must consume the complete message');
assert.equal(parseForwardMessage('<div class="forward-quote">broken</div>'), null);

const message = readFileSync(new URL('../src/components/Chat/ChatMessage.vue', import.meta.url), 'utf8');
const chat = readFileSync(new URL('../src/components/Chat/index.vue', import.meta.url), 'utf8');
assert.match(message, /@click="\$emit\('forward', message\)"/, 'message must offer a forwarding action');
assert.match(message, /'chat-message-replying': replying \|\| forwarding/, 'forwarding source must reuse the dark-orange reply highlight');
assert.match(message, /hash: `#chat-message-\$\{forwarded\.value\.messageId\}`/, 'forward author must link to the source message');
assert.match(chat, /v-model="composerText"/, 'the existing textarea must become the forwarding search box');
assert.match(chat, /connection\?\.forwardMessage/, 'selected forwarding destinations must use the chat connection');
assert.match(chat, /connection\?\.searchForwardDestinations\(''\)/, 'clicking Forward must immediately request the destination directory');
assert.match(chat, /:forwarding="forwardingMessageId === entry\.message\.id"/, 'only the selected forwarding source may be highlighted');
assert.match(chat, /forwardingMessageId\.value && event\.key === 'Escape'[\s\S]*cancelForwardingMessage\(\)/, 'Escape must leave forwarding mode and remove its source highlight');
assert.match(chat, /<div v-if="forwardingMessageId" class="chat-mention-selector chat-forward-selector"/, 'forward destination popup must open immediately, even while results load');

console.log('Chat forwarding contract passed.');
