import { createI18n } from 'vue-i18n'
import zh_cn from './locales/zh_cn'
import en_us from './locales/en_us'

function getDefaultLocale(): string {
  const saved = localStorage.getItem('blog-locale')
  if (saved === 'zh_cn' || saved === 'en_us') return saved
  const navLang = navigator.language.toLowerCase()
  return navLang.startsWith('zh') ? 'zh_cn' : 'en_us'
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'zh_cn',
  messages: { zh_cn, en_us },
})

export default i18n
