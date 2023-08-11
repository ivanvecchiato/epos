import { createWebHistory, createRouter } from "vue-router";

import Frontend from './views/Frontend.vue'
import Conti from './views/Conti.vue'
import ProductConfig from './views/ProductConfig.vue'
import Settings from './views/Settings.vue'
import Extras from './views/Extras.vue'
import Floor from './views/Floor.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Ordini from './views/Ordini.vue'
import Dashboard from './views/Dashboard.vue'

const routes = [
  {
    path: '/frontend/',
    name: 'frontend',
    component: Frontend
  },
  {
    path: '/main/',
    name: 'main',
    component: Main
  },
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/conti',
    name: 'conti',
    component: Conti
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/ordini',
    name: 'ordini',
    component: Ordini
  },
  {
    path: '/floor',
    name: 'floor',
    component: Floor
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  },
  {
    path: '/extras',
    name: 'extras',
    component: Extras
  },
  {
    path: '/prodconfig',
    name: 'prodconfig',
    component: ProductConfig
  }
  ];

  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export default router;
  