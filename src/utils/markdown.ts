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
      } catch {
        // fall through
      }
    }
    return buildCodeBlock(md.utils.escapeHtml(str), '')
  },
})

md.renderer.rules.image = function (tokens, idx) {
  const token = tokens[idx]
  const src = token.attrGet('src') || ''
  const alt = token.attrGet('alt') || ''
  token.attrSet('loading', 'lazy')
  token.attrSet('onclick', `window.__openLightbox?.('${md.utils.escapeHtml(src)}', '${md.utils.escapeHtml(alt)}')`)
  return md.renderer.renderToken(tokens, idx, {})
}

function buildCodeBlock(code: string, lang: string): string {
  const langLabel = lang ? `<span class="text-xs text-base-400 dark:text-base-500">${lang}</span>` : ''
  return `<div class="code-block-wrapper relative group">
    <div class="flex items-center justify-between px-5 py-2 bg-base-100 dark:bg-base-800 border-b border-base-200 dark:border-base-700 rounded-t-glass">
      ${langLabel}
      <button class="copy-btn text-xs text-base-400 hover:text-accent-500 dark:hover:text-accent-400 transition-colors flex items-center gap-1" onclick="(function(btn){const code=btn.closest('.code-block-wrapper').querySelector('code').textContent;navigator.clipboard.writeText(code).then(()=>{btn.textContent='已复制';setTimeout(()=>{btn.textContent='复制'},2000)})})(this)">
        复制
      </button>
    </div>
    <pre class="!mt-0 !rounded-t-none"><code>${code}</code></pre>
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
  const englishWords = stripped
    .replace(/[\u4e00-\u9fff]/g, '')
    .split(/\s+/)
    .filter(Boolean).length
  return chineseChars + englishWords
}

export function calcReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200))
}
