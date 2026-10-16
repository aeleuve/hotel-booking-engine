import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/app/layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('src/pages/home/ui/HomePage.vue') },
    ],
  },
  { path: '/:catchAll(.*)*', redirect: { name: 'home' } },
]
