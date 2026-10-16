import assert from "node:assert/strict";

let videoEmbedModule;

try {
  videoEmbedModule = await import("../src/components/BorgEditor/videoEmbed.js");
} catch (error) {
  assert.fail(`video embed provider is unavailable: ${error.message}`);
}

const {
  VIDEO_PREVIEW_TIME_SECONDS,
  videoEmbedProvider,
} = videoEmbedModule;

const supportedVideos = [
  ["https://example.test/video.mp4", "video/mp4"],
  ["https://example.test/video.M4V?token=abc", "video/mp4"],
  ["https://example.test/video.webm", "video/webm"],
  ["https://example.test/video.ogv", "video/ogg"],
  ["https://example.test/video.ogg", "video/ogg"],
  ["https://example.test/video.mov", "video/quicktime"],
  ["https://example.test/video.mkv", "video/x-matroska"],
  ["https://example.test/video.avi", "video/x-msvideo"],
  ["https://example.test/video.wmv", "video/x-ms-wmv"],
  ["https://example.test/video.mpg", "video/mpeg"],
  ["https://example.test/video.mpeg", "video/mpeg"],
  ["https://example.test/video.3gp", "video/3gpp"],
  ["https://example.test/video.3g2", "video/3gpp2"],
  ["https://example.test/video.ts", "video/mp2t"],
  ["https://example.test/video.m2ts", "video/mp2t"],
  ["https://example.test/video.m3u8", "application/vnd.apple.mpegurl"],
  ["https://example.test/video.flv", "video/x-flv"],
  ["https://example.test/video.f4v", "video/mp4"],
  ["https://example.test/video.vob", "video/mpeg"],
];

assert.equal(VIDEO_PREVIEW_TIME_SECONDS, 0.1);

for (const [url, mimeType] of supportedVideos) {
  const match = videoEmbedProvider.url[0].exec(url);
  assert.ok(match, `expected video URL to match: ${url}`);

  const html = videoEmbedProvider.html(match);
  const urlWithoutFragment = url.split("#", 1)[0].replaceAll("&", "&amp;");

  assert.match(html, /<video controls[^>]*preload="metadata"[^>]*playsinline>/);
  assert.ok(
    html.includes(`src="${urlWithoutFragment}#t=${VIDEO_PREVIEW_TIME_SECONDS}"`),
    `expected preview URL for ${url}`,
  );
  assert.ok(html.includes(`type="${mimeType}"`), `expected ${mimeType} for ${url}`);
}

assert.equal(videoEmbedProvider.url[0].test("https://example.test/image.jpg"), false);

console.log("Video embed contract satisfied");
