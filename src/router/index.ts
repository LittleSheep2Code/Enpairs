import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'launching',
      component: () => import('@/views/launching.vue'),
    },
    {
      path: '/scene',
      name: 'scene',
      component: () => import('@/views/scene.vue'),
    }
  ]
})

export default router
