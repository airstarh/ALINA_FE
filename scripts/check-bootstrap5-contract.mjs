import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src");
const violations = [];
const forbidden = [
  ["BootstrapVue 2 import", /["']bootstrap-vue["']/],
  ["no-gutters", /\bno-gutters\b/],
  ["left/right spacing utility", /\b(?:ml|mr|pl|pr)-\d+\b/],
  ["left/right text utility", /\btext-(?:left|right)\b/],
  ["legacy input-group wrapper", /\binput-group-(?:prepend|append)\b/],
  ["legacy custom control", /\bcustom-control(?:-[\w-]+)?\b/],
  ["legacy block button", /\bbtn-block\b/],
  ["legacy pill badge", /\bbadge-pill\b/],
  ["removed BootstrapVue button alias", /<\/?b-btn\b/],
  ["removed BootstrapVue icon component", /<\/?b-icon(?:-|\b)/],
];

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

for (const file of walk(root).filter((file) => /\.(vue|js|scss|css)$/.test(file))) {
  const source = fs.readFileSync(file, "utf8");
  for (const [label, pattern] of forbidden) {
    if (pattern.test(source)) violations.push(`${path.relative(process.cwd(), file)}: ${label}`);
  }
}

if (violations.length) {
  console.error("Bootstrap 5 contract violations:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log("Bootstrap 5 contract satisfied");
