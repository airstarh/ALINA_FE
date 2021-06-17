import Vue                           from "vue";
import Router                        from "vue-router";
import About                         from "@/views/About.vue";
import RestCall                      from "@/views/RestCall.vue";
import UrlParser                     from "@/views/UrlParser.vue";
import CliParser                     from "@/views/CliParser.vue";
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
Vue.use(Router);
export default new Router({
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            const position = {};
            if (to.hash) {
                position.selector = to.hash;
                if (to.hash === '#experience') {
                    position.offset = {y: 220}
                }
                if (document.querySelector(to.hash)) {
                    return position;
                }
                return false;
            }
        }
    },
    routes: [
        {
            path:      "/",
            name:      "feed",
            component: tale_feed
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
            component: tale_feed
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
            component: auth_logout
        },
        {
            path:      "/auth/profile",
            component: auth_profile
        },
        {
            path:      "/auth/profile/:id",
            component: auth_profile
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
