import assert from "node:assert/strict";
import fs from "node:fs";

import UtilsArray from "../src/Utils/UtilsArray.js";
import UtilsFS from "../src/Utils/UtilsFS.js";

assert.equal(UtilsFS.formatFileSize(null), "", "unknown historical sizes must stay blank");
assert.equal(UtilsFS.formatFileSize(0), "0 B", "an empty file must be distinguishable from an unknown size");
assert.equal(UtilsFS.formatFileSize(1023), "1023 B");
assert.equal(UtilsFS.formatFileSize(1024), "1 KB");
assert.equal(UtilsFS.formatFileSize(1536), "1.5 KB");
assert.equal(UtilsFS.formatFileSize(1024 * 1024), "1 MB");

const existingFiles = [{ id: 1 }, { id: 2 }];
UtilsArray.vueSensitivePrepend(existingFiles, [{ id: 4 }, { id: 3 }]);
assert.deepEqual(existingFiles.map((file) => file.id), [4, 3, 1, 2], "new upload response rows must appear first");

const uploaderSource = fs.readFileSync(
  new URL("../src/components/elements/form/AlinaFileUploader.vue", import.meta.url),
  "utf8",
);

assert.match(
  uploaderSource,
  /<aInput[\s\S]*?:modeEdit="modeEdit"[\s\S]*?@change="onChangeFileField"/,
  "upload availability must follow the parent form edit mode, not file-list ordering mode",
);
assert.match(
  uploaderSource,
  /dOwnLength:\s*this\.ownLength/,
  "the uploader must keep a local file count that can react immediately to upload and deletion",
);
assert.match(
  uploaderSource,
  /ownLength\(newValue\)[\s\S]*?this\.dOwnLength\s*=\s*newValue/,
  "the local file count must remain synchronized when the parent count changes",
);

console.log("file size and newest-first list checks passed");
