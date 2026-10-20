import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse} from '@vue/compiler-sfc';
import {nextTick, reactive} from 'vue';

import {createChatConnection} from '../src/components/Chat/chatConnection.js';
import {canManageChat, canManageMessage, canRenameGuest} from '../src/components/Chat/chatPermissions.js';
import {
  canKickParticipants,
  canonicalChatUrl,
  createClientMessageId,
  displayName,
  formatChatTimestamp,
  messageParts,
  parseReplyMessage,
  videoChatUrl,
  withoutParticipantMessages,
} from '../src/components/Chat/chatProtocol.js';

let acceptGuestRename, watchChatIdentity;
try {
  ({acceptGuestRename, watchChatIdentity} = await import('../src/components/Chat/chatIdentity.js'));
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
  assert.equal(typeof acceptGuestRename, 'function', 'guest rename synchronization must be available');
  const savedGuestNames = [];
  assert.equal(
    acceptGuestRename(
      {participantId: 'guest:b7c8ea87-34e4-49a1-ae9b-13de4fe35429', nickname: 'CHROMIUM aaa'},
      'guest:b7c8ea87-34e4-49a1-ae9b-13de4fe35429',
      nickname => { savedGuestNames.push(nickname); return nickname; },
    ),
    'CHROMIUM aaa',
    'a socket rename targeting the current guest must replace its local nickname',
  );
  assert.deepEqual(savedGuestNames, ['CHROMIUM aaa']);
  assert.equal(
    acceptGuestRename({participantId: 'guest:other', nickname: 'Other'}, 'guest:self', nickname => savedGuestNames.push(nickname)),
    null,
    'another guest rename must not change the current browser identity',
  );
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
  const ordinary = {participantId: 'user:17', senderType: 'user', senderId: '17'};
  const roleUser = roles => ({
    isAdmin: () => roles.includes('admin'),
    isModerator: () => roles.includes('moderator'),
    isPrivileged: () => roles.includes('privileged'),
    ownsOrAdminOrModeratorOrPrivileged: id => id === '17' || roles.some(role => ['admin', 'moderator', 'privileged'].includes(role)),
  });
  assert.equal(canManageChat(roleUser(['privileged'])), true, 'privileged users must manage chat policy and name');
  assert.equal(canManageChat(roleUser([])), false, 'ordinary registered users must not manage chat policy or name');
  assert.equal(canManageMessage(roleUser([]), ordinary, 'user:17'), true, 'message owners must manage their own message');
  assert.equal(canManageMessage(roleUser(['privileged']), ordinary, 'user:22'), true, 'privileged users must manage other messages');
  assert.equal(canRenameGuest(roleUser(['admin'])), true, 'admins must rename guest authors');
  assert.equal(canRenameGuest(roleUser(['moderator'])), false, 'guest author renaming is admin-only');
  assert.equal(
    displayName({guestId: 'b7c8ea87-34e4-49a1-ae9b-13de4fe35429', nickname: 'CHROMIUM (Guest b7c8ea87)'}, 'guest:b7c8ea87-34e4-49a1-ae9b-13de4fe35429'),
    'CHROMIUM (Guest b7c8ea87)',
    'persisted canonical guest names must not duplicate their Guest suffix',
  );
  assert.deepEqual(
    withoutParticipantMessages([
      {id: '1', participantId: 'user:1'},
      {id: '2', participantId: 'user:2'},
      {id: '3', participantId: 'bot:robocop'},
    ], 'user:2').map(message => message.id),
    ['1', '3'],
    'kick event must remove only the target messages already displayed',
  );
  const canonicalReply = '<div class="reply-quote" data-timestamp="1760958300000"><div class="reply-quote-author">Alice &amp; Bob</div><div class="reply-quote-text">&lt;hello&gt; &quot;world&quot; &#039;ok&#039;</div></div>\nReply body';
  assert.deepEqual(parseReplyMessage(canonicalReply), {
    quote: {author: 'Alice & Bob', timestamp: 1760958300000, text: '<hello> "world" \'ok\''},
    body: 'Reply body',
  }, 'canonical reply must parse into escaped quote metadata and own body');
  const lookalikeReply = '<div class="reply-quote">fake</div>\nbody';
  assert.deepEqual(parseReplyMessage(lookalikeReply), {quote: null, body: lookalikeReply}, 'malformed reply markup must remain ordinary text');
  const localToday = new Date(2026, 9, 20, 13, 5);
  assert.equal(formatChatTimestamp(localToday, new Date(2026, 9, 20, 20, 0)), '13:05', 'today timestamp must show only 24-hour time');
  assert.equal(formatChatTimestamp(localToday, new Date(2026, 9, 21, 1, 0)), '2026-10-20 13:05', 'older timestamp must use the wide 24-hour format');
  assert.deepEqual(messageParts('VOICE:https://zero.home/audio/voice.webm'), [{type: 'voice', url: 'https://zero.home/audio/voice.webm'}], 'explicit voice marker must produce an audio-only part');
  assert.equal(messageParts('https://zero.home/video.webm')[0].type, 'video', 'ordinary WebM links must remain video');
  assert.equal(messageParts('VOICE:javascript:alert(1)')[0].type, 'text', 'unsafe voice markers must remain text');

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
  assert.ok(directive(anonymousControl, 'if')?.exp?.content.includes('canManageChatRoom'), 'ANON button must be restricted to management roles');
  assert.ok(directive(anonymousControl, 'bind', 'class')?.exp?.content.includes('isAnionAllowed'), 'ANON button color must reflect the persisted anonymous-access flag');
  assert.ok(directive(anonymousControl, 'on', 'click'), 'every participant must be able to toggle anonymous access');
  const confirmationControl = elementWithClass(indexComponent, 'chat-confirmation-control');
  assert.ok(confirmationControl, 'chat header must expose the confirmation policy control');
  assert.equal(confirmationControl.tag, 'button', 'confirmation policy control must be a button');
  assert.ok(directive(confirmationControl, 'if')?.exp?.content.includes('canManageChatRoom'), 'OPENED/CLOSED button must be restricted to management roles');
  assert.ok(directive(confirmationControl, 'bind', 'class')?.exp?.content.includes('isConfirmationRequired'), 'OPENED/CLOSED color must reflect the persisted confirmation flag');
  assert.ok(directive(confirmationControl, 'on', 'click'), 'every participant must be able to toggle confirmation policy');
  assert.ok(elementWithClass(indexComponent, 'chat-copy-link'), 'chat header must expose copy-link action');
  assert.ok(elementWithClass(indexComponent, 'chat-video-link'), 'chat header must expose video-chat action');
  const composer = elementWithClass(indexComponent, 'chat-composer-input');
  assert.ok(directive(composer, 'bind', 'disabled')?.exp?.content.includes('connected'), 'pending composer must be disabled');
  const sendControl = elementWithClass(indexComponent, 'chat-send');
  assert.ok(sendControl, 'chat composer must expose a send button');
  assert.ok(indexComponent.template.content.includes("$t('i_save')"), 'send button must use the existing universal save symbol');

  const participantsComponent = componentDescriptor('src/components/Chat/ChatParticipants.vue');
  assert.ok(elementWithClass(participantsComponent, 'chat-approve'), 'join requests must expose approval action');
  assert.ok(elementWithClass(participantsComponent, 'chat-kick'), 'participant rows must expose role-controlled kick action');
  const onlineDot = elementWithClass(participantsComponent, 'chat-online-dot');
  assert.ok(directive(onlineDot, 'bind', 'class')?.exp?.content.includes('person.online'), 'participant icon must reflect origin-wide online state');
  assert.match(participantsComponent.template.content, /person\.typing[^]*Typing…[^]*person\.inChat[^]*In chat[^]*Not in chat/, 'participant words must distinguish typing, in-chat and not-in-chat states');

  const messageComponent = componentDescriptor('src/components/Chat/ChatMessage.vue');
  assert.match(messageComponent.source, /discussion/, 'message card must expose discussion controls');
  assert.match(messageComponent.source, /discussionResponseCount/, 'discussion button must show response count');
  assert.ok(elementWithClass(messageComponent, 'chat-mention-target'), 'structured mention recipient must have dedicated emphasis');
  assert.match(messageComponent.template.content, /mentionNotification[^]*calls you!/, 'structured mention must render localized call wording');
  assert.match(messageComponent.template.content, /part\.type === 'voice'/, 'voice parts must render through a dedicated audio branch');
  assert.ok(elementWithClass(messageComponent, 'chat-avatar-robocop'), 'Robocop message must have a robot avatar treatment');
  const editControl = elementWithClass(messageComponent, 'chat-message-edit');
  const deleteControl = elementWithClass(messageComponent, 'chat-message-delete');
  const replyControl = elementWithClass(messageComponent, 'chat-message-reply');
  const tagControl = elementWithClass(messageComponent, 'chat-message-tag');
  const privateControl = elementWithClass(messageComponent, 'chat-message-private');
  assert.ok(replyControl, 'every message must expose a Reply control');
  assert.ok(tagControl, 'ordinary message authors must expose a TAG action');
  assert.match(tagControl?.children?.[0]?.content?.content || '', /\$t\(['"]i_tag['"]\)/, 'mention action must use the localized i_tag icon');
  assert.ok(privateControl, 'ordinary message authors must expose a PRIVATE action');
  assert.match(privateControl?.children?.[0]?.content?.content || '', /\$t\(['"]i_private['"]\)/, 'private-chat action must use the localized i_private icon');
  assert.equal(staticAttribute(privateControl, 'target'), '_blank', 'PRIVATE must open a new tab');
  assert.ok(directive(replyControl, 'bind', 'disabled')?.exp?.content.includes('replyDisabled'), 'Reply must remain visible but disabled during editing');
  assert.ok(messageComponent.template.content.indexOf('chat-message-reply') < messageComponent.template.content.indexOf('chat-message-actions'), 'Reply must appear left of Edit/Delete controls');
  assert.ok(editControl && deleteControl, 'manageable messages must expose edit and delete footer controls');
  assert.ok(directive(editControl, 'if')?.exp?.content.includes('canManage'), 'edit visibility must be supplied by the parent UI');
  assert.ok(messageComponent.template.content.includes("$t('i_edit')"), 'edit control must use the existing locale icon');
  assert.ok(messageComponent.template.content.includes("$t('i_delete')"), 'delete control must use the existing locale icon');
  assert.ok(messageComponent.template.content.includes('chat-message-editing'), 'active edit target must receive a gray-state class');
  assert.ok(messageComponent.template.content.includes('chat-message-edited'), 'messages edited during this session must receive a persistent state class');
  assert.ok(messageComponent.template.content.includes('chat-message-edited-blinking'), 'fresh edits must receive a temporary blinking class');
  assert.ok(messageComponent.template.content.includes('chat-message-replying'), 'selected reply parent must receive an orange-state class');
  assert.ok(messageComponent.template.content.includes('reply-quote'), 'canonical reply metadata must render as a quote block');
  const messageHeading = elementWithClass(messageComponent, 'chat-message-heading');
  const messageFooter = elementWithClass(messageComponent, 'chat-message-footer');
  const authorLink = elementWithClass(messageComponent, 'chat-message-author');
  assert.ok(authorLink, 'registered message authors must expose a profile link');
  assert.equal(authorLink.tag, 'router-link', 'registered message authors must link through the current-origin Vue router');
  assert.ok((directive(authorLink, 'if') || directive(authorLink, 'else-if'))?.exp?.content.includes('profilePath'), 'guest and bot authors must remain unlinked');
  assert.ok(directive(authorLink, 'bind', 'to')?.exp?.content.includes('profilePath'), 'author link must use the message author profile path');
  assert.equal(staticAttribute(authorLink, 'target'), '_blank', 'author profile links must open in a new tab');
  assert.equal(staticAttribute(authorLink, 'rel'), 'noopener noreferrer', 'new-tab author links must isolate the opener');
  assert.match(messageComponent.scriptSetup.content, /props\.message\.CurrentUser\?\.id/, 'profile link must use the message author ID');
  assert.ok(messageHeading.children.some(child => child.tag === 'time'), 'message timestamp must appear in the nickname row');
  assert.equal(messageFooter.children.some(child => child.tag === 'time'), false, 'message timestamp must not remain in the action footer');
  assert.match(messageComponent.scriptSetup.content, /formatChatTimestamp/, 'message and quote timestamps must share the 24-hour formatter');
  assert.doesNotMatch(messageComponent.scriptSetup.content, /date\.value\.toLocaleString\(\)/, 'message timestamp tooltip must not fall back to locale AM/PM formatting');
  assert.match(indexComponent.scriptSetup.content, /editingMessageId/, 'chat page must track the edited message');
  assert.match(indexComponent.scriptSetup.content, /replyingMessageId/, 'chat page must track exactly one reply parent');
  assert.match(indexComponent.scriptSetup.content, /clearMissingReplySelection/, 'reply mode must clear when its parent leaves the visible message list');
  assert.match(indexComponent.scriptSetup.content, /parseReplyMessage\(message\.msg\)\.body/, 'editing a reply must load only its own body');
  assert.match(indexComponent.scriptSetup.content, /window\.confirm/, 'message deletion must use native browser confirmation');
  assert.match(indexComponent.scriptSetup.content, /message_edited/, 'chat page must apply incoming edits');
  assert.match(indexComponent.scriptSetup.content, /editedMessageIds/, 'chat page must remember edited messages for the current session');
  assert.match(indexComponent.scriptSetup.content, /blinkingMessageIds/, 'chat page must retrigger edit blinking locally');
  assert.match(indexComponent.scriptSetup.content, /message_deleted/, 'chat page must apply incoming deletions');
  assert.match(indexComponent.scriptSetup.content, /appendMention/, 'TAG must reuse structured mention machinery');
  assert.match(indexComponent.scriptSetup.content, /guest_renamed/, 'chat page must apply socket guest renames');
  const chatCss = readFileSync(new URL('../src/components/Chat/chat.css', import.meta.url), 'utf8');
  assert.match(chatCss, /grid-template-columns:\s*auto auto minmax\(0,\s*1fr\) auto auto/, 'composer textarea column must be allowed to shrink fluidly');
  assert.match(chatCss, /clamp\(40px,\s*12vw,\s*56px\)/, 'composer controls must use fluid mobile dimensions');
  assert.match(chatCss, /gap:\s*min\(6px,\s*1vw\)\s+min\(6px,\s*1vw\)/, 'composer gaps must remain compact and fluid');
  assert.match(chatCss, /padding:\s*min\(8px,\s*1\.5vw\)\s+min\(8px,\s*1\.5vw\)/, 'composer outer padding must remain compact and fluid');
  assert.match(chatCss, /\.chat-title\s*\{[^}]*min-width:\s*0[^}]*grid-template-columns:\s*auto auto minmax\(80px,\s*1fr\) auto auto/s, 'chat title row must reserve a shrinkable title column');
  assert.match(chatCss, /\.chat-name-input\s*\{[^}]*grid-column:\s*3/s, 'chat name must occupy the shrinkable third column');
  assert.match(chatCss, /\.chat-message-editing\s*\{[^}]*background:\s*#4f5867/s, 'the active edit target must have a gray background');
  assert.match(chatCss, /\.chat-message-edited\s*\{[^}]*background:\s*#[0-9a-f]{6}/si, 'session-edited messages must retain a dark-green background');
  assert.match(chatCss, /\.chat-message-edited-blinking\s*\{[^}]*animation:[^;}]+\s3\s*;/s, 'fresh edits must blink exactly three times');
  assert.match(chatCss, /\.chat-message-replying\s*\{[^}]*background:\s*#[0-9a-f]{6}/si, 'selected reply parent must have a dark-orange background');
  assert.match(chatCss, /\.reply-quote\s*\{[^}]*border-left:\s*3px[^;]*purple[^}]*color:\s*#[0-9a-f]{6}[^}]*font-size:\s*0\.7rem/s, 'reply quote must have the agreed purple border, gray text and size');
  assert.match(chatCss, /\.alina-chat \.chat-message\s*\{[^}]*margin:\s*0 0 20px/s, 'messages must have 20px vertical spacing');
  assert.match(chatCss, /\.alina-chat \.chat-send\s*\{[^}]*border-radius:\s*50%/s, 'send button must be round');

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
  connection.loadMentionDirectory();
  assert.equal(socket.sent.at(-1).type, 'mentions_directory');
  connection.searchMentions('cod');
  assert.deepEqual(socket.sent.at(-1), {version: 2, channel: 'general', type: 'mentions_search', query: 'cod'});
  const mentionId = connection.sendMessage('@Codex hi', [{senderType: 'user', senderId: '22'}]);
  assert.equal(socket.sent.at(-1).clientMessageId, mentionId);
  assert.deepEqual(socket.sent.at(-1).mentions, [{senderType: 'user', senderId: '22'}]);

  assert.equal(connection.editMessage('41', 'corrected'), true);
  assert.deepEqual(socket.sent.at(-1), {version: 2, channel: 'general', type: 'edit_message', messageId: '41', text: 'corrected'});
  assert.equal(connection.deleteMessage('41'), true);
  assert.deepEqual(socket.sent.at(-1), {version: 2, channel: 'general', type: 'delete_message', messageId: '41'});
  socket.throwForType = 'edit_message';
  assert.equal(connection.editMessage('41', 'retry'), false, 'failed edit send must preserve UI state for retry');

  assert.ok(connection.replyMessage('41', 'reply body'), 'reply send must return its retry-safe client ID');
  const replyPayload = socket.sent.at(-1);
  assert.equal(replyPayload.type, 'reply_message');
  assert.equal(replyPayload.replyToMessageId, '41');
  assert.equal(replyPayload.msg, 'reply body');
  assert.equal(typeof replyPayload.clientMessageId, 'string');
  socket.throwForType = 'reply_message';
  assert.equal(connection.replyMessage('41', 'retry reply'), false, 'failed reply send must preserve selection and draft for retry');
  const failedReplyId = socket.attempted.at(-1).clientMessageId;
  assert.equal(connection.replyMessage('41', 'retry reply'), failedReplyId, 'reply retry must reuse the failed client ID');

  socket.throwForType = 'message';
  assert.equal(connection.sendMessage('retry me'), false, 'failed send must preserve the draft');
  const failedId = socket.attempted.at(-1).clientMessageId;
  const retriedId = connection.sendMessage('retry me');
  assert.equal(retriedId, failedId, 'retry must reuse the failed message identity');

  assert.equal(connection.renameChat('Renamed'), true);
  assert.equal(connection.renameGuest('b7c8ea87-34e4-49a1-ae9b-13de4fe35429', 'CHROMIUM'), true);
  assert.equal(connection.setAnonymousAllowed(false), true);
  assert.equal(connection.setConfirmationRequired(true), true);
  assert.equal(connection.approve('user:22'), true);
  assert.equal(connection.kick('user:23'), true);
  connection.typing(true);
  assert.deepEqual(
    socket.sent.slice(-7).map(({type, name, guestId, allowed, required, participantId, typing}) => ({type, name, guestId, allowed, required, participantId, typing})),
    [
      {type: 'rename', name: 'Renamed', guestId: undefined, allowed: undefined, required: undefined, participantId: undefined, typing: undefined},
      {type: 'rename_guest', name: 'CHROMIUM', guestId: 'b7c8ea87-34e4-49a1-ae9b-13de4fe35429', allowed: undefined, required: undefined, participantId: undefined, typing: undefined},
      {type: 'set_anonymous', name: undefined, guestId: undefined, allowed: false, required: undefined, participantId: undefined, typing: undefined},
      {type: 'set_confirmation', name: undefined, guestId: undefined, allowed: undefined, required: true, participantId: undefined, typing: undefined},
      {type: 'approve', name: undefined, guestId: undefined, allowed: undefined, required: undefined, participantId: 'user:22', typing: undefined},
      {type: 'kick', name: undefined, guestId: undefined, allowed: undefined, required: undefined, participantId: 'user:23', typing: undefined},
      {type: 'typing', name: undefined, guestId: undefined, allowed: undefined, required: undefined, participantId: undefined, typing: true},
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
