import assert from "node:assert/strict";
import fs from "node:fs";

import {
  feedContext,
  shouldReloadFeedForRouteChange,
} from "../src/services/FeedNavigation.js";
import {
  createFeedSessionKey,
  createTaleSessionKey,
  feedDataRevision,
  isPageReload,
  markFeedDataStale,
  readSessionState,
  writeSessionState,
} from "../src/services/FeedSessionState.js";

const storageValues = new Map();
const storage = {
  getItem(key) {
    return storageValues.get(key) ?? null;
  },
  setItem(key, value) {
    storageValues.set(key, value);
  },
  removeItem(key) {
    storageValues.delete(key);
  },
};

assert.equal(
  createFeedSessionKey("main", null, {txt: "abc", pageCurrentNumber: "2"}),
  createFeedSessionKey("main", null, {pageCurrentNumber: "2", txt: "abc"}),
  "Equivalent query parameters must use the same session key",
);
assert.notEqual(
  createFeedSessionKey("profile", "1", {pageCurrentNumber: "2"}),
  createFeedSessionKey("profile", "2", {pageCurrentNumber: "2"}),
  "Different profile owners must not share saved feed state",
);

assert.equal(feedDataRevision(storage), 0);
markFeedDataStale(storage, 1234);
assert.equal(feedDataRevision(storage), 1234, "A tale mutation must invalidate cached feeds");
assert.equal(
  isPageReload({getEntriesByType: () => [{type: "reload"}]}),
  true,
  "A genuine browser reload must force fresh feed data",
);
assert.equal(
  isPageReload({getEntriesByType: () => [{type: "back_forward"}]}),
  false,
  "Browser Back restoration may reuse recent feed data",
);
assert.notEqual(
  createTaleSessionKey("1"),
  createTaleSessionKey("2"),
  "Different tales must not share saved UI state",
);

writeSessionState(storage, "test-key", {scrollPosition: 321}, 1_000);
assert.deepEqual(
  readSessionState(storage, "test-key", 301_000, 300_000),
  {scrollPosition: 321},
  "A session entry at the five-minute boundary must still restore",
);
assert.equal(
  readSessionState(storage, "test-key", 301_001, 300_000),
  null,
  "An expired session entry must not restore",
);
assert.equal(storage.getItem("test-key"), null, "Expired session state must be removed");

storage.setItem("broken-key", "not JSON");
assert.equal(readSessionState(storage, "broken-key", 1_000), null);
assert.equal(storage.getItem("broken-key"), null, "Malformed session state must be removed");

assert.equal(feedContext({meta: {feedContext: "main"}}), "main");
assert.equal(feedContext({meta: {feedContext: "profile"}}), "profile");
assert.equal(feedContext({meta: {}}), null);

assert.equal(
  shouldReloadFeedForRouteChange(
    {meta: {feedContext: "main"}, query: {pageCurrentNumber: "2", txt: "abc"}},
    {meta: {feedContext: "main"}, query: {txt: "abc", pageCurrentNumber: "2"}},
    "main",
  ),
  false,
  "Equivalent feed query parameters must not reload the feed",
);

assert.equal(
  shouldReloadFeedForRouteChange(
    {meta: {feedContext: "main"}, query: {pageCurrentNumber: "3"}},
    {meta: {feedContext: "main"}, query: {pageCurrentNumber: "2"}},
    "main",
  ),
  true,
  "Changing a feed query parameter must reload the feed",
);

assert.equal(
  shouldReloadFeedForRouteChange(
    {meta: {feedContext: "profile"}, query: {pageCurrentNumber: "3"}},
    {meta: {feedContext: "profile"}, query: {pageCurrentNumber: "2"}},
    "profile",
  ),
  true,
  "Changing profile pagination must reload the embedded profile feed",
);

assert.equal(
  shouldReloadFeedForRouteChange(
    {meta: {feedContext: "profile"}, query: {pageCurrentNumber: "3"}},
    {meta: {feedContext: "profile"}, query: {pageCurrentNumber: "2"}},
    "main",
  ),
  false,
  "The inactive cached main feed must ignore profile pagination",
);

assert.equal(
  shouldReloadFeedForRouteChange(
    {meta: {feedContext: "profile"}, params: {id: "2"}, query: {pageCurrentNumber: "1"}},
    {meta: {feedContext: "profile"}, params: {id: "1"}, query: {pageCurrentNumber: "3"}},
    "profile",
  ),
  false,
  "Changing profile owner must be handled once by the owner prop watcher",
);

