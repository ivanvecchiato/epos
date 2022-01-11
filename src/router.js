import { createWebHistory, createRouter } from "vue-router";

import Frontend from './views/Frontend.vue'
import Conti from './views/Conti.vue'
import ProductConfig from './views/ProductConfig.vue'
import Settings from './views/Settings.vue'
import Floor from './views/Floor.vue'
import Login from './views/Login.vue'
import Home from './views/Home.vue'

const routes = [
  {
    path: '/frontend/',
    name: 'frontend',
    component: Frontend,
    props:  (route) => ({
      ...route.params
  })
  },
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/conti',
    name: 'conti',
    component: Conti
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
  