import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Splash from "../views/Splash.vue";
import Settings from "../views/Settings.vue";
import Folder from "../views/Folder.vue";
import File from "../views/File.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Splash
  },
  {
    path: "/splash",
    name: "splash",
    component: Splash
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings
  },
  {
    path: "/folder",
    name: "folder",
    component: Folder
  },
  {
    path: "/file",
    name: "file",
    component: File
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

export default router;
