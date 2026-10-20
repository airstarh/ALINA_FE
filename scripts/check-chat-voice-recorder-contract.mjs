import assert from 'node:assert/strict';
import {chooseVoiceFormat, createVoiceRecorder} from '../src/components/Chat/chatVoiceRecorder.js';

class FakeFile {
  constructor(chunks, name, options = {}) { this.chunks = chunks; this.name = name; this.type = options.type; this.size = chunks.reduce((sum, chunk) => sum + (chunk.size || 0), 0); }
}
class FakeRecorder {
  static supported = new Set();
  static isTypeSupported(type) { return this.supported.has(type); }
  constructor(stream, options) { this.stream = stream; this.mimeType = options.mimeType; this.state = 'inactive'; }
  start() { this.state = 'recording'; }
  stop() { this.state = 'inactive'; }
  emitChunk(size = 4) { this.ondataavailable?.({data: {size, type: this.mimeType}}); }
  finish() { this.onstop?.(); }
}

FakeRecorder.supported = new Set(['audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/mp4']);
assert.deepEqual(chooseVoiceFormat(FakeRecorder), {mimeType: 'audio/webm;codecs=opus', extension: 'webm'});
FakeRecorder.supported = new Set(['audio/ogg;codecs=opus', 'audio/mp4']);
assert.deepEqual(chooseVoiceFormat(FakeRecorder), {mimeType: 'audio/ogg;codecs=opus', extension: 'ogg'});
FakeRecorder.supported = new Set(['audio/mp4']);
assert.deepEqual(chooseVoiceFormat(FakeRecorder), {mimeType: 'audio/mp4', extension: 'm4a'});

let timerCallback;
let timerDelay;
let cleared = 0;
let completed = [];
let states = [];
const track = {stopped: 0, stop() { this.stopped++; }};
const stream = {getTracks: () => [track]};
FakeRecorder.supported = new Set(['audio/webm;codecs=opus']);
const recorder = createVoiceRecorder({
  mediaDevices: {getUserMedia: async constraints => { assert.deepEqual(constraints, {audio: true}); return stream; }},
  MediaRecorderClass: FakeRecorder,
  FileClass: FakeFile,
  setTimeoutFn: (callback, delay) => { timerCallback = callback; timerDelay = delay; return 7; },
  clearTimeoutFn: id => { assert.equal(id, 7); cleared++; },
  onComplete: file => completed.push(file),
  onState: state => states.push(state),
});
assert.equal(await recorder.start(), true);
assert.equal(recorder.isRecording(), true);
assert.equal(timerDelay, 300000);
assert.deepEqual(states, ['recording']);
recorder.recorder().emitChunk(5);
assert.equal(recorder.stop(), true);
assert.equal(completed.length, 0, 'completion must wait for MediaRecorder stop event');
recorder.recorder().emitChunk(3);
recorder.recorder().finish();
assert.equal(completed.length, 1);
assert.equal(completed[0].name.endsWith('.webm'), true);
assert.equal(completed[0].type, 'audio/webm;codecs=opus');
assert.equal(completed[0].size, 8);
assert.equal(track.stopped, 1);
assert.equal(cleared, 1);
assert.deepEqual(states, ['recording', 'processing', 'idle']);
assert.equal(recorder.stop(), false, 'manual double-stop must be ignored');
timerCallback();
assert.equal(completed.length, 1, 'timeout after manual stop must not complete twice');

let autoCompleted = 0;
const autoTrack = {stopped: 0, stop() { this.stopped++; }};
const auto = createVoiceRecorder({
  mediaDevices: {getUserMedia: async () => ({getTracks: () => [autoTrack]})}, MediaRecorderClass: FakeRecorder, FileClass: FakeFile,
  setTimeoutFn: callback => { timerCallback = callback; return 9; }, clearTimeoutFn: () => {}, onComplete: () => autoCompleted++,
});
await auto.start();
auto.recorder().emitChunk();
timerCallback();
auto.recorder().finish();
assert.equal(autoCompleted, 1, 'five-minute timeout must auto-complete');

let cancelledCompletion = 0;
const cancelTrack = {stopped: 0, stop() { this.stopped++; }};
const cancellable = createVoiceRecorder({
  mediaDevices: {getUserMedia: async () => ({getTracks: () => [cancelTrack]})}, MediaRecorderClass: FakeRecorder, FileClass: FakeFile,
  setTimeoutFn: () => 11, clearTimeoutFn: () => {}, onComplete: () => cancelledCompletion++,
});
await cancellable.start();
cancellable.cancel();
cancellable.recorder().emitChunk();
cancellable.recorder().finish();
assert.equal(cancelTrack.stopped, 1);
assert.equal(cancelledCompletion, 0, 'cancel must discard the recording');

let resolvePermission;
let permissionRequests = 0;
const pending = createVoiceRecorder({
  mediaDevices: {getUserMedia: () => {
    permissionRequests++;
    if (permissionRequests > 1) return Promise.resolve({getTracks: () => []});
    return new Promise(resolve => { resolvePermission = resolve; });
  }},
  MediaRecorderClass: FakeRecorder, FileClass: FakeFile, setTimeoutFn: () => 13, clearTimeoutFn: () => {},
});
const firstStart = pending.start();
assert.equal(await pending.start(), false, 'a second start must be rejected while microphone permission is pending');
assert.equal(permissionRequests, 1, 'only one browser permission request may be active');
pending.cancel();
const pendingTrack = {stopped: 0, stop() { this.stopped++; }};
resolvePermission({getTracks: () => [pendingTrack]});
assert.equal(await firstStart, false, 'a cancelled pending permission request must not start recording');
assert.equal(pendingTrack.stopped, 1, 'a stream granted after cancellation must be released');

console.log('Chat voice recorder contract passed.');
