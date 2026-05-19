import { createRouter, createWebHistory } from "vue-router";
import Config from "../views/Config.vue";
import FlightSearch from "../views/FlightSearch.vue";
import Login from "../views/Login.vue";
import SvgEditor from "../views/SvgEditor.vue";
const routes = [
  { path: "/login", component: Login },
  { path: "/", component: FlightSearch },
  { path: "/config", component: Config },
  { path: "/svg", component: SvgEditor },
];
export default createRouter({ history: createWebHistory(), routes });
