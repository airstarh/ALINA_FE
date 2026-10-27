import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

import {
  buildChatTaleDraft,
  consumeChatTaleDraft,
  storeChatTaleDraft,
} from '../src/services/ChatTaleDraft.js';
import {messageHtmlForTale} from '../src/components/Chat/chatProtocol.js';

const storage = new Map();
const session = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.delete(key),
};
const draft = buildChatTaleDraft({
  channel: 'general room',
  messageId: 42,
  authorName: 'Alice Example',
  messageHtml: '<div class="reply-quote" data-timestamp="123"><a class="bad" onclick="attack()" href="https://zero.home/source">Hello</a><pre class="language-js">const x = 1;</pre></div>',
  origin: 'https://zero.home:50443',
});

assert.equal(draft.header, 'MESSAGE: Alice Example');
assert.match(draft.body, /^<p><a href="https:\/\/zero\.home:50443\/#\/chat\?channel=general%20room#chat-message-42">/);
assert.match(draft.body, /<p><a href="https:\/\/zero\.home\/source">Hello<\/a><pre>const x = 1;<\/pre><\/p>$/);
assert.doesNotMatch(draft.body, /class=|onclick=|data-timestamp=/);
const mediaDraft = buildChatTaleDraft({
  channel: '1', messageId: 43, authorName: 'Media User', origin: 'https://zero.home:50443',
  messageHtml: '<div><img class="preview" src="/image.jpg"><video controls autoplay src="/video.webm"></video><audio controls src="/audio.mp3"></audio></div>',
});
assert.match(mediaDraft.body, /<p><img src="https:\/\/zero\.home:50443\/image\.jpg"><video src="https:\/\/zero\.home:50443\/video\.webm"><\/video><audio src="https:\/\/zero\.home:50443\/audio\.mp3"><\/audio><\/p>$/);
assert.doesNotMatch(mediaDraft.body, /controls|autoplay|class=/, 'media tags must keep only the source needed by the editor');

const renderedMessage = messageHtmlForTale('Photo:\nhttps://zero.home:50443/uploads/picture.png\n```js\nconst answer = 42;\n```');
assert.match(renderedMessage, /<img src="https:\/\/zero\.home:50443\/uploads\/picture\.png">/, 'image URLs rendered by chat must reach the tale as images');
assert.match(renderedMessage, /<pre><code>const answer = 42;\n<\/code><\/pre>/, 'chat code fences must reach the tale as preformatted blocks');

storeChatTaleDraft(session, draft, 1_000);
assert.deepEqual(consumeChatTaleDraft(session, 1_001), draft, 'stored draft must be consumed once');
assert.equal(consumeChatTaleDraft(session, 1_002), null, 'consumed draft must be removed');
storeChatTaleDraft(session, draft, 1_000);
assert.equal(consumeChatTaleDraft(session, 1_000 + 5 * 60_000 + 1), null, 'stale chat handoff must not replace a later draft');

const messageComponent = readFileSync(new URL('../src/components/Chat/ChatMessage.vue', import.meta.url), 'utf8');
const chatComponent = readFileSync(new URL('../src/components/Chat/index.vue', import.meta.url), 'utf8');
const taleComponent = readFileSync(new URL('../src/views/tale/upsert.vue', import.meta.url), 'utf8');
assert.match(messageComponent, /bi-file-earmark-plus/, 'real chat messages must offer the Add Tale icon');
assert.match(messageComponent, /\$emit\('add-tale', message\)/, 'Add Tale must identify its source message');
assert.match(chatComponent, /@add-tale="addMessageToTale"/, 'chat must handle the Add Tale action');
assert.match(chatComponent, /messageHtml:\s*messageHtmlForTale\(message\.msg\)/, 'the handoff must snapshot the same semantic media and code structure rendered by chat');
assert.match(taleComponent, /consumeChatTaleDraft\(sessionStorage\)/, 'the loaded server draft must consume the chat handoff');
assert.match(taleComponent, /tale\.header = chatDraft\.header[\s\S]*tale\.body = chatDraft\.body/, 'chat content must replace, not append to, the draft');

console.log('Chat-to-tale contract passed.');
