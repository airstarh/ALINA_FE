import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const modes = ["default", "sss", "m45a", "vov", "zero", "stage"];
const ignoredDirectories = new Set([".git", "node_modules", "dist", "_GITOUT"]);
const violations = [];
const viteConfig = fs.readFileSync(path.join(root, "vite.config.js"), "utf8");

if (!/chunkFileNames:\s*["']\[hash\]\.js["']/.test(viteConfig)) {
  violations.push("vite.config.js must use hash-only chunk filenames that cannot collide with protected URL prefixes");
}

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    if (ignoredDirectories.has(entry.name)) return [];
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function relative(file) {
  return path.relative(root, file);
}

for (const file of walk(path.join(root, "src"))) {
  if (!/\.(js|vue)$/.test(file)) continue;
  const source = fs.readFileSync(file, "utf8");
  if (/process\.env\.VUE_APP_/.test(source)) {
    violations.push(`${relative(file)} uses process.env.VUE_APP_*`);
  }
}

for (const name of fs.readdirSync(root).filter((name) => /^\.env(?:\..+)?$/.test(name))) {
  const source = fs.readFileSync(path.join(root, name), "utf8");
  if (/^VUE_APP_/m.test(source)) {
    violations.push(`${name} contains VUE_APP_* keys`);
  }
}

for (const mode of modes) {
  const htmlName = mode === "default" ? "index.html" : `index.${mode}.html`;
  if (!fs.existsSync(path.join(root, htmlName))) {
    violations.push(`${htmlName} is missing`);
  } else {
    const html = fs.readFileSync(path.join(root, htmlName), "utf8");
    if (/<%=\s*VITE_APP_/.test(html)) {
      violations.push(`${htmlName} uses Vue CLI interpolation for Vite variables`);
    }
  }

  const siteDirectory = path.join(root, "src", "components", "_specific", mode);
  for (const component of ["MenuHorizontalMain.vue", "Footer.vue"]) {
    if (!fs.existsSync(path.join(siteDirectory, component))) {
      violations.push(`src/components/_specific/${mode}/${component} is missing`);
    }
  }
}

if (violations.length) {
  console.error("Vite migration contract violations:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log("Vite migration contract satisfied");
