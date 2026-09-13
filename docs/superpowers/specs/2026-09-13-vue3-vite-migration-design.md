# ALINA_FE Vue 3 and Vite Migration Design

## Objective

Migrate ALINA_FE from Vue 2.7 and Vue CLI to Vue 3 and Vite while preserving existing application behavior, Options API component structure, ALINA site variants, deployment paths, visual appearance, API contracts, locale data, and as much source code as practical.

## Constraints

- Preserve the Options API. Composition API conversion is not part of this migration unless a replacement library requires a small local adapter.
- Preserve existing routes, services, global singleton objects, AJAX behavior, and backend contracts.
- Preserve all site modes: default, `sss`, `m45a`, `vov`, `zero`, and `stage`.
- Follow the working conventions in `/home/qqq/_A001/rep/ALINA_V/010.d` for Vite configuration, environment access, site-specific component loading, public folders, and output directories.
- Do not create Git commits unless the user explicitly asks.
- Ask for explicit permission immediately before every JavaScript SPA build.
- Do not require `sudo` unless a concrete filesystem or package-management operation cannot proceed without it.

## Migration Strategy

Use a staged source migration on the existing `migrate` branch. Move directly to the Vue 3 application API and Vite while retaining Options API components. Use compatibility-oriented library choices and small adapters rather than rewriting application components.

The migration will not introduce Pinia, TypeScript, Nuxt, or a broad Composition API conversion. Those would increase scope without helping preserve behavior.

## Application Bootstrap

Replace the Vue 2 root instance with `createApp`. Register the router, store, i18n, cookie support, BootstrapVue replacement, CKEditor integration, and map integration on the application instance.

Replace global prototype mutations with Vue 3 application-level global properties only where existing component usage requires them. Remove unused global plugins rather than recreating them.

## Environment Contract

Rename every client-exposed `VUE_APP_*` variable to the equivalent `VITE_APP_*` name. Browser code will use `import.meta.env`; `vite.config.js` will use `loadEnv(mode, process.cwd(), "")`.

Preserve these existing concepts:

- site-specific component folder;
- public asset folder;
- API/backend domain;
- CDN domain;
- site title and branding strings;
- deployment output directory;
- public base path;
- third-party API keys.

Do not copy the video socket or TURN variables from ALINA_V because ALINA_FE does not consume them.

Remove the duplicated domain definitions in the default `.env` so each key has one value.

Convert HTML interpolation from Vue CLI syntax such as `<%= VUE_APP_ALINA_TITLE %>` to Vite syntax such as `%VITE_APP_ALINA_TITLE%`.

## Site-Specific Components

Move variant menus and footers into:

```text
src/components/_specific/default/
src/components/_specific/sss/
src/components/_specific/m45a/
src/components/_specific/vov/
src/components/_specific/zero/
src/components/_specific/stage/
```

Set `VITE_APP_ALINA_FOLDER` to `_specific/<site>` and use an `import.meta.glob()` loader patterned after ALINA_V. The default site is an explicit fallback when a configured component is unavailable.

This is a filesystem reorganization only; the component implementations remain Options API components.

## Build Tooling

Replace Vue CLI configuration with Vite configuration modeled on ALINA_V:

- `publicDir` comes from `VITE_APP_PUBLIC_FOLDER`;
- `build.outDir` comes from `VITE_APP_ALINA_DIST`;
- `base` comes from `VITE_APP_PUBLIC_PATH`, defaulting to `/apps/vue/`;
- aliases `@` and `@components` remain available;
- HTTPS development settings remain available using this repository's certificates;
- each named mode uses its matching `.env.<mode>` and HTML entry;
- built mode-specific HTML is normalized to `index.html` when necessary;
- source maps preserve current development-only intent;
- SVG sprite behavior is reproduced with a Vite-compatible plugin only if current SVG consumers require the generated sprite.

Do not copy ALINA_V's WebRTC-specific Node polyfills or `null.spawn` transform because ALINA_FE has no corresponding dependency.

## Router and Store

Upgrade Vue Router to a Vue 3-compatible release and replace the constructor with `createRouter`. Preserve all existing route paths, names, guards, and components. Use `createWebHistory(import.meta.env.BASE_URL)` unless runtime verification shows the deployed server requires hash history.

Replace the deprecated `this.$router.currentRoute.path` access with `this.$route.path`.

Upgrade Vuex to Vuex 4 to retain the existing store API and Options API mappings. Replace `Vue.set` with direct reactive assignment. Pinia migration is explicitly deferred.

## Internationalization

Upgrade Vue I18n and create it with Vue 3's `createI18n`. Preserve all translation messages and the Russian pluralization rule.

Start in legacy mode so existing `$t` and `$tc` usage remains intact. A later Composition API conversion is outside this migration.

`CurrentLocale` remains the shared ALINA language source. Locale switching must continue to update both that object and the active i18n locale.

## Component Compatibility Changes

Keep component `data`, `computed`, `watch`, `methods`, and props definitions unless Vue 3 requires a targeted change.

