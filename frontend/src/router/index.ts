import { createRouter, createWebHistory } from 'vue-router'

import MobileShell from '@/components/layout/MobileShell.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MobileShell,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/app/pages/HomePage.vue'),
        },
        {
          path: 'course',
          name: 'course',
          component: () => import('@/app/pages/CoursePage.vue'),
        },
        {
          path: 'course/:slug',
          name: 'chapter',
          component: () => import('@/app/pages/ChapterPage.vue'),
        },
        {
          path: 'review/:slug',
          name: 'review',
          component: () => import('@/app/pages/ReviewPage.vue'),
        },
        {
          path: 'progress',
          name: 'progress',
          component: () => import('@/app/pages/ProgressPage.vue'),
        },
      ],
    },
  ],
})

export default router
