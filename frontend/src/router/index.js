import { createRouter, createWebHistory } from "vue-router";
import Config from "../views/Config.vue";
import FlightSearch from "../views/FlightSearch.vue";
import SvgEditor from "../views/SvgEditor.vue";
const routes = [
  // { path: "/login", component: Login },
  {
    path: "/login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/forgot-password",
    component: () => import("../views/ForgotPassword.vue"),
  },
  { path: "/", component: FlightSearch },
  { path: "/config", component: Config },
  { path: "/svg", component: SvgEditor },
];
export default createRouter({ history: createWebHistory(), routes });
