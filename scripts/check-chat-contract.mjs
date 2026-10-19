import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse} from '@vue/compiler-sfc';
import {nextTick, reactive} from 'vue';

import {createChatConnection} from '../src/components/Chat/chatConnection.js';
import {
  canKickParticipants,
  canonicalChatUrl,
  createClientMessageId,
  videoChatUrl,
  withoutParticipantMessages,
} from '../src/components/Chat/chatProtocol.js';

let watchChatIdentity;
try {
  ({watchChatIdentity} = await import('../src/components/Chat/chatIdentity.js'));
} catch {
  // The assertion below reports the missing behavior as a contract failure.
}

function componentDescriptor(relativePath) {
  const source = readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8');
  const {descriptor, errors} = parse(source, {filename: relativePath});
  assert.deepEqual(errors, [], `${relativePath} must parse as a Vue SFC`);
  return descriptor;
}

function walkTemplate(node, visit) {
  visit(node);
  for (const child of node.children || []) walkTemplate(child, visit);
  for (const branch of node.branches || []) walkTemplate(branch, visit);
}

function staticAttribute(node, name) {
  return node.props?.find(prop => prop.type === 6 && prop.name === name)?.value?.content;
}

function directive(node, name, argument = '') {
  return node.props?.find(prop => prop.type === 7 && prop.name === name && (!argument || prop.arg?.content === argument));
}

function elementWithClass(descriptor, className) {
  let result = null;
  walkTemplate(descriptor.template.ast, node => {
    const classes = staticAttribute(node, 'class')?.split(/\s+/) || [];
    if (classes.includes(className)) result = node;
  });
  return result;
}

class FakeWebSocket {
  static OPEN = 1;
  static instances = [];

  constructor(url) {
    this.url = url;
    this.readyState = 0;
    this.sent = [];
    this.attempted = [];
    this.throwForType = null;
    FakeWebSocket.instances.push(this);
  }

  open() {
    this.readyState = FakeWebSocket.OPEN;
    this.onopen?.();
  }

  send(raw) {
    const payload = JSON.parse(raw);
    this.attempted.push(payload);
    if (this.throwForType === payload.type) {
      this.throwForType = null;
      throw new Error('simulated send failure');
    }
    this.sent.push(payload);
  }

  receive(payload) {
    this.onmessage?.({data: typeof payload === 'string' ? payload : JSON.stringify(payload)});
  }

  close(event = {code: 1000, reason: '', wasClean: true}) {
    this.readyState = 3;
    this.onclose?.(event);
  }
}

const realSetTimeout = globalThis.setTimeout;
const realClearTimeout = globalThis.clearTimeout;
let nextTimerId = 1;
const timers = new Map();
globalThis.setTimeout = (callback, delay) => {
  const id = nextTimerId++;
  timers.set(id, {callback, delay});
  return id;
};
globalThis.clearTimeout = id => timers.delete(id);

