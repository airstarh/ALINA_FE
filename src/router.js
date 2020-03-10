import Vue                           from "vue";
import Router                        from "vue-router";
import Home                          from "@/views/Home.vue";
import RestCall                      from "@/views/RestCall.vue";
import auth_login                    from "@/views/auth/login";
import auth_logout                   from "@/views/auth/logout";
import auth_profile                  from "@/views/auth/profile";
import auth_change_password          from "@/views/auth/changePassword";
import auth_reset_password_request   from "@/views/auth/resetPasswordRequest";
import auth_reset_password_with_code from "@/views/auth/resetPasswordWithCode";
import tale_upsert                   from "@/views/tale/upsert";
import tale_feed                     from "@/views/tale/feed";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path:      "/",
            name:      "feed",
            component: tale_feed
        },
        {
            path:      "/about",
            name:      "about",
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                           import(/* webpackChunkName: "about" */ "@/views/About.vue")
        },
        {
            path:      "/RestCall",
            name:      "RestCall",
            component: RestCall
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
        }
        //##################################################
        //##################################################
        //##################################################

    ]
});
