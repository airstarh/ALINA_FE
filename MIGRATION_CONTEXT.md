# ALINA_FE Vue 3 migration handoff

Updated: 2026-09-14 (Europe/Moscow)

## Repository

- Path: `/home/qqq/_A001/rep/ALINA_FE`
- Active branch at handoff: `migrate`
- Latest commit observed: `54019b8 dev`
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

Treat the migration as ongoing UI/runtime compatibility work. For the next reported issue:

1. Inspect the exact component and relevant shared service/CSS.
2. Diagnose the root cause before editing.
3. Preserve Vue 2-era behavior with the smallest Vue 3/Bootstrap 5 adjustment.
4. Ask for approval immediately before a JS SPA build, and never commit unless explicitly asked.
5. Run proportional non-build verification, normally SFC compilation, `npm run check:migration`, and `git diff --check`.

