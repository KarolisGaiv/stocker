import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardPage/DashboardView.vue'
import TradeView from '../views/TradePage/TradeView.vue'
import BalanceView from '../views/BalancePage/BalanceView.vue'
import NotFoundView from '../views/NotFound/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/balance',
      name: 'balance',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: BalanceView
    },
    {
      path: '/trade',
      name: 'trade',
      component: TradeView
    },
    // catch 404 (catches everything else not indicated above)
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFoundView
    }
  ]
})

export default router
