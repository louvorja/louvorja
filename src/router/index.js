import { createRouter, createWebHistory } from "vue-router";
import Main from "@/views/Main.vue"; // Importando um componente de exemplo
import Popup from "@/views/Popup.vue";

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
  },
  {
    path: "/popup",
    name: "Popup",
    component: Popup,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
