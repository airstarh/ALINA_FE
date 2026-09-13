# Vue 3 and Vite Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run ALINA_FE on standard Vue 3 and Vite while preserving its Options API application code, ALINA site variants, deployment contract, and user-visible behavior.

**Architecture:** Replace the Vue 2 framework boundary and Vue-only integrations while leaving framework-independent services and component business logic intact. Follow ALINA_V's Vite environment and site-loader conventions, migrate shared infrastructure before UI integrations, and verify each subsystem independently.

**Tech Stack:** Vue 3.5+, Vite 8, Vue Router 5, Vuex 4, Vue I18n 11 legacy mode, Bootstrap 5, BootstrapVueNext, CKEditor Vue 3 adapter, vue-yandex-maps Vue 3 line.

**Spec:** `docs/superpowers/specs/2026-09-13-vue3-vite-migration-design.md`

## Global Constraints

- Preserve Options API components; do not broadly convert to Composition API or TypeScript.
- Preserve routes, backend contracts, locale messages, site modes, public paths, and output destinations.
- Rename `VUE_APP_*` to `VITE_APP_*`; browser code reads `import.meta.env`.
- Follow `/home/qqq/_A001/rep/ALINA_V/010.d` for Vite and `_specific/<site>` conventions, excluding WebRTC-specific polyfills and transforms.
- Never create a Git commit unless the user explicitly asks.
- Ask for explicit permission immediately before every JavaScript SPA build.
- Preserve unrelated user changes.

---

### Task 1: Vite, environments, and site variants

**Files:**
- Modify: `package.json`
- Modify: `.env`, `.env.sss`, `.env.m45a`, `.env.vov`, `.env.zero`
- Create: `.env.stage`
- Create: `vite.config.js`
- Create: `index.html`, `index.sss.html`, `index.m45a.html`, `index.vov.html`, `index.zero.html`, `index.stage.html`
- Move: `src/components/{sss,m45a,vov,zero,stage}/*` to `src/components/_specific/<site>/*`
- Move: `src/components/MenuHorizontalMain.vue`, `src/components/Footer.vue` to `src/components/_specific/default/`
- Modify: `src/App.vue`
- Remove after parity: `vue.config.js`, `babel.config.js`, old `public*/index.html`

**Interfaces:**
- Consumes: current `.env*`, `public*`, menu/footer variants, and ALINA_V Vite conventions.
- Produces: `VITE_APP_*`, Vite mode entries, and async `MenuHorizontalMain`/`Footer` components selected from `_specific/<site>`.

- [ ] **Step 1: Add a static environment-contract check**

Create `scripts/check-vite-contract.mjs` that reads tracked source/config files, rejects browser-side `process.env.VUE_APP_`, rejects `.env*` keys beginning `VUE_APP_`, verifies each mode has an HTML entry, and verifies each configured site folder contains both menu and footer components. It must exit nonzero with all violations listed.

- [ ] **Step 2: Run the contract check and verify RED**

Run: `node scripts/check-vite-contract.mjs`

Expected: FAIL listing current `VUE_APP_*` names and missing Vite entries.

- [ ] **Step 3: Replace Vue CLI tooling with Vite tooling**

Set `package.json` to ESM, require Node `>=20`, and replace scripts with `vite`, `vite --mode <site>`, `vite build`, and `vite build --mode <site>`. Add `vite`, `@vitejs/plugin-vue`, and only the SVG plugin proven necessary by current SVG imports. Remove Vue CLI, Babel, Vue 2 compiler, and obsolete loader dependencies.

- [ ] **Step 4: Implement Vite configuration**

Use `defineConfig(({ mode }) => { const env = loadEnv(mode, process.cwd(), ''); ... })`. Preserve `/apps/vue/`, configured `publicDir`, external `outDir`, HTTPS certificates, aliases, per-mode HTML input, hashed chunks, and normalization to `index.html`. Do not copy ALINA_V's WebRTC transforms.

- [ ] **Step 5: Rename the environment contract**

Mechanically rename every `.env*` key from `VUE_APP_` to `VITE_APP_`, remove duplicated default domain keys, preserve values, and set folders to `_specific/default`, `_specific/sss`, `_specific/m45a`, `_specific/vov`, `_specific/zero`, and `_specific/stage`.

- [ ] **Step 6: Convert HTML entries and browser consumers**

Convert `<%= VUE_APP_NAME %>` placeholders to `%VITE_APP_NAME%`. Replace browser-side access with `import.meta.env.VITE_APP_*` in `ConfigApi.js`, locales, menu branding, and `App.vue`.

- [ ] **Step 7: Implement deterministic site loading**