assert.equal(
  shouldReloadFeedForRouteChange(
    {meta: {feedContext: "main"}, query: {pageCurrentNumber: "2"}},
    {meta: {}, query: {}},
    "main",
  ),
  false,
  "Returning from another route must reuse the cached main feed",
);

const appSource = fs.readFileSync("src/App.vue", "utf8");
assert.match(appSource, /<KeepAlive\s+:include="\['tale_feed', 'auth_profile', 'tale_upsert'\]">/);

const feedSource = fs.readFileSync("src/views/tale/feed.vue", "utf8");
assert.match(feedSource, /activated\(\)/);
assert.match(feedSource, /beforeRouteLeave\(to, from\)/);
assert.match(feedSource, /window\.addEventListener\("pagehide", this\.saveSessionState\)/);
assert.match(feedSource, /restoreSessionState\(\)/);
assert.match(feedSource, /createFeedSessionKey/);
assert.doesNotMatch(feedSource, /fileBlocksExpanded/);
assert.match(feedSource, /feedDataRevision/);
assert.match(feedSource, /isPageReload/);
assert.match(feedSource, /refreshFeedIfStale/);
assert.match(feedSource, /if \(this\.routeContext !== "main"\)/);
assert.match(feedSource, /shouldReloadFeedForRouteChange\(to, from, this\.routeContext\)/);
assert.match(feedSource, /["']queryProps\.owner["']/);
assert.match(feedSource, /this\.\$nextTick\(\(\) => this\.scrollTop\(\)\)/);

const profileSource = fs.readFileSync("src/views/auth/profile.vue", "utf8");
assert.match(profileSource, /route-context="profile"/);
assert.match(profileSource, /savedScrollPosition:\s*0/);
assert.match(profileSource, /activated\(\)/);
assert.match(profileSource, /beforeRouteLeave\(to, from\)/);
assert.match(profileSource, /window\.addEventListener\("pagehide", this\.saveSessionState\)/);
assert.match(profileSource, /restoreSessionState\(\)/);
assert.match(profileSource, /createProfileSessionKey/);

const helperSource = fs.readFileSync("src/services/FeedNavigation.js", "utf8");
assert.doesNotMatch(helperSource, /\.path\b/);

const taleSource = fs.readFileSync("src/views/tale/upsert.vue", "utf8");
assert.match(taleSource, /taleUiState:\s*\{/);
assert.match(taleSource, /filesExpanded:\s*false/);
assert.match(taleSource, /commentsExpanded:\s*\[\]/);
assert.match(taleSource, /createTaleSessionKey/);
assert.match(taleSource, /restoreTaleUiState/);
assert.match(taleSource, /saveTaleUiState/);
assert.match(taleSource, /:expanded="taleUiState\.filesExpanded"/);
assert.match(taleSource, /:expanded-collapse-ids="taleUiState\.commentsExpanded"/);
assert.match(taleSource, /ref="fileUploader"/);
assert.match(taleSource, /ref="comments"/);
assert.match(taleSource, /this\.\$refs\.fileUploader\?\.loadFileList\(\)/);
assert.match(taleSource, /this\.\$refs\.comments\?\.refreshExpanded\(\)/);
assert.match(taleSource, /markFeedDataStale\(sessionStorage\)/);
assert.match(taleSource, /startNewTale\(\)/);

const uploaderSource = fs.readFileSync("src/components/elements\/form\/AlinaFileUploader.vue", "utf8");
assert.match(uploaderSource, /:model-value="dExpanded"/);
assert.match(uploaderSource, /@update:model-value="onExpandedChanged"/);
assert.match(uploaderSource, /emits:\s*\["update:expanded"\]/);
assert.match(uploaderSource, /@show="onShow"/);
assert.match(uploaderSource, /onShow\(\)\s*\{\s*this\.loadFileList\(\)/);

const commentSource = fs.readFileSync("src/components/elements/form/Comment.vue", "utf8");
assert.match(commentSource, /expandedCollapseIds/);
assert.match(commentSource, /:model-value="isExpanded"/);
assert.match(commentSource, /@update:model-value="onExpandedChanged"/);
assert.match(commentSource, /@show="onExpandCommentList/);
assert.match(commentSource, /onExpandCommentList\(collapseId\)[\s\S]*?this\.ajaGetComments\(\)/);
assert.match(commentSource, /refreshExpanded\(\)/);

console.log("Feed navigation contract satisfied");
