import assert from "node:assert/strict";

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

console.log("file size and newest-first list checks passed");