In `App.vue`, use `import.meta.glob('@/components/_specific/*/MenuHorizontalMain.vue')` and the corresponding footer glob. Resolve `/src/components/${folder}/...`, fall back to `_specific/default`, and throw a descriptive error only if both configured and fallback components are absent.

- [ ] **Step 8: Verify GREEN without building**

Run: `node scripts/check-vite-contract.mjs`

Expected: PASS. Also run `rg -n 'VUE_APP_|process\.env\.p?' src .env* index*.html vite.config.js`; expected: no relevant matches.

### Task 2: Vue core, Router, Vuex, and i18n

**Files:**
- Modify: `package.json`, `src/main.js`, `src/router.js`, `src/store/store.js`, `src/store/modules/egStoreModule.js`
- Modify: `src/views/tale/feed.vue`
- Test: `scripts/check-vue3-contract.mjs`

**Interfaces:**
- Consumes: Vite environment contract from Task 1.
- Produces: Vue 3 app instance with installed router, Vuex store, and legacy-compatible global i18n.

- [ ] **Step 1: Write the Vue 3 contract checker**

Reject `import Vue from 'vue'`, `new Vue`, `Vue.use`, `Vue.set`, `Vue.prototype`, `new Router`, `new Vuex.Store`, and `this.$router.currentRoute.path` under `src`.

- [ ] **Step 2: Verify RED**

Run: `node scripts/check-vue3-contract.mjs`

Expected: FAIL with matches in `main.js`, router, store, and feed.

- [ ] **Step 3: Upgrade framework packages and bootstrap the app**

Install Vue 3, Vue Router 5, Vuex 4, and Vue I18n 11. Use `createApp(App)`, `createI18n({ legacy: true, locale: CurrentLocale.language, fallbackLocale: 'en', messages, pluralizationRules })`, then `app.use(router).use(store).use(i18n).mount('#app')`.

- [ ] **Step 4: Convert router and store constructors**

Use `createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes, scrollBehavior })` and `createStore(...)`. Preserve route definitions and guards. Replace `Vue.set(state, 'sProp', v)` with `state.sProp = v`.

- [ ] **Step 5: Correct direct router access**

Replace `this.$router.currentRoute.path` with `this.$route.path` in the feed.

- [ ] **Step 6: Verify GREEN**

Run both contract scripts and parse all JS modules with the installed parser. Expected: PASS with no Vue 2 global API matches.

### Task 3: Vue 3 component contracts

**Files:**
- Modify: `src/components/elements/form/aInput.vue`
- Modify: `src/components/elements/form/AlinaDatePicker.vue`
- Modify: `src/components/BorgEditor/index.vue`
- Modify: all parents using these components with `v-model`
- Modify: `src/components/global/Popup.vue`, `src/components/MenuDropdown.vue`, `src/App.vue`, `src/views/About.vue`, `src/Utils/UtilsDate.js`
- Test: extend `scripts/check-vue3-contract.mjs`

**Interfaces:**
- Produces: `modelValue` prop and `update:modelValue` event for each custom input; direct lifecycle cleanup; callable date formatting without Vue filters.

- [ ] **Step 1: Extend contract checker and verify RED**

Reject `beforeDestroy`, `this.$on`, `$root.$on`, template pipe filters, `value` plus `$emit('input')` custom-model pairs, and `vue-date-fns`. Expected: FAIL at the known components and About examples.

- [ ] **Step 2: Migrate custom models**

Rename custom model props to `modelValue`, emit `update:modelValue`, and update internal references. Parent `v-model` syntax remains unchanged.

- [ ] **Step 3: Replace removed lifecycle and event APIs**

Rename `beforeDestroy` to `beforeUnmount`. Store document/window listener functions on component state and remove them in `beforeUnmount`. Remove the empty Bootstrap collapse root-event handler from `App.vue`; do not add an event bus for unused behavior.

- [ ] **Step 4: Remove Vue template filters**

Replace About's `| date` examples with direct `UtilsDate.dateObjFormat(...)` calls. Change `UtilsDate` to import `format` directly from `date-fns` and remove `VueDateFns` registration.

- [ ] **Step 5: Verify GREEN**

Run the extended checker and compile every SFC with `@vue/compiler-sfc`. Expected: no checker violations and no parse errors.

### Task 4: BootstrapVueNext and Bootstrap 5

**Files:**
- Modify: `package.json`, `src/main.js`, `src/assets/css/a010.scss`
- Modify: all 20 files containing `<b-...>` components
- Modify: files containing Bootstrap 4-only utility classes
- Test: `scripts/check-bootstrap5-contract.mjs`

**Interfaces:**
- Produces: globally installed BootstrapVueNext components/directives and Bootstrap 5-compatible markup with equivalent behavior.

- [ ] **Step 1: Write and run a RED Bootstrap contract checker**

