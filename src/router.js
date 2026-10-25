import {createRouter, createWebHashHistory} from "vue-router";
import About                         from "@/views/About.vue";
import RestCall                      from "@/views/RestCall.vue";
import UrlParser                     from "@/views/UrlParser.vue";
import CliParser                     from "@/views/CliParser.vue";
import Informer                      from "@/views/Informer.vue";
import auth_login                    from "@/views/auth/login";
import auth_logout                   from "@/views/auth/logout";
import auth_profile                  from "@/views/auth/profile";
import auth_register                 from "@/views/auth/register";
import auth_change_password          from "@/views/auth/changePassword";
import auth_reset_password_request   from "@/views/auth/resetPasswordRequest";
import auth_reset_password_with_code from "@/views/auth/resetPasswordWithCode";
import tale_upsert                   from "@/views/tale/upsert";
import tale_feed                     from "@/views/tale/feed";
import notification                  from "@/views/auth/notification";
import AjaxAlina                     from "@/services/AjaxAlina";
import ConfigApi                     from "@/configs/ConfigApi";
import {feedContext}                 from "@/services/FeedNavigation";

export default createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		}
		if (to.hash) {
			if (document.querySelector(to.hash)) {
				return {el: to.hash, top: to.hash === '#experience' ? 220 : 0};
			}
			return false;
		}
		const targetContext = feedContext(to);
		if (
			["main", "profile"].includes(targetContext)
			&& feedContext(from) !== targetContext
		) {
			return false;
		}
		return {left: 0, top: 0};
	},
	routes: [
		{
			path: "/chat/rooms",
			name: "Chat rooms",
			component: () => import("@/views/Chat/rooms.vue"),
		},
		{
			path: "/chat",
			name: "Chat",
			component: () => import("@/views/Chat/index.vue"),
			meta: {chat: true},
		},
		{
			path:      "/",
			name:      "feed",
			component: tale_feed,
			meta:      {feedContext: "main"}
		},
		{
			path:      "/about",
			name:      "about",
			component: About,
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			//=== component: () =>
			//===                import(/* webpackChunkName: "about" */ "@/views/About.vue")
		},
		{
			path:      "/about/:someParam",
			name:      "aboutSomeData",
			component: About
		},
		{
			path:      "/RestCall",
			name:      "RestCall",
			component: RestCall
		},
		// UrlParser
		{
			path:      "/UrlParser",
			name:      "UrlParser",
			component: UrlParser
		},
		// CLI lParser
		{
			path:      "/CliParser",
			name:      "CliParser",
			component: CliParser
		},
		{
			path:      "/Informer",
			name:      "Informer",
			component: Informer
		},
		//##################################################
		//##################################################
		//##################################################
		{
			path:      "/tale/upsert",
			component: tale_upsert
		},
		{
			path:      "/tale/upsert/:id",
			component: tale_upsert
		},
		{
			path:      "/tale/feed",
			component: tale_feed,
			meta:      {feedContext: "main"}
		},
		//##################################################
		//##################################################
		//##################################################
		{
			path:      "/auth/login",
			name:      "auth_login",
			component: auth_login
		},
		{
			path:      "/auth/logout",
			name:      "auth_logout",
			component: auth_logout,
			beforeEnter(to, from, next) {
				AjaxAlina.newInst({
					url:        `${ConfigApi.url_base}/auth/logout`,
					postParams: {
						form_id: 'actionLogout',
					}
					,
					method: 'POST',
					onDone: (aja) => {
						//this.$router.replace({path: `/tale/feed`});
						location.reload();
					}
				})
				.go();
			}
		},
		{
			path:      "/auth/profile",
			component: auth_profile,
			meta:      {feedContext: "profile"}
		},
		{
			path:      "/auth/profile/:id",
			component: auth_profile,
			meta:      {feedContext: "profile"}
		},
		{
			path:      "/auth/users",
			name:      "users",
			component: () => import("@/views/auth/users.vue")
		},
		{
			path:      "/auth/register",
			name:      "auth_register",
			component: auth_register
		},
		{
			path:      "/auth/change_password",
			name:      "auth_change_password",
			component: auth_change_password
		},
		{
			path:      "/auth/reset_password_request",
			name:      "auth_reset_password_request",
			component: auth_reset_password_request
		},
		{
			path:      "/auth/reset_password_with_code",
			name:      "auth_reset_password_with_code",
			component: auth_reset_password_with_code
		},
		{
			path:      "/notification",
			component: notification
		},
		//##################################################
		//##################################################
		//##################################################
	]
});
