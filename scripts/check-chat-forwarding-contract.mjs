import assert from 'node:assert/strict';
import {parseForwardMessage} from '../src/components/Chat/chatProtocol.js';

const markup = '<div class="forward-quote" data-channel="general" data-message-id="42" data-timestamp="1234"><div class="forward-quote-author">Visitor &lt;One&gt;</div><div class="forward-quote-text">Hello &amp; goodbye</div></div>';
assert.deepEqual(parseForwardMessage(markup), {
  channel: 'general', messageId: '42', timestamp: 1234, author: 'Visitor <One>', text: 'Hello & goodbye',
});
assert.equal(parseForwardMessage(`${markup}\nforged body`), null, 'forward markup must consume the complete message');
assert.equal(parseForwardMessage('<div class="forward-quote">broken</div>'), null);

console.log('Chat forwarding protocol checks passed.');
