import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const component = readFileSync(new URL('../src/components/Chat/index.vue', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/components/Chat/chat.css', import.meta.url), 'utf8');
const locales = readFileSync(new URL('../src/locales/index.js', import.meta.url), 'utf8');

assert.match(component, /class="chat-button chat-voice"/, 'chat composer must expose a microphone button');
assert.match(component, /recordingVoice[\s\S]*i_mic_off[\s\S]*i_mic/, 'microphone button must use localized one-symbol icons');
assert.match(component, /toggleVoiceRecording/, 'microphone button must toggle recording');
assert.match(component, /createVoiceRecorder/, 'chat must use the isolated recorder helper');
assert.match(component, /VOICE:\$\{url\}/, 'uploaded recording must be sent with the explicit VOICE marker');
assert.match(component, /cancelVoiceRecording/, 'chat teardown must cancel unfinished recordings');
assert.match(css, /\.chat-voice\.is-recording\s*\{[^}]*background:[^;}]*#/s, 'active microphone must have a dedicated background');
assert.match(locales, /"Start voice recording"/);
assert.match(locales, /"Stop and send voice recording"/);

console.log('Chat voice UI contract passed.');
