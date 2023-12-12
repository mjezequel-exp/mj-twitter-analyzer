import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "./AuthGuard";
import { RouteNames } from "./RouteNames";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            component: (): any => import("@/views/LayoutView.vue"),
            children: [
                {
                    path: "",
                    name: RouteNames.home,
                    component: (): any => import("@/views/HomeView.vue"),
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
            component: (): any => import("@/views/errors/UnauthorizedView.vue"),
        },
        {
            path: "/:pathMatch(.*)*",
            name: RouteNames.notFound,
            component: (): any => import("@/views/errors/NotFoundView.vue"),
        },
    ],
});

router.beforeEach(authGuard);

export default router;
