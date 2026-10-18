import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/app/layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('src/pages/home/ui/HomePage.vue') },
      {
        path: 'checkout',
        name: 'checkout',
        component: () => import('src/pages/checkout/ui/CheckoutPage.vue'),
      },
      {
        path: 'checkout/complete',
        name: 'checkout-complete',
        component: () => import('src/pages/checkout-complete/ui/CheckoutCompletePage.vue'),
      },
      {
        path: 'my-booking',
        name: 'my-booking',
        component: () => import('src/pages/my-booking/ui/MyBookingPage.vue'),
      },
    ],
  },
  { path: '/:catchAll(.*)*', redirect: { name: 'home' } },
]
