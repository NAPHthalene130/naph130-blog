const BASE = import.meta.env.BASE_URL || '/'

const GRADIENTS = [
  'linear-gradient(135deg, #2d8a4e, #4caf50)',
  'linear-gradient(135deg, #1b5e20, #388e3c)',
  'linear-gradient(135deg, #00796b, #26a69a)',
  'linear-gradient(135deg, #33691e, #689f38)',
  'linear-gradient(135deg, #004d40, #00897b)',
]

export function getCoverImage(coverImg?: string, title?: string): string {
  if (coverImg) {
    return `${BASE}assets/posts/${coverImg}`
  }
  // 回退：用标题首字母生成彩色占位
  const idx = title ? title.charCodeAt(0) % GRADIENTS.length : 0
  return GRADIENTS[idx]
}

export function getCoverStyle(coverImg?: string, title?: string): Record<string, string> {
  if (coverImg) {
    return {
      backgroundImage: `url(${BASE}assets/posts/${coverImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  const idx = title ? title.charCodeAt(0) % GRADIENTS.length : 0
  return { background: GRADIENTS[idx] }
}
