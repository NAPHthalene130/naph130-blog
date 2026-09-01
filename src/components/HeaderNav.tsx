import React, { useState } from 'react';
import { Home, Settings } from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import { getDefaultSettings, applyAllSettings } from '@/settings';

const STORAGE_KEY = 'naph130_page_settings';

export const HeaderNav: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Record<string, Record<string, unknown>>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return getDefaultSettings();
  });

  const handleUpdateValue = (categoryField: string, itemField: string, value: unknown) => {
    const updated = {
      ...settings,
      [categoryField]: {
        ...settings[categoryField],
        [itemField]: value,
      },
    };
    setSettings(updated);
    applyAllSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    const defaults = getDefaultSettings();
    setSettings(defaults);
    applyAllSettings(defaults);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* 顶部加高、纯净透明无底色 Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 sm:h-24 bg-transparent select-none transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full px-6 sm:px-12 flex items-center justify-between">
          {/* 左侧：纯白高对比度 Logo (无颜色渐变) */}
          <div className="flex items-center">
            <a
              href="/"
              className="flex items-center text-xl sm:text-2xl font-['Comfortaa'] font-bold tracking-normal text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] hover:opacity-90 transition-opacity"
            >
              <span>NAPH130's Blog</span>
            </a>
          </div>

          {/* 中间：首页导航选项（加大字号与图标） */}
          <nav className="flex items-center">
            <a
              href="/"
              className="group flex items-center gap-2 text-base sm:text-lg font-medium text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] hover:drop-shadow-[0_2px_12px_rgba(255,255,255,0.8)] hover:scale-105 transition-all duration-200"
            >
              <Home className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span>首页</span>
            </a>
          </nav>

          {/* 右侧：设置按钮（加大图标） */}
          <div className="flex items-center text-white">
            <button
              type="button"
              aria-label="设置"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:scale-115 active:scale-95 transition-all focus:outline-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 设置面板 */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateValue={handleUpdateValue}
        onReset={handleReset}
      />
    </>
  );
};
export default HeaderNav;
