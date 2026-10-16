export const VIDEO_PREVIEW_TIME_SECONDS = 0.1;

const videoMimeTypes = {
  mp4: "video/mp4",
  m4v: "video/mp4",
  f4v: "video/mp4",
  webm: "video/webm",
  ogv: "video/ogg",
  ogg: "video/ogg",
  mov: "video/quicktime",
  qt: "video/quicktime",
  avi: "video/x-msvideo",
  wmv: "video/x-ms-wmv",
  asf: "video/x-ms-asf",
  flv: "video/x-flv",
  mkv: "video/x-matroska",
  mpg: "video/mpeg",
  mpeg: "video/mpeg",
  mpe: "video/mpeg",
  mpv: "video/mpeg",
  m2v: "video/mpeg",
  mpa: "video/mpeg",
  vob: "video/mpeg",
  "3gp": "video/3gpp",
  "3g2": "video/3gpp2",
  ts: "video/mp2t",
  mts: "video/mp2t",
  m2ts: "video/mp2t",
  m3u8: "application/vnd.apple.mpegurl",
  rm: "application/vnd.rn-realmedia",
  rmvb: "application/vnd.rn-realmedia-vbr",
  divx: "video/divx",
};

const videoExtensions = Object.keys(videoMimeTypes).join("|");
const videoUrlPattern = new RegExp(
  `^https?:\\/\\/.+\\.(${videoExtensions})(?:[?#].*)?$`,
  "i",
);

function escapeHtmlAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function previewUrl(url) {
  const urlWithoutFragment = url.split("#", 1)[0];
  return `${urlWithoutFragment}#t=${VIDEO_PREVIEW_TIME_SECONDS}`;
}

export const videoEmbedProvider = {
  name: "allVideo",
  url: [videoUrlPattern],
  html: (match) => {
    const sourceUrl = escapeHtmlAttribute(previewUrl(match[0]));
    const extension = match[1].toLowerCase();
    const mimeType = videoMimeTypes[extension];

    return (
      '<figure class="alina-figure-content">' +
      '<video controls style="width: 100%; min-height: 45vh; margin: 0 auto; text-align: center;" preload="metadata" playsinline>' +
      `<source src="${sourceUrl}" type="${mimeType}">` +
      "</video>" +
      "</figure>"
    );
  },
};
