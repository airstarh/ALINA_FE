import Vue         from "vue";
import Router      from "vue-router";
import Home        from "@/views/Home.vue";
import RestCall    from "@/views/RestCall.vue";
import auth_login  from "@/views/auth/login";
import auth_logout from "@/views/auth/logout";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path:      "/",
            name:      "home",
            component: Home
        },
        {
            path:      "/about",
            name:      "about",
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                           import(/* webpackChunkName: "about" */ "./views/About.vue")
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
            path:      "/auth/login",
            name:      "auth_login",
            component: auth_login
        },
        {
            path:      "/auth/logout",
            name:      "auth_logout",
            component: auth_logout
        }
        //##################################################
        //##################################################
        //##################################################

    ]
});
