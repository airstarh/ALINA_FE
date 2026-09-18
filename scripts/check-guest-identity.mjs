import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import vm from 'node:vm';

const source = readFileSync(new URL('../src/services/GuestIdentity.js', import.meta.url), 'utf8').replace(/\bexport /g, '');
const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const idKey = 'alina.chat.guestId';
function load({secure = false, stored, blocked = false} = {}) {
  const values = new Map(stored ? [[idKey, stored]] : []);
  const context = vm.createContext({
    crypto: secure ? webcrypto : {getRandomValues: webcrypto.getRandomValues.bind(webcrypto)},
    localStorage: {
      getItem(key) { if (blocked) throw new Error('Storage blocked'); return values.get(key) ?? null; },
      setItem(key, value) { if (blocked) throw new Error('Storage blocked'); values.set(key, value); },
    },
  });
  vm.runInContext(source, context);
  return {context, values, id: () => vm.runInContext('guestId()', context)};
}

const http = load();
const id = http.id();
assert.match(id, pattern);
assert.equal(http.id(), id);
assert.equal(http.values.get(idKey), id);
assert.equal(load({stored: id.toUpperCase()}).id(), id);
assert.match(load({stored: 'invalid'}).id(), pattern);
assert.match(load({secure: true}).id(), pattern);
const blocked = load({blocked: true});
assert.match(blocked.id(), pattern);
assert.equal(blocked.id(), blocked.id());
assert.equal(vm.runInContext('guestNickname()', blocked.context), `Guest ${blocked.id().slice(0, 8)}`);
const ids = Array.from({length: 100}, () => load().id());
ids.forEach(value => assert.match(value, pattern));
assert.equal(new Set(ids).size, ids.length);
console.log('Guest identity checks passed: HTTP, HTTPS, persistence, blocked storage, UUID format and uniqueness.');
