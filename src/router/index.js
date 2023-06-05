import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    icon: "louvorja",
    tab: false,
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/hymnal',
    name: 'hymnal',
    tab: true,
    //icon: "book-open-cover",
    icon: "hasd",
    component: () => import('@/views/Hymnal.vue')
  },
  {
    path: '/collections',
    name: 'collections',
    tab: true,
    icon: "music",
    component: () => import('@/views/Collections.vue')
  },
  {
    path: '/find-musics',
    name: 'find-musics',
    tab: true,
    icon: "magnifying-glass",
    component: () => import('@/views/FindMusic.vue')
  },
  {
    path: '/online-videos',
    name: 'online-videos',
    tab: true,
    icon: "youtube",
    component: () => import('@/views/ScheduledItems.vue')
  },
  {
    path: '/bible',
    name: 'bible',
    tab: true,
    icon: "book-bible",
    component: () => import('@/views/ScheduledItems.vue')
  },
  {
    path: '/liturgy',
    name: 'liturgy',
    tab: true,
    icon: "list-timeline",
    component: () => import('@/views/ScheduledItems.vue')
  },
  {
    path: '/scheduled-items',
    name: 'scheduled-items',
    tab: true,
    icon: "calendar",
    component: () => import('@/views/ScheduledItems.vue')
  },
  {
    path: '/stopwatch',
    name: 'stopwatch',
    tab: true,
    icon: "stopwatch",
    component: () => import('@/views/Stopwatch.vue')
  },
  {
    path: '/clock',
    name: 'clock',
    tab: true,
    icon: "clock",
    component: () => import('@/views/Clock.vue')
  },
  {
    path: '/worship-timer',
    name: 'worship-timer',
    tab: true,
    icon: "alarm-clock",
    component: () => import('@/views/Clock.vue')
  },
  {
    path: '/sweepstake',
    name: 'sweepstake',
    tab: true,
    icon: "ticket",
    component: () => import('@/views/Clock.vue')
  },
  {
    path: '/slide-editor',
    name: 'slide-editor',
    tab: true,
    component: () => import('@/views/SlideEditor.vue')
  },
  {
    path: '/screens',
    name: 'screens',
    tab: false,
    full: true,
    component: () => import('@/views/screens/Home.vue')
  },
  {
    path: '/screens/media',
    name: 'screens-media',
    tab: false,
    full: true,
    component: () => import('@/views/screens/Media.vue')
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router;