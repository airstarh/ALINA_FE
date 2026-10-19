import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse} from '@vue/compiler-sfc';

globalThis.window ??= {location: {href: 'https://zero.home:50443/#/chat/rooms'}, navigator: {userAgent: 'contract'}};

let refreshChatIdentity;
let createChatRoomsConnection;
try {
  ({refreshChatIdentity} = await import('../src/components/Chat/chatIdentity.js'));
  ({createChatRoomsConnection} = await import('../src/components/Chat/chatRoomsConnection.js'));
} catch {
  // Assertions below provide a stable RED failure while the feature is absent.
}

assert.equal(typeof refreshChatIdentity, 'function', 'shared chat identity refresh must exist');
assert.equal(typeof createChatRoomsConnection, 'function', 'room directory transport must exist');

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

for (const relativePath of ['../src/views/Chat/rooms.vue', '../src/components/Chat/ChatRoomsTable.vue']) {
  const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  const {descriptor, errors} = parse(source, {filename: relativePath});
  assert.deepEqual(errors, [], `${relativePath} must parse as a Vue SFC`);
  assert.ok(descriptor.template?.content, `${relativePath} must have a template`);
}

const tableSource = readFileSync(new URL('../src/components/Chat/ChatRoomsTable.vue', import.meta.url), 'utf8');
assert.match(tableSource, /class="table-responsive"/, 'room tables must use the existing responsive-table class');
assert.match(tableSource, /class="table table-dark table-striped table-hover table-sm"/, 'room tables must use the established ALINA table treatment');
assert.match(tableSource, /target="_blank"/, 'room links must open in a new tab');
assert.match(tableSource, /rel="noopener"/, 'new-tab room links must isolate opener');
assert.match(tableSource, /offset\s*\+\s*index\s*\+\s*1/, 'row numbering must include section offset');
assert.match(tableSource, /participantCount/, 'table must render participant totals');
assert.match(tableSource, /latestMessageAt/, 'table must render latest-message dates');
assert.match(tableSource, /UtilsDate\.dateObjFormat/, 'chat room dates must use ALINA date formatting');
assert.match(tableSource, /['"]yyyy-MM-dd HH:mm['"]/, 'chat room dates must use the established YYYY-MM-DD HH:mm format');
assert.doesNotMatch(tableSource, /v-html/, 'multibyte chat names must use safe text rendering');

const roomsPageSource = readFileSync(new URL('../src/views/Chat/rooms.vue', import.meta.url), 'utf8');
assert.doesNotMatch(roomsPageSource, /chatRooms\.css/, 'room directory must not load a custom stylesheet');

console.log('PASS: chat room identity refresh and WebSocket transport contract');
