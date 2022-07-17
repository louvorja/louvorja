import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    title: "Início",
    icon: "louvorja",
    tab: false,
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/hymnal',
    name: 'hymnal',
    title: 'Hinário Adventista',
    tab: true,
    //icon: "book-open-cover",
    icon: "hasd",
    component: () => import('@/views/Hymnal.vue')
  },
  {
    path: '/find-music',
    name: 'find-music',
    title: 'Localizar Músicas',
    tab: true,
    icon: "magnifying-glass",
    component: () => import('@/views/FindMusic.vue')
  },
  {
    path: '/online-videos',
    name: 'online-videos',
    title: 'Vídeos On-line',
    tab: true,
    icon: "youtube",
    component: () => import('@/views/ScheduledItems.vue')
  },
  {
    path: '/bible',
    name: 'bible',
    title: 'Bíblia',
    tab: true,
    icon: "book-bible",
    component: () => import('@/views/ScheduledItems.vue')
  },
  {
    path: '/liturgy',
    name: 'liturgy',
    title: 'Liturgia',
    tab: true,
    icon: "list-timeline",
    component: () => import('@/views/ScheduledItems.vue')
  },
  {
    path: '/scheduled-items',
    name: 'scheduled-items',
    title: 'Itens Agendados',
    tab: true,
    icon: "calendar",
    component: () => import('@/views/ScheduledItems.vue')
  },
  {
    path: '/stopwatch',
    name: 'stopwatch',
    title: 'Cronômetro',
    tab: true,
    icon: "stopwatch",
    component: () => import('@/views/Stopwatch.vue')
  },
  {
    path: '/clock',
    name: 'clock',
    title: 'Relógio',
    tab: true,
    icon: "clock",
    component: () => import('@/views/Clock.vue')
  },
  {
    path: '/worship-timer',
    name: 'worship-timer',
    title: 'Cronômetro de Culto',
    tab: true,
    icon: "alarm-clock",
    component: () => import('@/views/Clock.vue')
  },
  {
    path: '/sweepstake',
    name: 'sweepstake',
    title: 'Sorteio',
    tab: true,
    icon: "ticket",
    component: () => import('@/views/Clock.vue')
  },
  {
    path: '/slide-editor',
    name: 'slide-editor',
    title: 'Editor',
    tab: true,
    component: () => import('@/views/SlideEditor.vue')
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes
})

export default router
