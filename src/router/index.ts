import { createRouter, createWebHistory } from "vue-router";
import { registerAuthGuard } from "./AuthGuard";
import { RouteNames } from "./RouteNames";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: RouteNames.home,
            component: (): any => import("@/views/HomeView.vue"),
        },
        {
            path: "/protected",
            component: (): any => import("@/views/LayoutView.vue"),
            children: [
                {
                    path: "",
                    name: RouteNames.protectedPage,
                    component: (): any => import("@/views/ProtectedView.vue"),
                },
            ],
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: "/auth",
            redirect: "/",
        },
        {
            path: "/unauthorized",
            name: RouteNames.unauthorized,
            component: (): any => import("@/views/errors/UnauthorizedView.vue"),
        },
        {
            path: "/:pathMatch(.*)*",
            name: RouteNames.notFound,
            component: (): any => import("@/views/errors/NotFoundView.vue"),
        },
    ],
});

registerAuthGuard(router);

export default router;