Reject known Bootstrap 4-only classes (`no-gutters`, `ml-*`, `mr-*`, `pl-*`, `pr-*`, `text-left`, `text-right`, `input-group-prepend`, `input-group-append`, `custom-control*`, `btn-block`, `badge-pill`) and legacy-only BootstrapVue imports. Expected: FAIL on current UI files.

- [ ] **Step 2: Install and register BootstrapVueNext**

Install Bootstrap 5, BootstrapVueNext, Popper, and Bootstrap Icons if required. Import their CSS once in `main.js` and register the plugin according to its Vue 3 API.

- [ ] **Step 3: Migrate one default menu and shared interactive components**

Convert navbar, dropdown, modal, collapse, form-select, icon, spinner, and directive APIs. Confirm event/prop names against BootstrapVueNext documentation rather than assuming tag-level compatibility.

- [ ] **Step 4: Apply the verified menu mapping to site variants**

Preserve each site's branding and conditional entries while applying the same component API changes.

- [ ] **Step 5: Convert Bootstrap 4 utility classes**

Use Bootstrap 5 equivalents: `g-0`, logical `ms/me/ps/pe`, `text-start/end`, direct input-group children, `form-check`, `w-100`, and `rounded-pill`. Preserve custom SCSS selectors where names are application-owned.

- [ ] **Step 6: Verify GREEN without building**

Run the Bootstrap checker and compile every SFC. Expected: PASS. Manually inspect diffs for every changed interactive component.

### Task 5: CKEditor, maps, cookies, and sharing

**Files:**
- Modify: `package.json`, `src/main.js`
- Modify: `src/components/BorgEditor/index.vue`, `src/components/BorgEditor/Adjustment.js`
- Modify: `src/components/elements/form/AlinaYandexMap.vue`
- Modify: `src/components/elements/form/Share.vue`
- Modify: cookie consumers/configuration
- Test: extend dependency checker

**Interfaces:**
- Produces: Vue 3 editor wrapper, Vue 3 map integration, maintained cookie access, and dependency-free VK sharing behavior.

- [ ] **Step 1: Add dependency assertions and verify RED**

Reject `@ckeditor/ckeditor5-vue2`, `vue-yandex-maps@0.11`, `vue-social-sharing`, `vue-cookies` when incompatible, `vue-date-fns`, and `vue-lodash`.

- [ ] **Step 2: Migrate CKEditor wrapper**

Install `@ckeditor/ckeditor5-vue`, register its Vue 3 plugin/component, retain `window.CKEDITOR`, toolbar, upload adapter, license key handling, media providers, and use the new model event contract.

- [ ] **Step 3: Migrate Yandex Maps**

Try the closest Vue 3-compatible 0.12 API first. Preserve settings, marker, balloon, controls, map type, clustering, coordinates, and zoom. Escalate to the Maps 3.0 rewrite only if static/runtime compatibility proves 0.12 insufficient.

- [ ] **Step 4: Replace social sharing and cookies**

Implement the VK share URL directly with `window.open` using encoded URL/title values, preserving current slot content and styling. Configure a Vue 3-compatible cookie adapter with the same one-day, path, secure, and SameSite behavior.

- [ ] **Step 5: Remove obsolete dependencies and verify GREEN**

Run all contract scripts, SFC compilation, and `npm ls --depth=0`. Expected: no invalid peers and no Vue-2-only dependency assertions.

### Task 6: Static verification and permission-gated runtime validation

**Files:**
- Modify only files implicated by verification failures.
- Update: migration plan checkboxes with evidence.

**Interfaces:**
- Consumes: completed Tasks 1–5.
- Produces: statically clean Vue 3/Vite application and, after permission, verified mode builds and runtime flows.

- [ ] **Step 1: Run all non-build verification**

Run contract scripts, SFC compilation, `git diff --check`, dependency-tree inspection, and searches for old APIs/environment names. Record exact results.

- [ ] **Step 2: Request explicit build permission**

Ask the user immediately before running any `vite build` command. Do not treat migration approval as build approval.

- [ ] **Step 3: Build modes individually after approval**

Run default/zero first, then `sss`, `m45a`, `vov`, and `stage`. Do not use `build:all` until individual builds pass. Verify each output goes only to its configured directory and contains normalized `index.html`.

- [ ] **Step 4: Perform runtime smoke verification**

Verify navigation, locale switching, authentication forms, feed, tale editing, comments, modal/collapse behavior, CKEditor, upload, Yandex map, sharing, and every site's menu/footer. Fix issues at their owning subsystem and repeat only affected checks.

- [ ] **Step 5: Final audit**

Confirm standard Vue 3 without compat, Vite-only tooling, no old environment names/APIs, clean dependency peers, successful approved builds, preserved backend contracts, and no unintended files or commits.
