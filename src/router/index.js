import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/resume',
    name: 'Resume',
    component: () => import('@/views/Resume.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
