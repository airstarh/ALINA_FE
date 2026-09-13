import fs from "node:fs";
import path from "node:path";

const sourceRoot = path.resolve("src");
const violations = [];
const forbidden = [
  ["Vue default import", /import\s+Vue\s+from\s+["']vue["']/],
  ["Vue 2 root constructor", /new\s+Vue\s*\(/],
  ["Vue.use", /Vue\.use\s*\(/],
  ["Vue.set", /Vue\.set\s*\(/],
  ["Vue.prototype", /Vue\.prototype\b/],
  ["Vue Router 3 constructor", /new\s+Router\s*\(/],
  ["Vuex 3 constructor", /new\s+Vuex\.Store\s*\(/],
  ["Router 3 currentRoute access", /this\.\$router\.currentRoute\.path/],
  ["Vue 2 lifecycle hook", /\bbeforeDestroy\s*\(/],
  ["Vue 2 instance event API", /(?:this|this\.\$root)\.\$on\s*\(/],
  ["Vue 2 template filter", /\{\{[^}\n]*?(?<!\|)\|(?!\|)\s*[A-Za-z_$]/],
  ["Vue 2 date wrapper", /["']vue-date-fns["']/],
  ["Vue 2 input event", /\$emit\s*\(\s*["']input["']/],
  ["recursive Comment self-import", /import\s+Comment\s+from\s+["']@\/components\/elements\/form\/Comment["']/],
  ["browser CommonJS require", /\brequire\s*\(/],
  ["deprecated vue-i18n legacy mode", /legacy\s*:\s*true/],
  ["legacy vue-i18n pluralizationRules option", /pluralizationRules\s*:/],
  ["removed Vue instance reactivity API", /this\.\$(?:set|delete)\s*\(/],
  ["v-if and v-for on the same element", /<[^>]*(?:v-for[^>]*v-if|v-if[^>]*v-for)[^>]*>/s],
];

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

for (const file of walk(sourceRoot).filter((file) => /\.(js|vue)$/.test(file))) {
  const source = fs.readFileSync(file, "utf8");
  for (const [label, pattern] of forbidden) {
    if (pattern.test(source)) {
      violations.push(`${path.relative(process.cwd(), file)}: ${label}`);
    }
  }
}

if (violations.length) {
  console.error("Vue 3 contract violations:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log("Vue 3 core contract satisfied");
