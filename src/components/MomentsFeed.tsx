import React, { useState, useEffect } from 'react';
import { t, type I18nKey } from '@/i18n';

export const MomentsFeed: React.FC = () => {
  const [lang, setLang] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('naph130_lang');
      return saved === 'en' || saved === 'en-US' ? 'en' : 'zh';
    }
    return 'zh';
  });

  useEffect(() => {
    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const code = customEvent.detail;
      setLang(code === 'en' || code === 'en-US' ? 'en' : 'zh');
    };

    window.addEventListener('naph130:lang-change', handleLangChange);
    return () => {
      window.removeEventListener('naph130:lang-change', handleLangChange);
    };
  }, []);

  const isEnglish = lang === 'en' || lang === 'en_us';
  const targetLocale = isEnglish ? 'en_us' : 'zh_cn';

  const emptyTitle = t('pages.momentsEmptyTitle' as I18nKey, targetLocale);

  return (
    <div className="h-full min-h-[300px] flex items-center justify-center p-8 text-neutral-600 font-mono select-none">
      <p className="text-sm sm:text-base text-neutral-700 font-medium tracking-wide">
        {emptyTitle}
      </p>
    </div>
  );
};
export default MomentsFeed;
