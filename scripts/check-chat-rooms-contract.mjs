import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse} from '@vue/compiler-sfc';

globalThis.window ??= {location: {href: 'https://zero.home:50443/#/chat/rooms'}, navigator: {userAgent: 'contract'}};

let refreshChatIdentity;
let createChatRoomsConnection;
let createChatRoomTarget;
let nextChatSidebar;
let prioritizeCurrentRoom;
let isRoomMentionUnread;
let prioritizeUnreadRooms;
try {
  ({refreshChatIdentity} = await import('../src/components/Chat/chatIdentity.js'));
  ({createChatRoomsConnection} = await import('../src/components/Chat/chatRoomsConnection.js'));
  ({createChatRoomTarget} = await import('../src/components/Chat/chatRoomCreation.js'));
  ({nextChatSidebar} = await import('../src/components/Chat/chatSidebar.js'));
  ({prioritizeCurrentRoom} = await import('../src/components/Chat/chatRoomDirectory.js'));
  ({isRoomMentionUnread, prioritizeUnreadRooms} = await import('../src/components/Chat/chatRoomMentions.js'));
} catch {
  // Assertions below provide a stable RED failure while the feature is absent.
}

assert.equal(typeof refreshChatIdentity, 'function', 'shared chat identity refresh must exist');
assert.equal(typeof createChatRoomsConnection, 'function', 'room directory transport must exist');
assert.equal(typeof createChatRoomTarget, 'function', 'new-room route generator must exist');
assert.equal(typeof nextChatSidebar, 'function', 'narrow chat sidebar switcher must exist');
assert.deepEqual(prioritizeCurrentRoom([{channel: 'a'}, {channel: 'b'}], 'b').map(room => room.channel), ['b', 'a'], 'entered room must be rendered first');
assert.deepEqual(prioritizeCurrentRoom([{channel: 'a'}, {channel: 'b'}], 'missing').map(room => room.channel), ['a', 'b'], 'unknown room must preserve server order');
assert.equal(isRoomMentionUnread({isMentioned: true, latestMentionAt: 200}, 100), true, 'a newer mention must highlight a room');
assert.equal(isRoomMentionUnread({isMentioned: true, latestMentionAt: 200}, 200), false, 'an opened mention must stop highlighting a room');
assert.equal(isRoomMentionUnread({isMentioned: false, latestMentionAt: null}, 0), false, 'ordinary rooms must remain calm');
assert.deepEqual(
  prioritizeUnreadRooms([
    {channel: 'latest', isMentioned: false, latestMentionAt: null},
    {channel: 'tagged-old', isMentioned: true, latestMentionAt: 100},
    {channel: 'tagged-new', isMentioned: true, latestMentionAt: 300},
    {channel: 'seen', isMentioned: true, latestMentionAt: 200},
  ], {seen: 200}).map(room => room.channel),
  ['tagged-old', 'tagged-new', 'latest', 'seen'],
  'unread mentioned rooms must move first without changing order inside either group',
);
assert.equal(nextChatSidebar('', 'people'), 'people', 'people button must open the people drawer');
assert.equal(nextChatSidebar('people', 'people'), '', 'clicking the active people button must close its drawer');
assert.equal(nextChatSidebar('people', 'rooms'), 'rooms', 'opening rooms must close people and open rooms');
assert.equal(nextChatSidebar('rooms', 'people'), 'people', 'opening people must close rooms and open people');
assert.deepEqual(createChatRoomTarget('  Human room  ', 17, 'test-id'), {
  path: '/chat',
  query: {channel: 'room_17_test-id', name: 'Human room'},
});
assert.equal(createChatRoomTarget('   ', 17, 'test-id'), null, 'blank room names must be rejected');
assert.equal(createChatRoomTarget('x'.repeat(201), 17, 'test-id'), null, 'room names over 200 characters must be rejected');
assert.equal(createChatRoomTarget('Human room', null, 'test-id'), null, 'anonymous users must not create rooms');

