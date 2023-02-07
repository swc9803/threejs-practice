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
    path: "/raycaster2",
    name: "raycaster2",
    component: () =>
      import(/* webpackChunkName: "raycaster2" */ "../pages/Raycaster2.vue"),
  },
  {
    path: "/box",
    name: "box",
    component: () => import(/* webpackChunkName: "box" */ "../pages/Box.vue"),
  },
  {
    path: "/gltf",
    name: "gltf",
    component: () => import(/* webpackChunkName: "gltf" */ "../pages/gltf.vue"),
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
