import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import type { TocItem } from '@/types'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: false,
  highlight(str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
      } catch { /* fallback */ }
    }
    return md.utils.escapeHtml(str)
  },
})

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')

// ── 标题注入 id 用于 TOC 锚点 ──
const defaultHeadingOpen = md.renderer.rules.heading_open!

md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const level = token.tag
  if (level === 'h2' || level === 'h3') {
    // 下一个 token 是 inline
    const inlineToken = tokens[idx + 1]
    if (inlineToken && inlineToken.type === 'inline' && inlineToken.content) {
      const id = slugify(inlineToken.content)
      if (id) {
        token.attrSet('id', id)
      }
    }
  }
  return defaultHeadingOpen(tokens, idx, options, env, self)
}

// ── 代码块：用 fence 规则取代 highlight 包裹 ──
md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx]
  const lang = token.info.trim()
  const code = token.content
  const langLabel = lang ? `<span>${lang}</span>` : '<span>&nbsp;</span>'

  // 手动高亮（highlight 选项不可用，因为我们需要控制整个输出）
  let highlighted: string
  if (lang && hljs.getLanguage(lang)) {
    try {
      highlighted = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
    } catch {
      highlighted = md.utils.escapeHtml(code)
    }
  } else {
    highlighted = md.utils.escapeHtml(code)
  }

  return `<div class="code-block-wrapper">
    <div class="code-header">
      ${langLabel}
      <button class="copy-btn" onclick="(function(b){var c=b.closest('.code-block-wrapper').querySelector('code');navigator.clipboard.writeText(c.textContent||'').then(function(){b.textContent='\u5df2\u590d\u5236';setTimeout(function(){b.textContent='\u590d\u5236'},2000)})})(this)">复制</button>
    </div>
    <pre><code class="hljs${lang ? ' language-' + lang : ''}">${highlighted}</code></pre>
  </div>`
}

// ── 图片：点击触发 lightbox ──
md.renderer.rules.image = (tokens, idx, options, _env, self) => {
  const token = tokens[idx]
  const src = token.attrGet('src') || ''
  const alt = token.attrGet('alt') || ''
  token.attrSet('loading', 'lazy')
  token.attrSet('onclick', `window.__openLightbox?.('${md.utils.escapeHtml(src)}', '${md.utils.escapeHtml(alt)}')`)
  token.attrSet('style', 'cursor: zoom-in;')
  return self.renderToken(tokens, idx, options)
}

export function renderMarkdown(content: string): string {
  return md.render(content)
}

export function extractToc(html: string): TocItem[] {
  const headingRegex = /<h([23])\s[^>]*?\bid="([^"]*)"[^>]*>([\s\S]*?)<\/h[23]>/gi
  const items: { level: number; id: string; text: string }[] = []

  let match: RegExpExecArray | null
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const id = match[2]
    const text = match[3].replace(/<[^>]+>/g, '').trim()
    if (id && text) {
      items.push({ level, id, text })
    }
  }

  return buildTocTree(items)
}

function buildTocTree(flat: { level: number; id: string; text: string }[]): TocItem[] {
  const root: TocItem[] = []
  const stack: TocItem[] = []

  for (const item of flat) {
    const node: TocItem = { id: item.id, text: item.text, level: item.level, children: [] }
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop()
    }
    if (stack.length === 0) {
      root.push(node)
    } else {
      stack[stack.length - 1].children.push(node)
    }
    stack.push(node)
  }

  return root
}

export function countWords(text: string): number {
  const stripped = text.replace(/<[^>]+>/g, '').trim()
  if (!stripped) return 0
  const chineseChars = (stripped.match(/[\u4e00-\u9fff]/g) || []).length
  const englishWords = stripped.replace(/[\u4e00-\u9fff]/g, '').split(/\s+/).filter(Boolean).length
  return chineseChars + englishWords
}

export function calcReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200))
}