const originalFetch = globalThis.fetch;
let fetched;
globalThis.fetch = async (url, options) => {
  fetched = {url: String(url), options};
  return {ok: true, json: async () => ({CurrentUser: {id: 17, nickname: 'Alice', token: 'new-token', emblem: '/alice.webp'}})};
};
const user = {
  attributes: {id: 17, token: 'old-token'},
  applyAttributes(attributes) { this.attributes = {...this.attributes, ...attributes}; },
};
await refreshChatIdentity(user, 'https://zero.home:50443/apps/vue/', new AbortController().signal);
assert.equal(fetched.url, 'https://zero.home:50443/root/status?isAjax=1');
assert.equal(fetched.options.credentials, 'include');
assert.equal(fetched.options.headers.uid, '17');
assert.equal(fetched.options.headers.token, 'old-token');
assert.equal(fetched.options.headers['x-requested-with'], 'AlinaFetchApi');
assert.equal(user.attributes.emblem, '/alice.webp', 'complete CurrentUser response must be applied');
globalThis.fetch = originalFetch;

class FakeWebSocket {
  static OPEN = 1;
  static instances = [];
  constructor(url) { this.url = url; this.readyState = 0; this.sent = []; FakeWebSocket.instances.push(this); }
  open() { this.readyState = FakeWebSocket.OPEN; this.onopen?.(); }
  send(payload) { this.sent.push(JSON.parse(payload)); }
  receive(payload) { this.onmessage?.({data: typeof payload === 'string' ? payload : JSON.stringify(payload)}); }
  fail() { this.onerror?.(); }
  close(event = {code: 1006}) { this.readyState = 3; this.onclose?.(event); }
}

const statuses = [];
const responses = [];
const pagination = {
  mine: {limit: 25, offset: 50},
  others: {limit: 1000, offset: 0},
};
const connection = createChatRoomsConnection({
  url: 'wss://zero.home:50443/ws',
  getUser: () => ({id: 17, nickname: 'Alice', token: 'private'}),
  getPagination: () => pagination,
  onRooms: rooms => responses.push(rooms),
  onStatus: status => statuses.push(status),
  WebSocketClass: FakeWebSocket,
});

connection.start();
const first = FakeWebSocket.instances.at(-1);
assert.equal(statuses.at(-1).state, 'connecting');
first.open();
assert.deepEqual(first.sent[0], {
  version: 2,
  type: 'list_rooms',
  CurrentUser: {id: 17, guestId: null, firstname: null, lastname: null, nickname: 'Alice', emblem: null},
  pagination,
});
assert.equal(statuses.at(-1).state, 'loading');

first.receive('{bad json');
first.receive({version: 1, type: 'rooms'});
assert.equal(responses.length, 0, 'malformed and wrong-version events must be ignored');
const payload = {mine: {rows: [], total: 0, limit: 25, offset: 50}, others: {rows: [], total: 0, limit: 1000, offset: 0}};
first.receive({version: 2, type: 'rooms', ...payload});
assert.deepEqual(responses[0], payload);
assert.equal(statuses.at(-1).state, 'connected');

first.fail();
assert.equal(statuses.at(-1).state, 'error');
connection.retry();
const second = FakeWebSocket.instances.at(-1);
assert.notEqual(second, first, 'manual retry must replace the socket');
first.receive({version: 2, type: 'rooms', ...payload});
assert.equal(responses.length, 1, 'stale socket responses must be ignored');
connection.stop();
assert.equal(second.onopen, null);
assert.equal(second.onmessage, null);

