import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "./AuthGuard";
import { RouteNames } from "./RouteNames";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            component: () => import(/* webpackChunkName: "layout" */ "@/views/LayoutView.vue"),
            children: [
                {
                    path: "",
                    name: RouteNames.home,
                    component: () => import(/* webpackChunkName: "home" */ "@/views/HomeView.vue"),
                },
            ],
        },
        {
            path: "/auth",
            redirect: "/",
        },
        {
            path: "/unauthorized",
            name: RouteNames.unauthorized,
            component: () => import(/* webpackChunkName: "unauthorized" */ "@/views/errors/UnauthorizedView.vue"),
        },
        {
            path: "/:pathMatch(.*)*",
            name: RouteNames.notFound,
            component: () => import(/* webpackChunkName: "notFound" */ "@/views/errors/NotFoundView.vue"),
        },
    ],
});

router.beforeEach(authGuard);

export default router;
