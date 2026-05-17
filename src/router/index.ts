import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const LANG_PREFIX = '/:locale(zh_cn|en_us)'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: `/${getSavedLocale()}/intro`,
  },
  {
    path: LANG_PREFIX,
    component: () => import('../views/RootLayout.vue'),
    children: [
      { path: '', redirect: (to) => `${to.path}/intro` },
      { path: 'intro', name: 'intro', component: () => import('../views/IntroView.vue') },
      { path: 'posts', name: 'posts', component: () => import('../views/PostsView.vue') },
      { path: 'post/:slug', name: 'post', component: () => import('../views/PostView.vue') },
      { path: 'about', name: 'about', component: () => import('../views/AboutView.vue') },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/zh_cn/404',
  },
  {
    path: '/zh_cn/404',
    name: 'notFound',
    component: () => import('../views/NotFoundView.vue'),
  },
]

function getSavedLocale(): string {
  const saved = localStorage.getItem('blog-locale')
  return saved === 'en_us' ? 'en_us' : 'zh_cn'
}

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