const routerSource = readFileSync(new URL('../src/router.js', import.meta.url), 'utf8');
assert.match(routerSource, /path:\s*["']\/chat\/rooms["']/, 'router must expose /chat/rooms');
const roomsRouteSource = routerSource.match(/\{\s*path:\s*["']\/chat\/rooms["'][\s\S]*?\n\s*\}/)?.[0] || '';
assert.doesNotMatch(roomsRouteSource, /meta:\s*\{\s*chat:\s*true\s*\}/, 'room directory must use normal document scrolling instead of the locked chat-room layout');

for (const relativePath of ['../src/views/Chat/rooms.vue', '../src/components/Chat/ChatRoomsDirectory.vue', '../src/components/Chat/ChatRoomsTable.vue']) {
  const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  const {descriptor, errors} = parse(source, {filename: relativePath});
  assert.deepEqual(errors, [], `${relativePath} must parse as a Vue SFC`);
  assert.ok(descriptor.template?.content, `${relativePath} must have a template`);
}

const tableSource = readFileSync(new URL('../src/components/Chat/ChatRoomsTable.vue', import.meta.url), 'utf8');
assert.match(tableSource, /text-nowrap/, 'latest-message date must not wrap');
assert.doesNotMatch(tableSource, /<thead>/, 'compact room list must not render a table heading');
assert.doesNotMatch(tableSource, /\$t\(['"]TOTAL['"]\)/, 'compact room list must not render a totals row');
assert.match(tableSource, /\{\{\s*\$t\(['"]i_people['"]\)\s*\}\}\s*\{\{\s*room\.participantCount\s*\}\}/, 'participant icon and count must follow the chat name');
assert.match(tableSource, /🕒\s*\{\{\s*formatDate\(room\.latestMessageAt\)\s*\}\}/, 'clock icon must precede the latest-message date');
assert.match(tableSource, /'is-current':\s*room\.channel\s*===\s*currentChannel/, 'current room must receive a dedicated background class');
assert.match(tableSource, /\.chat-room-sidebar-item\.is-current[\s\S]*background:\s*#203d62/, 'current compact room must use the own-message background');
assert.match(tableSource, /\.chat-room-table-row\.is-current[\s\S]*background:\s*#203d62/, 'current full-list room must use the own-message background');
const roomPageSource = readFileSync(new URL('../src/views/Chat/rooms.vue', import.meta.url), 'utf8');
assert.match(roomPageSource, /chat-rooms-page/, 'room directory must expose its compact page wrapper');
assert.match(roomPageSource, /class="container chat-rooms-page"/, 'room directory must use the established responsive ALINA page width');
assert.doesNotMatch(roomPageSource, /container-fluid chat-rooms-page/, 'room directory must not stretch across the full desktop viewport');
assert.doesNotMatch(roomPageSource, /overflow-y:\s*auto/, 'room directory must not create a nested vertical scrollbar');
assert.match(roomPageSource, /v-if="user\.attributes\.id"[^>]*class="[^"]*chat-room-create[^"]*"/, 'new-room form must be restricted to logged-in users');
assert.match(roomPageSource, /maxlength="200"/, 'new room human name must be limited to 200 characters');
assert.match(roomPageSource, /createChatRoomTarget/, 'new-room form must generate its route automatically');
assert.match(roomPageSource, /router\.push\(target\)/, 'new room must open in the current SPA context');
const chatViewSource = readFileSync(new URL('../src/views/Chat/index.vue', import.meta.url), 'utf8');
assert.match(chatViewSource, /<Chat\s+:channel="channel"\s+:title="title"/, 'chat route must pass the requested human name into the room');
const chatPageSource = readFileSync(new URL('../src/views/Chat/index.vue', import.meta.url), 'utf8');
assert.match(chatPageSource, /padding:\s*2px/, 'chat page must use two-pixel page padding');
const chatComponentSource = readFileSync(new URL('../src/components/Chat/index.vue', import.meta.url), 'utf8');
assert.match(chatComponentSource, /connection\?\.renameChat\(requestedName\)/, 'newly joined generated room must persist its requested human name');
assert.match(tableSource, /class="table-responsive"/, 'room tables must use the existing responsive-table class');
assert.match(tableSource, /<table class="[^"]*table-dark[^"]*">/, 'room tables must retain the current dark treatment');
assert.doesNotMatch(tableSource, /target="_blank"/, 'room links must stay in the current SPA context');
assert.match(tableSource, /offset\s*\+\s*index\s*\+\s*1/, 'row numbering must include section offset');
assert.match(tableSource, /participantCount/, 'table must render participant totals');
assert.match(tableSource, /latestMessageAt/, 'table must render latest-message dates');
assert.match(tableSource, /rowspan="2"/, 'each chat order number must span both compact rows');
assert.match(tableSource, /<template v-for="\(room, index\) in rows"/, 'each chat must render as a two-row template');
assert.match(tableSource, /room\.chatName[\s\S]*room\.participantCount/, 'chat name row must include participant count');
assert.match(tableSource, /:colspan="canDelete \? 2 : 1"/, 'chat name must span all columns after the order number');
assert.match(tableSource, /UtilsDate\.dateObjFormat/, 'chat room dates must use ALINA date formatting');
assert.match(tableSource, /['"]yyyy-MM-dd HH:mm['"]/, 'chat room dates must use the established YYYY-MM-DD HH:mm format');
assert.doesNotMatch(tableSource, /v-html/, 'multibyte chat names must use safe text rendering');

const roomsPageSource = readFileSync(new URL('../src/views/Chat/rooms.vue', import.meta.url), 'utf8');
assert.doesNotMatch(roomsPageSource, /chatRooms\.css/, 'room directory must not load a custom stylesheet');

console.log('PASS: chat room identity refresh and WebSocket transport contract');
