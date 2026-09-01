export interface FrostedGlassConfig {
  /** 是否启用全局磨砂玻璃遮罩效果 */
  enabled: boolean;
  /** 背景虚化程度 (CSS backdrop-blur 像素或 Tailwind 类名，例如 'backdrop-blur-md') */
  blur: string;
  /** 遮罩底色与透明度 (例如 'bg-neutral-950/35' 或 'bg-black/40') */
  overlayTint: string;
  /** 是否启用极简微噪点质感纹理 */
  noise: boolean;
}

export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  avatar: string;
  siteUrl: string;
  socials: {
    github?: string;
    twitter?: string;
    email?: string;
  };
  /** 背景与磨砂玻璃特效配置 */
  frostedGlass: FrostedGlassConfig;
}

export const siteConfig: SiteConfig = {
  title: 'naph130 - Blog',
  description: 'A personal tech blog built with Astro & React.',
  author: 'naph130',
  avatar: '/assets/avatar.jpg',
  siteUrl: 'https://naph130.github.io',
  socials: {
    github: 'https://github.com/naph130',
  },
  frostedGlass: {
    enabled: true,
    blur: 'backdrop-blur-md', // 可选: backdrop-blur-sm | backdrop-blur-md | backdrop-blur-lg | backdrop-blur-xl
    overlayTint: 'bg-neutral-950/35', // 深色半透明遮罩
    noise: false,
  },
};
