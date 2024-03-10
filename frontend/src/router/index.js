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
      path: '/admin/:id/:hash',
      name: 'admin',
      component: () => import('../views/AdminView.vue')
    },
    {
      path: '/panel/:id',
      name: 'panel',
      component: () => import('../views/PanelView.vue')
    }
  ]
})

export default router
