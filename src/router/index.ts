import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const LANG_PREFIX = '/:locale(zh_cn|en_us)'

function getDefaultLocale(): string {
  try {
    const saved = localStorage.getItem('blog-locale')
    if (saved === 'zh_cn' || saved === 'en_us') return saved
  } catch {}
  return 'zh_cn'
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () => `/${getDefaultLocale()}/intro`,
  },
  {
    path: LANG_PREFIX,
    component: () => import('../views/RootLayout.vue'),
    children: [
      { path: '', redirect: (to: any) => `${to.path}/intro` },
      { path: 'intro', name: 'intro', component: () => import('../views/IntroView.vue') },
      { path: 'posts', name: 'posts', component: () => import('../views/PostsView.vue') },
      { path: 'post/:slug', name: 'post', component: () => import('../views/PostView.vue') },
      { path: 'about', name: 'about', component: () => import('../views/AboutView.vue') },
    ],
  },
  {
    path: '/zh_cn/404',
    name: 'notFound',
    component: () => import('../views/NotFoundView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/zh_cn/404',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
