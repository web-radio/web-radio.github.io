import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/explore-view.vue'),
    },
    {
      path: '/search',
      component: () => import('@/views/search-view.vue'),
    },
    {
      path: '/settings',
      component: () => import('@/views/settings-view.vue'),
    },
    {
      path: '/map',
      component: () => import('@/views/map-view.vue'),
    },
    {
      path: '/history',
      component: () => import('@/views/history-view.vue'),
    },
    {
      path: '/voted',
      component: () => import('@/views/voted-view.vue'),
    },
    {
      path: '/s/:id',
      component: () => import('@/views/station-info-view.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

export default router;
