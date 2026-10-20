const VOICE_FORMATS = [
  {mimeType: 'audio/webm;codecs=opus', extension: 'webm'},
  {mimeType: 'audio/ogg;codecs=opus', extension: 'ogg'},
  {mimeType: 'audio/mp4', extension: 'm4a'},
];

export function chooseVoiceFormat(MediaRecorderClass) {
  return VOICE_FORMATS.find(format => MediaRecorderClass?.isTypeSupported?.(format.mimeType)) || null;
}

export function createVoiceRecorder({
  mediaDevices = globalThis.navigator?.mediaDevices,
  MediaRecorderClass = globalThis.MediaRecorder,
  FileClass = globalThis.File,
  setTimeoutFn = globalThis.setTimeout,
  clearTimeoutFn = globalThis.clearTimeout,
  maxDurationMs = 300000,
  onComplete = () => {},
  onError = () => {},
  onState = () => {},
} = {}) {
  let mediaRecorder = null;
  let stream = null;
  let timer = null;
  let chunks = [];
  let cancelled = false;
  let finishing = false;
  let starting = false;
  let run = 0;

  function release() {
    if (timer !== null) clearTimeoutFn(timer);
    timer = null;
    stream?.getTracks?.().forEach(track => track.stop());
    stream = null;
  }

  function reset() {
    release();
    chunks = [];
    finishing = false;
    onState('idle');
  }

  async function start() {
    if (starting || mediaRecorder?.state === 'recording' || finishing) return false;
    const format = chooseVoiceFormat(MediaRecorderClass);
    if (!format || !mediaDevices?.getUserMedia || !FileClass) {
      onError(new Error('unsupported'));
      return false;
    }
    cancelled = false;
    chunks = [];
    starting = true;
    const currentRun = ++run;
    try {
      const acquiredStream = await mediaDevices.getUserMedia({audio: true});
      if (cancelled || currentRun !== run) {
        acquiredStream?.getTracks?.().forEach(track => track.stop());
        return false;
      }
      stream = acquiredStream;
      mediaRecorder = new MediaRecorderClass(stream, {mimeType: format.mimeType});
      mediaRecorder.ondataavailable = event => { if (event.data?.size) chunks.push(event.data); };
      mediaRecorder.onerror = event => {
        onError(event.error || new Error('recording'));
        cancelled = true;
        reset();
      };
      mediaRecorder.onstop = () => {
        const discarded = cancelled;
        const recorded = chunks;
        reset();
        if (discarded) return;
        const file = new FileClass(recorded, `voice-${Date.now()}.${format.extension}`, {type: format.mimeType});
        if (!file.size) { onError(new Error('empty')); return; }
        onComplete(file);
      };
      mediaRecorder.start();
      starting = false;
      timer = setTimeoutFn(() => stop(), maxDurationMs);
      onState('recording');
      return true;
    } catch (cause) {
      if (currentRun !== run) return false;
      starting = false;
      release();
      onError(cause);
      onState('idle');
      return false;
    }
  }

  function stop() {
    if (mediaRecorder?.state !== 'recording' || finishing) return false;
    finishing = true;
    if (timer !== null) clearTimeoutFn(timer);
    timer = null;
    onState('processing');
    mediaRecorder.stop();
    return true;
  }

  function cancel() {
    run++;
    starting = false;
    cancelled = true;
    if (timer !== null) clearTimeoutFn(timer);
    timer = null;
    if (mediaRecorder?.state === 'recording') mediaRecorder.stop();
    release();
    chunks = [];
    finishing = false;
    onState('idle');
  }

  return {start, stop, cancel, isRecording: () => mediaRecorder?.state === 'recording' && !finishing, recorder: () => mediaRecorder};
}