Required targeted changes include:

- `beforeDestroy` to `beforeUnmount`;
- replace removed instance event APIs such as `$root.$on` and `this.$on` with direct lifecycle cleanup or an explicit local event mechanism;
- convert custom component `v-model` contracts from `value`/`input` to `modelValue`/`update:modelValue`, while optionally accepting the old prop during the transition if it materially reduces churn;
- remove Vue 2 template filters and call formatting functions directly;
- audit fallthrough attributes and emitted events where Vue 3 warnings identify ambiguity.

## Bootstrap and UI Components

Replace BootstrapVue with BootstrapVueNext and Bootstrap 4 with Bootstrap 5. Preserve the existing Bootstrap-based visual design rather than introducing another component framework.

Migrate component tags and directives using BootstrapVueNext's closest equivalents. Review the roughly 93 uses of Bootstrap 4-only utilities, including directional spacing, `no-gutters`, text alignment, input-group wrappers, custom controls, and block buttons.

Because most BootstrapVue usage is concentrated in six related menu components, migrate one representative menu first, validate it, then apply the same mapping to the variants.

Visual verification must cover responsive navigation, dropdowns, modals, collapses, form selects, buttons, icons, spinners, the tale editor, comments, and feed controls.

## CKEditor

Replace `@ckeditor/ckeditor5-vue2` with the Vue 3 CKEditor adapter. Preserve the existing externally loaded `window.CKEDITOR`, editor configuration, toolbar, media providers, upload adapter, and license configuration.

Adapt the wrapper component's value/event contract to Vue 3 `v-model`. Verify editor initialization, existing HTML display, media embedding, and uploads.

## Yandex Maps

Move from the Vue-2-only `vue-yandex-maps` 0.11 integration to a Vue 3-compatible version. Prefer the closest API-compatible Vue 3 line first to maximize template preservation; use the newer Maps 3.0 rewrite only if the compatible line cannot satisfy the existing marker, balloon, controls, map type, and cluster behavior.

## Small Plugin Replacements

- Remove `vue-date-fns`; call `date-fns` or native date utilities directly and replace the demonstration filters.
- Replace the archived social-sharing plugin with a small maintained Vue 3 component or direct share-link implementation while preserving the current VK behavior.
- Keep Lodash as ordinary module imports; remove unused `vue-lodash` integration.
- Retain cookie behavior through a Vue 3-compatible cookie plugin or a focused adapter.
- Remove `whatwg-fetch` if supported browser requirements make the polyfill unnecessary; otherwise retain an explicit compatible polyfill.

## Error Handling and Compatibility Diagnostics

Migration errors will be addressed at subsystem boundaries: application bootstrap, router/store/i18n, site loading, UI components, editor, maps, then secondary plugins. Avoid broad mechanical rewrites that make regressions difficult to attribute.

Missing site components must produce a clear console error and load the default variant where possible. Missing required environment variables should use the same safe fallbacks as the current application.

## Verification

Verification proceeds without a production build until the user grants build permission.

Non-build checks include:

- parse all Vue SFC templates and scripts;
- run available lint/static checks;
- run focused unit tests for configuration or extracted framework-independent utilities where valuable;
- search for remaining Vue 2-only APIs and old environment names;
- inspect dependency peer requirements;
- review diffs for all site modes.

When permission is granted, run builds one mode at a time rather than `build:all`, beginning with the default or `zero` mode. After compilation succeeds, manually verify core flows in development: routing, authentication forms, feed, tale create/edit, comments, locale switching, modal/collapse behavior, CKEditor, file upload, map rendering, and each site-specific header/footer.

## Implementation Order

1. Introduce Vite configuration, scripts, HTML entries, and renamed environment variables.
2. Reorganize and load site-specific menus/footers with `import.meta.glob()`.
3. Upgrade Vue core bootstrap, Router, Vuex, and Vue I18n.
4. Migrate component lifecycle, event, filter, and custom `v-model` behavior.
5. Replace BootstrapVue and update Bootstrap 4 markup/utilities.
6. Migrate CKEditor and Yandex Maps.
7. Replace/remove smaller Vue 2 plugins.
8. Run non-build static verification.
9. Ask for permission, then compile and verify each deployment mode.
10. Resolve runtime and visual regressions until all supported modes behave equivalently.

## Completion Criteria

- The application runs on Vue 3 without `@vue/compat`.
- Vite replaces Vue CLI.
- No `VUE_APP_*`, browser-side `process.env`, Vue 2 lifecycle hooks, Vue 2 instance event APIs, or Vue 2 template filters remain.
- Existing Options API application code is preserved except where Vue 3 or replacement-library APIs require changes.
- All ALINA modes resolve the correct public directory, output directory, branding, menu, and footer.
- Router, store, localization, Bootstrap UI, CKEditor, uploads, maps, sharing, and core page flows retain existing behavior.
- Static checks pass, and every build explicitly approved by the user completes successfully.
- No commit is created unless separately requested by the user.
