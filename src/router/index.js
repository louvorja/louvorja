import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'inicio',
    title: "Início",
    icon: "louvorja",
    tab: false,
    component: () => import('@/views/Inicio.vue')
  },
  {
    path: '/hinario',
    name: 'hinario',
    title: 'Hinário Adventista',
    tab: true,
    icon: "book-open-cover",
    component: () => import('@/views/Hinario.vue')
  },
  {
    path: '/localizar-musicas',
    name: 'localizar-musicas',
    title: 'Localizar Músicas',
    tab: true,
    icon: "magnifying-glass",
    component: () => import('@/views/LocalizarMusicas.vue')
  },
  {
    path: '/videos-online',
    name: 'videos-online',
    title: 'Vídeos On-line',
    tab: true,
    icon: "youtube",
    component: () => import('@/views/ItensAgendados.vue')
  },
  {
    path: '/biblia',
    name: 'biblia',
    title: 'Bíblia',
    tab: true,
    icon: "book-bible",
    component: () => import('@/views/ItensAgendados.vue')
  },
  {
    path: '/liturgia',
    name: 'liturgia',
    title: 'Liturgia',
    tab: true,
    icon: "list-timeline",
    component: () => import('@/views/ItensAgendados.vue')
  },
  {
    path: '/itens-agendados',
    name: 'itens-agendados',
    title: 'Itens Agendados',
    tab: true,
    icon: "calendar",
    component: () => import('@/views/ItensAgendados.vue')
  },
  {
    path: '/cronometro',
    name: 'cronometro',
    title: 'Cronômetro',
    tab: true,
    icon: "stopwatch",
    component: () => import('@/views/Cronometro.vue')
  },
  {
    path: '/relogio',
    name: 'relogio',
    title: 'Relógio',
    tab: true,
    icon: "clock",
    component: () => import('@/views/Relogio.vue')
  },
  {
    path: '/cronometro-culto',
    name: 'cronometro-culto',
    title: 'Cronômetro de Culto',
    tab: true,
    icon: "alarm-clock",
    component: () => import('@/views/Relogio.vue')
  },
  {
    path: '/sorteio',
    name: 'sorteio',
    title: 'Sorteio',
    tab: true,
    icon: "ticket",
    component: () => import('@/views/Relogio.vue')
  },
  {
    path: '/editor',
    name: 'editor',
    title: 'Editor',
    tab: true,
    component: () => import('@/views/Editor.vue')
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
