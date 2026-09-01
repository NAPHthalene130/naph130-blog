export interface LanguageConfig {
  /** 完整语言名称，例如：简体中文、English */
  name: string;
  /** 语言唯一标识代码，例如：zh_cn、en_us */
  locale: string;
  /** 对应词条文件名，例如：zh_cn.ts、en_us.ts */
  path: string;
  /** 界面展示的简短标识，例如：简中、ENG */
  show: string;
}

/** 默认语言标识 */
export const defaultLocale = 'zh_cn' as const;

/** 支持的语言列表配置 */
export const languages: readonly LanguageConfig[] = [
  {
    name: '简体中文',
    locale: 'zh_cn',
    path: 'zh_cn.ts',
    show: '简中',
  },
  {
    name: 'English',
    locale: 'en_us',
    path: 'en_us.ts',
    show: 'ENG',
  },
] as const;

export type SupportedLocale = (typeof languages)[number]['locale'];
