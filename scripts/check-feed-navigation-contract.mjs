import assert from "node:assert/strict";
import fs from "node:fs";

import {
  feedContext,
  shouldReloadFeedForRouteChange,
} from "../src/services/FeedNavigation.js";

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
assert.match(appSource, /<KeepAlive\s+include="tale_feed">/);

const feedSource = fs.readFileSync("src/views/tale/feed.vue", "utf8");
assert.match(feedSource, /activated\(\)/);
assert.match(feedSource, /beforeRouteLeave\(to, from\)/);
assert.match(feedSource, /shouldReloadFeedForRouteChange\(to, from, this\.routeContext\)/);
assert.match(feedSource, /["']queryProps\.owner["']/);
assert.match(feedSource, /this\.\$nextTick\(\(\) => this\.scrollTop\(\)\)/);

const profileSource = fs.readFileSync("src/views/auth/profile.vue", "utf8");
assert.match(profileSource, /route-context="profile"/);

const helperSource = fs.readFileSync("src/services/FeedNavigation.js", "utf8");
assert.doesNotMatch(helperSource, /\.path\b/);

console.log("Feed navigation contract satisfied");
