# ALINA_FE Vue 3 migration handoff

> **Newer recovery reference (2026-10-21):** For the implemented SPA routing,
> BorgEditor video embedding, and current text-chat state, read
> `/home/qqq/_A001/rep/ALINA_BE/docs/superpowers/alina-conversation-current-state.md`.
> This file remains the broader historical Vue 3 migration handoff.

Updated: 2026-09-16 (Europe/Moscow)

## Repository

- Path: `/home/qqq/_A001/rep/ALINA_FE`
- Active branch at handoff: `migrate`
- Latest commit observed: `afb4f41 dev` (2026-09-16 handoff).
- Stack: Vue `^3.5.42`, Vite `^8.0.16`, Bootstrap `^5.3.8`, BootstrapVueNext `^1.1.0`, Vue I18n `11.4.2`.

## User's standing rules

- Never commit, push, or create a PR unless the user explicitly asks.
- Do not build a JavaScript SPA by default. Ask immediately before each build; build only after explicit approval.
- Do not add frontend tests.
- Static source checks and Vue SFC compilation checks are welcome.
- Do not use `date-fns`.
- Preserve as much existing code and behavior as possible during the Vue 3 migration.
- Use mobile-first CSS. Avoid media-query definitions for layout fixes when a fluid width plus maximum width is sufficient.
- Current desired feed/tale sizing: `width: 100%`, `max-width: 1000px`, centered.
- The user prefers English conversation; Russian is used for the application's Russian locale.

These rules are also recorded globally in `/home/qqq/.codex/AGENTS.md` where applicable.

## Migration structure and verification

- Site-specific components live under `src/components/_specific/{default,sss,m45a,vov,zero,stage}`.
- Site HTML variants: `index.html`, `index.sss.html`, `index.m45a.html`, `index.vov.html`, `index.zero.html`, `index.stage.html`.
- Environment variables use the `VITE_APP_` prefix, modeled after the Vue 3 ALINA project.
- Static migration command: `npm run check:migration`.
- Contract scripts:
  - `scripts/check-vite-contract.mjs`
  - `scripts/check-vue3-contract.mjs`
  - `scripts/check-bootstrap5-contract.mjs`
- Use `git diff --check` after edits.
- Do not run `npm run build` without asking first.

## Important completed migration fixes

- Vue 3/Vite application bootstrap, Vue Router 4, Vuex 4, Vue I18n 11 composition mode, Bootstrap 5 and BootstrapVueNext integration.
- BootstrapVueNext components/directives are explicitly registered in `src/main.js`.
- CommonJS `require()` usages encountered at runtime were migrated to ESM.
- Recursive `Comment.vue` self-import initialization error was removed while recursive comment rendering was preserved.
- Vue 2 `$set` usage and `v-for`/`v-if` precedence problems in `src/views/tale/feed.vue` were migrated.
- Horizontal navbar variants use Bootstrap 5 `ms-auto`, BootstrapVueNext `end`, and Vue 3 `#button-content` syntax.
- Navbar dropdown toggle buttons directly receive `corporate-bg-and-text text-decoration-none`, because BootstrapVueNext uses buttons rather than the anchors targeted by the external corporate CSS.
- Corporate CSS is requested from the URLs in each `index.*.html`. The common and site-specific entry files import their child CSS files.
- Search input group in the feed was updated for Bootstrap 5.
- `AlinAFile.vue` resolves non-absolute file URLs against `VITE_APP_ALINA_DOMAIN`.
- Horizontal file cards have stable non-shrinking widths; audio/video controls remain visible.
- Generic and PDF icons use real SVG asset URLs rather than broken external `<use>` rendering.
- Image file click opens the global full-screen popup; click/tap on image, overlay, or close control dismisses it.
- VK share icon uses the existing SVG as a CSS mask so its full circular shape renders in the corporate color.
- Feed and tales are fluid up to `1000px` and centered, without media queries.
- Tale date is positioned across the lower header edge; its link uses `2px` padding and a compact capped font.
- Liker modal avatar markup in `Like.vue` was restored (`<img` had accidentally become literal `>>`). Avatar and name link to the profile.
- `UserAvatar.vue` centrally guarantees no underline for the user-name link in normal, hover, focus, visited, and active states. Do not add per-caller avatar underline workarounds.
- Russian Clock/Chronometer localization is connected to `CurrentLocale`; `Chronometer` is translated as `Хронометр` wherever localized.

## Vue 3 shared-state lesson and fixed services

Several Vue 2 singleton objects were placed in component `data()` and mutated elsewhere through their raw imports. Vue 3 proxies did not observe those raw mutations. These were converted to central Vue `reactive()` objects/instances while preserving their APIs:

