// import Vue from "vue";
// import Router from "vue-router";
// const Router = require('vue-router')
Vue.use(VueRouter);

/* Layout */
// import Layout from "@/layout";

/* Router Modules */
import Login1 from "@/views/Login/Login1/index.vue";
// import Container from "@/container/index";

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    name: "Login1",
    component: Login1
  },
  {
    path: "/page1",
    name: "page1",
    // component: page1,
    component: () => import("@/views/mobile/page1/index"),
  },
  {
    path: "/page2",
    name: "page2",
    // component: page2,
    component: () => import("@/views/mobile/page2/index")
  }
  // {
  //   path: "",
  //   component: Container,
  //   redirect: "dashboard",
  //   children: [
  //     {
  //       path: "dashboard",
  //       component: () => import("@/views/dashboard/index"),
  //       name: "Dashboard"
  //       // meta: {
  //       //   title: "dashboard",
  //       //   icon: "dashboard",
  //       //   noCache: true,
  //       //   affix: true
  //       // }
  //     }
  //   ]
  // }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [...constantRoutes];

const createRouter = () =>
  new VueRouter({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
