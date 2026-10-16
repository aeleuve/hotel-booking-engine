import { defineRouter } from '#q-app/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const HEADER_OFFSET = 88

export default defineRouter(() =>
  createRouter({
    history: createWebHistory(process.env.VUE_ROUTER_BASE),
    routes,
    scrollBehavior: (to, _from, saved) => {
      if (saved) return saved
      if (to.hash) return { el: to.hash, top: HEADER_OFFSET, behavior: 'smooth' }
      return { top: 0 }
    },
  }),
)
