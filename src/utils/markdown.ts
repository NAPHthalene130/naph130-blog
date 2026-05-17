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
        const highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        return buildCodeBlock(highlighted, lang)
      } catch { /* fall through */ }
    }
    return buildCodeBlock(md.utils.escapeHtml(str), '')
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

md.renderer.rules.heading_open = function (tokens, idx) {
  const level = tokens[idx].tag
  if (level === 'h2' || level === 'h3') {
    const inline = tokens[idx + 1]
    if (inline && inline.content) {
      const id = slugify(inline.content)
      tokens[idx].attrSet('id', id)
    }
  }
  return md.renderer.renderToken(tokens, idx, {})
}

md.renderer.rules.image = function (tokens, idx) {
  const token = tokens[idx]
  const src = token.attrGet('src') || ''
  const alt = token.attrGet('alt') || ''
  token.attrSet('loading', 'lazy')
  token.attrSet('onclick', `window.__openLightbox?.('${md.utils.escapeHtml(src)}', '${md.utils.escapeHtml(alt)}')`)
  token.attrSet('style', 'cursor: zoom-in;')
  return md.renderer.renderToken(tokens, idx, {})
}

function buildCodeBlock(code: string, lang: string): string {
  const langLabel = lang ? `<span>${lang}</span>` : '<span></span>'
  return `<div class="code-block-wrapper">
    <div class="code-header">
      ${langLabel}
      <button class="copy-btn" onclick="(function(b){var c=b.closest('.code-block-wrapper').querySelector('code');navigator.clipboard.writeText(c.textContent||'').then(function(){b.textContent='已复制';setTimeout(function(){b.textContent='复制'},2000)})})(this)">复制</button>
    </div>
    <pre><code>${code}</code></pre>
  </div>`
}

export function renderMarkdown(content: string): string {
  return md.render(content)
}

export function extractToc(html: string): TocItem[] {
  const headingRegex = /<h([23])\s+id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi
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