try {
  assert.equal(typeof watchChatIdentity, 'function', 'chat identity synchronization must be available');
  const observedIdentity = reactive({attributes: {id: 17, nickname: 'Alice', emblem: ''}});
  const synchronized = [];
  const stopIdentityWatch = watchChatIdentity(observedIdentity, identity => synchronized.push(identity));
  observedIdentity.attributes = {id: 17, nickname: 'Alice', emblem: '/uploads/alice.webp'};
  await nextTick();
  assert.equal(synchronized.length, 1, 'identity refresh must notify the active chat without a message');
  assert.equal(synchronized[0].emblem, '/uploads/alice.webp', 'identity synchronization must include the refreshed avatar');
  stopIdentityWatch();

  assert.equal(
    canonicalChatUrl('https://zero.home:50443/apps/vue/', 'room_1'),
    'https://zero.home:50443/#/chat?channel=room_1',
    'copied chat URL must use the current origin and hash route',
  );
  assert.equal(
    videoChatUrl('https://zero.home:50443/apps/vue/', 'room_1'),
    'https://zero.home:50443/apps/vue3video/call?cRoomId=room_1',
    'video chat URL must use the current origin and encoded channel',
  );
  assert.equal(canKickParticipants({isAdmin: () => true, isModerator: () => false}), true);
  assert.equal(canKickParticipants({isAdmin: () => false, isModerator: () => true}), true);
  assert.equal(canKickParticipants({isAdmin: () => false, isModerator: () => false}), false);
  assert.deepEqual(
    withoutParticipantMessages([
      {id: '1', participantId: 'user:1'},
      {id: '2', participantId: 'user:2'},
      {id: '3', participantId: 'bot:robocop'},
    ], 'user:2').map(message => message.id),
    ['1', '3'],
    'kick event must remove only the target messages already displayed',
  );

  const indexComponent = componentDescriptor('src/components/Chat/index.vue');
  const nameInput = elementWithClass(indexComponent, 'chat-name-input');
  assert.ok(nameInput, 'chat name input must always be visible');
  assert.equal(staticAttribute(nameInput, 'maxlength'), '200');
  assert.equal(directive(nameInput, 'if'), undefined, 'chat name input must not be conditional');
  assert.ok(directive(nameInput, 'on', 'blur'), 'chat name must save on blur');
  assert.equal(elementWithClass(indexComponent, 'channel-name'), null, 'internal chat channel ID must not be displayed');
  const anonymousControl = elementWithClass(indexComponent, 'chat-anonymous-control');
  assert.ok(anonymousControl, 'chat header must expose the anonymous-access control');
  assert.equal(anonymousControl.tag, 'button', 'anonymous-access control must be a button');
  assert.equal(directive(anonymousControl, 'if'), undefined, 'ANON button must be visible to every participant');
  assert.ok(directive(anonymousControl, 'bind', 'class')?.exp?.content.includes('isAnionAllowed'), 'ANON button color must reflect the persisted anonymous-access flag');
  assert.ok(directive(anonymousControl, 'on', 'click'), 'every participant must be able to toggle anonymous access');
  const confirmationControl = elementWithClass(indexComponent, 'chat-confirmation-control');
  assert.ok(confirmationControl, 'chat header must expose the confirmation policy control');
  assert.equal(confirmationControl.tag, 'button', 'confirmation policy control must be a button');
  assert.equal(directive(confirmationControl, 'if'), undefined, 'OPENED/CLOSED button must be visible to every participant');
  assert.ok(directive(confirmationControl, 'bind', 'class')?.exp?.content.includes('isConfirmationRequired'), 'OPENED/CLOSED color must reflect the persisted confirmation flag');
  assert.ok(directive(confirmationControl, 'on', 'click'), 'every participant must be able to toggle confirmation policy');
  assert.ok(elementWithClass(indexComponent, 'chat-copy-link'), 'chat header must expose copy-link action');
  assert.ok(elementWithClass(indexComponent, 'chat-video-link'), 'chat header must expose video-chat action');
  const composer = elementWithClass(indexComponent, 'chat-composer-input');
  assert.ok(directive(composer, 'bind', 'disabled')?.exp?.content.includes('connected'), 'pending composer must be disabled');

  const participantsComponent = componentDescriptor('src/components/Chat/ChatParticipants.vue');
  assert.ok(elementWithClass(participantsComponent, 'chat-approve'), 'join requests must expose approval action');
  assert.ok(elementWithClass(participantsComponent, 'chat-kick'), 'participant rows must expose role-controlled kick action');

  const messageComponent = componentDescriptor('src/components/Chat/ChatMessage.vue');
  assert.ok(elementWithClass(messageComponent, 'chat-avatar-robocop'), 'Robocop message must have a robot avatar treatment');
  const editControl = elementWithClass(messageComponent, 'chat-message-edit');
  const deleteControl = elementWithClass(messageComponent, 'chat-message-delete');
  assert.ok(editControl && deleteControl, 'manageable messages must expose edit and delete footer controls');
  assert.ok(directive(editControl, 'if')?.exp?.content.includes('canManage'), 'edit visibility must be supplied by the parent UI');
  assert.ok(messageComponent.template.content.includes("$t('i_edit')"), 'edit control must use the existing locale icon');
  assert.ok(messageComponent.template.content.includes("$t('i_delete')"), 'delete control must use the existing locale icon');
  assert.ok(messageComponent.template.content.includes('chat-message-editing'), 'active edit target must receive a gray-state class');
  assert.match(indexComponent.scriptSetup.content, /editingMessageId/, 'chat page must track the edited message');
  assert.match(indexComponent.scriptSetup.content, /window\.confirm/, 'message deletion must use native browser confirmation');
  assert.match(indexComponent.scriptSetup.content, /message_edited/, 'chat page must apply incoming edits');
  assert.match(indexComponent.scriptSetup.content, /message_deleted/, 'chat page must apply incoming deletions');
  assert.match(indexComponent.scriptSetup.content, /return isOwn\(message\) \|\| user\.isAdmin\(\) \|\| user\.isModerator\(\)/, 'only owners, admins and moderators must see message controls');
  const chatCss = readFileSync(new URL('../src/components/Chat/chat.css', import.meta.url), 'utf8');
  assert.match(chatCss, /\.chat-message-editing\s*\{[^}]*background:\s*#4f5867/s, 'the active edit target must have a gray background');

  const ids = Array.from({length: 100}, () => createClientMessageId());
  assert.equal(new Set(ids).size, ids.length, 'message IDs must be unique');
  ids.forEach(id => {
    assert.equal(typeof id, 'string');
    assert.ok(id.length > 0 && id.length <= 64, 'message ID must fit the database column');
  });

  const events = [];
  const statuses = [];
  const connection = createChatConnection({
    url: 'wss://chat.test/ws',
    channel: 'general',
    getUser: () => ({id: 17, nickname: 'Alice', privateRole: 'admin'}),
    onEvent: event => events.push(event),
    onStatus: status => statuses.push(status),
    WebSocketClass: FakeWebSocket,
  });

  connection.start();
  const socket = FakeWebSocket.instances.at(-1);
  assert.equal(socket.url, 'wss://chat.test/ws');
  assert.equal(statuses.at(-1).state, 'connecting');
  socket.open();
  assert.deepEqual(socket.sent[0], {
    version: 2,
    channel: 'general',
    type: 'join',
    CurrentUser: {
      id: 17,
      guestId: null,
      firstname: null,
      lastname: null,
      nickname: 'Alice',
      emblem: null,
    },
  });
  assert.equal(statuses.at(-1).state, 'joining', 'socket open is not chat admission');

  socket.receive({version: 2, type: 'history', channel: 'other', messages: []});
  socket.receive('{broken json');
  assert.equal(events.length, 0, 'wrong-channel and malformed events must be ignored');

  socket.receive({version: 2, type: 'joined', channel: 'general', participantId: 'user:17'});
  assert.equal(statuses.at(-1).state, 'connected');

  const firstId = connection.sendMessage('hello');
  const secondId = connection.sendMessage('hello');
  assert.equal(typeof firstId, 'string');
  assert.notEqual(firstId, secondId, 'separate messages must have separate IDs');
  const sentMessages = socket.sent.filter(payload => payload.type === 'message');
  assert.equal(sentMessages[0].clientMessageId, firstId);
  assert.equal(sentMessages[0].CurrentUser.nickname, 'Alice');

  assert.equal(connection.editMessage('41', 'corrected'), true);
  assert.deepEqual(socket.sent.at(-1), {version: 2, channel: 'general', type: 'edit_message', messageId: '41', text: 'corrected'});
  assert.equal(connection.deleteMessage('41'), true);
  assert.deepEqual(socket.sent.at(-1), {version: 2, channel: 'general', type: 'delete_message', messageId: '41'});
  socket.throwForType = 'edit_message';
  assert.equal(connection.editMessage('41', 'retry'), false, 'failed edit send must preserve UI state for retry');

  socket.throwForType = 'message';
  assert.equal(connection.sendMessage('retry me'), false, 'failed send must preserve the draft');
  const failedId = socket.attempted.at(-1).clientMessageId;
  const retriedId = connection.sendMessage('retry me');
  assert.equal(retriedId, failedId, 'retry must reuse the failed message identity');

  assert.equal(connection.renameChat('Renamed'), true);
  assert.equal(connection.setAnonymousAllowed(false), true);
  assert.equal(connection.setConfirmationRequired(true), true);
  assert.equal(connection.approve('user:22'), true);
  assert.equal(connection.kick('user:23'), true);
  connection.typing(true);
  assert.deepEqual(
    socket.sent.slice(-6).map(({type, name, allowed, required, participantId, typing}) => ({type, name, allowed, required, participantId, typing})),
    [
      {type: 'rename', name: 'Renamed', allowed: undefined, required: undefined, participantId: undefined, typing: undefined},
      {type: 'set_anonymous', name: undefined, allowed: false, required: undefined, participantId: undefined, typing: undefined},
      {type: 'set_confirmation', name: undefined, allowed: undefined, required: true, participantId: undefined, typing: undefined},
      {type: 'approve', name: undefined, allowed: undefined, required: undefined, participantId: 'user:22', typing: undefined},
      {type: 'kick', name: undefined, allowed: undefined, required: undefined, participantId: 'user:23', typing: undefined},
      {type: 'typing', name: undefined, allowed: undefined, required: undefined, participantId: undefined, typing: true},
    ],
  );

  socket.receive({version: 2, type: 'join_pending', channel: 'general', participantId: 'user:17'});
  assert.equal(statuses.at(-1).state, 'pending');
  socket.receive({version: 2, type: 'join_approved', channel: 'general', participantId: 'user:17'});
  assert.equal(statuses.at(-1).state, 'connected');

  socket.receive({version: 2, type: 'presence', channel: 'general', selfId: 'user:17', participants: []});
  socket.receive({version: 2, type: 'participant_kicked', channel: 'general', participantId: 'user:99', message: {}});
  assert.notEqual(statuses.at(-1).state, 'kicked', 'another participant kick must not change self status');
  socket.receive({version: 2, type: 'participant_kicked', channel: 'general', participantId: 'user:17', message: {}});
  assert.equal(statuses.at(-1).state, 'kicked');
  const reconnectingBeforeClose = statuses.filter(status => status.state === 'reconnecting').length;
  socket.close({code: 4000, reason: 'kicked', wasClean: true});
  assert.equal(statuses.filter(status => status.state === 'reconnecting').length, reconnectingBeforeClose, 'kicked socket must not reconnect automatically');

  connection.reconnect();
  const replacement = FakeWebSocket.instances.at(-1);
  replacement.open();
  assert.equal(statuses.at(-1).state, 'joining');
  replacement.receive({version: 2, type: 'joined', channel: 'general', participantId: 'user:17'});
  replacement.close({code: 1006, reason: 'network', wasClean: false});
  assert.equal(statuses.at(-1).state, 'reconnecting');
  const retryTimer = [...timers.values()].find(timer => timer.delay === 11000);
  assert.ok(retryTimer, 'network close must schedule the first reconnect attempt');
  retryTimer.callback();
  assert.equal(FakeWebSocket.instances.length, 3, 'retry timer must create a replacement socket');

  const latest = FakeWebSocket.instances.at(-1);
  latest.open();
  latest.receive({version: 2, type: 'error', error: 'Rejected'});
  assert.equal(statuses.at(-1).state, 'error');
  assert.equal(events.at(-1).error, 'Rejected');

  connection.stop();
  console.log('Chat transport contract satisfied');
} finally {
  globalThis.setTimeout = realSetTimeout;
  globalThis.clearTimeout = realClearTimeout;
}
