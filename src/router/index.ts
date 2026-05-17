import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import RootLayout from '../views/RootLayout.vue'
import IntroView from '../views/IntroView.vue'
import PostsView from '../views/PostsView.vue'
import PostView from '../views/PostView.vue'
import AboutView from '../views/AboutView.vue'
import NotFoundView from '../views/NotFoundView.vue'

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
    component: RootLayout,
    children: [
      { path: '', redirect: (to: any) => `${to.path}/intro` },
      { path: 'intro', name: 'intro', component: IntroView },
      { path: 'posts', name: 'posts', component: PostsView },
      { path: 'post/:slug', name: 'post', component: PostView },
      { path: 'about', name: 'about', component: AboutView },
    ],
  },
  {
    path: '/zh_cn/404',
    name: 'notFound',
    component: NotFoundView,
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
