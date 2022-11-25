import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "../pages/Home.vue"),
  },
  {
    path: "/raycaster",
    name: "raycaster",
    component: () =>
      import(/* webpackChunkName: "raycaster" */ "../pages/Raycaster.vue"),
  },
  {
    path: "/test",
    name: "test",
    component: () => import(/* webpackChunkName: "test" */ "../pages/Test.vue"),
  },
  {
    path: "/test2",
    name: "test2",
    component: () =>
      import(/* webpackChunkName: "test2" */ "../pages/Test2.vue"),
  },
  {
    path: "/test3",
    name: "test3",
    component: () =>
      import(/* webpackChunkName: "test3" */ "../pages/Test3.vue"),
  },
  {
    path: "/test4",
    name: "test4",
    component: () =>
      import(/* webpackChunkName: "test4" */ "../pages/Test4.vue"),
  },
  {
    path: "/test5",
    name: "test5",
    component: () =>
      import(/* webpackChunkName: "test5" */ "../pages/Test5.vue"),
  },
  {
    path: "/paint",
    name: "paint",
    component: () =>
      import(/* webpackChunkName: "paint" */ "../pages/Paint.vue"),
  },
  {
    path: "/block",
    name: "block",
    component: () =>
      import(/* webpackChunkName: "block" */ "../pages/Block.vue"),
  },
  {
    path: "/font",
    name: "font",
    component: () => import(/* webpackChunkName: "font" */ "../pages/Font.vue"),
  },
  {
    path: "/cat",
    name: "cat",
    component: () => import(/* webpackChunkName: "cat" */ "../pages/Cat.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
