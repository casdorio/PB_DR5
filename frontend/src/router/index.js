import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/qrcode/:id',
      name: 'qrcode',
      component: () => import('../views/QRCodeView.vue')
    },
    {
      path: '/admin/:queueId/:hash_admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue')
    },
    {
      path: '/panel/:id',
      name: 'panel',
      component: () => import('../views/PanelView.vue')
    },
    {
      path: '/acesso/:id',
      name: 'acesso',
      component: () => import('../views/AcessoView.vue')
    }
  ]
})

export default router