- `MessagesObj`: Ajax messages again open the global modal.
- `SpinnerObj`: Ajax/About spinner state updates immediately; clicking the overlay turns it off.
- `PopupObj`: file image previews open and close reactively.
- `CurrentUser`: login/logout, avatar/name, role-dependent menu items, permissions, and notification count update in mounted components.

When another shared singleton fails to update dynamically, inspect it for this same raw-object/proxy pattern before adding component-level watchers or forced rerenders.

## Manual acceptance helpers

`src/views/About.vue` contains an `Ajax tests` block:

- `TEST SPINNER`: spinner appears and disappears when its overlay is clicked.
- `TEST POST`: successful response messages appear in the global popup.
- `TEST Bad Response`: failure messages appear in the global popup.

Useful manual flows already checked by the user during the session include the feed, comments, BorgEditor comment fields, horizontal files, image popup, Likes modal, navbar, and live login menu update.

## How to continue

## Latest conversation: vertical file viewer and editor warnings

- Added `src/components/AlinaVerticalScrollJson/index.vue`, reused by `src/components/elements/form/AlinaFileUploader.vue` alongside the horizontal viewer.
- Vertical view is now the default (`viewMode: "vertical"`); the toggle switches between both views. The user implemented toggle visibility themselves: current condition is `ownLength && dArrFiles.length > 0`. Preserve their changes.
- Vertical viewer reuses `AlinAFile.vue` with `displayMode="vertical"` and `showCaption=false`. Names are rendered with `aInput`, editable for authorized users, otherwise captions/links. Save/delete/order fields and original playback, image popup, URL resolution and download behavior are preserved.
- `aInput.vue` now supports link `target` and `download` props. Caption link styling is scoped to the vertical list: inherited color, no underline in all states.
- Important CSS bug: `aInput` edit mode has `flex: 1 1 10rem`. Inside a flex-column details block this becomes a huge vertical basis. The vertical list overrides the exact selector `.aInput.aInput-edit:not(.aInput-fixed-width)` with `flex: 0 0 auto`; retain its specificity.
- Rows wrap naturally with `flex-wrap: wrap`, vertically center contents, and details use a `50mm` flex basis/minimum width so fields move below media on narrow displays. No media queries.
- Images/videos use proportional automatic height, NOT fixed `25vh` (that experiment was superseded). Generic file content height remains `15mm`; audio fills its compact control area.
- Current user-tuned CSS observed at handoff: media width `min(98vw, 100mm)`; preview wrapper padding `2px 2px`, transparent background; images/video radius `30px`. Vertical list gap `13mm`, width `99%`, centered. Rows have no border, background `#111`, radius `30px`, padding `0.5mm 1mm 8mm 1mm`. These differ from earlier assistant defaults intentionally—do not revert them.
- Added missing `AlinaPageGlobalAnalyzer` import to the horizontal viewer (existing updated hook used it).
- Latest fix: `vite.config.js` helper `normalizeHtmlOutputName` has JSDoc parameter types: `isCustomMode: boolean`, `mode: string`, `outputDirectory: string`. Resolves strict editor implicit-any warnings without disabling strict checking or changing behavior.
- Latest verification: `node --check vite.config.js`, `npm run check:migration`, and `git diff --check` passed. Earlier affected Vue templates/styles passed one-off `@vue/compiler-sfc` checks. No SPA build or frontend tests added. No agent commits; user commits their own changes.
- Git worktree was clean before this handoff document update. Recheck status on resume; never assume old diffs remain uncommitted.
- User dislikes repeated approval questions for trivial changes. Keep communication concise and avoid unnecessary clarification; still follow applicable higher-priority skill approval gates when required.
- No unfinished implementation task at reboot; next step is user feedback or the next migration/UI issue.

### Resume prompt

Read `/home/qqq/_A001/rep/ALINA_FE/MIGRATION_CONTEXT.md` completely and inspect current git status. Resume our ALINA_FE Vue 3 migration/UI work, preserving my current user-tuned CSS. Never commit unless I explicitly ask; ask before any JS SPA build; do not add frontend tests or date-fns. Use English in conversation. The vertical file viewer is implemented and default, and the latest fix added JSDoc types in vite.config.js. Wait for my next issue after loading this context.

## Continuing workflow

Treat the migration as ongoing UI/runtime compatibility work. For the next reported issue:

1. Inspect the exact component and relevant shared service/CSS.
2. Diagnose the root cause before editing.
3. Preserve Vue 2-era behavior with the smallest Vue 3/Bootstrap 5 adjustment.
4. Ask for approval immediately before a JS SPA build, and never commit unless explicitly asked.
5. Run proportional non-build verification, normally SFC compilation, `npm run check:migration`, and `git diff --check`.
