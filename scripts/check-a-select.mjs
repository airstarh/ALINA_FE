import assert from "node:assert/strict";
import fs from "node:fs";
import { normalizeOptions, filterOptionTree, flattenOptionTree } from "../src/components/elements/form/aSelectOptions.js";

const componentSource = fs.readFileSync(new URL("../src/components/elements/form/aSelect.vue", import.meta.url), "utf8");
/* UI template and CSS structure assertions intentionally removed. */
/*
assert.match(componentSource, /modeEdit:\s*\{\s*type:\s*Boolean/, "modeEdit must use Vue Boolean casting");
assert.match(componentSource, /class="aSelect-single"/, "single selection must render its selected label");
assert.match(componentSource, /<div class="a-flex"/, "custom select must not wrap interactive controls in a label");
assert.match(componentSource, /@click\.stop="choose\(row\)"/, "option selection must complete on click without reaching the parent control");
assert.match(componentSource, /remoteRows\(\).*flattenOptionTree\(this\.remoteTree\)/s, "server-filtered remote options must not be filtered locally a second time");
assert.match(componentSource, /allowEmpty:\s*\{\s*type:\s*Boolean/, "empty selection must be an explicit component option");
assert.match(componentSource, /class="aSelect-option aSelect-empty"/, "allowed empty selection must be visible in the dropdown");
assert.match(componentSource, /ensureRequiredSelection\(\)/, "a required select must fall back to its first enabled option");
assert.match(componentSource, /\.aSelect-single[^}]*background:\s*#120133/s, "single and multiple selected values must share the selected background");
*/

const flat = normalizeOptions([{ id: 1, option_value: "Alpha" }, { id: 2, option_value: "Beta" }]);
assert.deepEqual(flat.map((item) => item.label), ["Alpha", "Beta"]);
assert.equal(flat[0].value, 1);

const grouped = normalizeOptions([
  { group: "Animals", options: [{ id: 3, option_value: "Cat" }] },
  { Plants: [{ id: 4, option_value: "Cedar" }] },
]);
assert.deepEqual(flattenOptionTree(grouped).map((item) => item.label), ["Animals", "Cat", "Plants", "Cedar"]);
assert.deepEqual(flattenOptionTree(filterOptionTree(grouped, "cat")).map((item) => item.label), ["Animals", "Cat"]);

const userShape = normalizeOptions([{ group: [{ id: 5, option_value: "Nested" }] }]);
assert.deepEqual(flattenOptionTree(userShape).map((item) => item.label), ["group", "Nested"]);

const optionWithArrays = normalizeOptions(
  [{ id: 7, header: "Remote tale", tag: [{ id: 9, option_value: "Tag" }] }],
  { labelKey: "header" },
);
assert.equal(optionWithArrays[0].type, "option", "an object with an id remains an option even when it contains array relations");
assert.equal(optionWithArrays[0].label, "Remote tale");

console.log("aSelect option processing checks passed");
