import React, { useState, useEffect } from 'react';
import { Home, User, BookOpen, Link2, Settings } from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import {
  loadSavedSettings,
  persistSettings,
  applyAllSettings,
  getDefaultSettings,
} from '@/settings';

interface HeaderNavProps {
  currentPath?: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ currentPath = '/' }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Record<string, Record<string, unknown>>>(() =>
    loadSavedSettings()
  );

  // 初次挂载与 settings 变更时自动执行 apply 并持久化
  useEffect(() => {
    applyAllSettings(settings);
    persistSettings(settings);
  }, [settings]);

  const handleUpdateValue = (categoryField: string, itemField: string, value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      [categoryField]: {
        ...prev[categoryField],
        [itemField]: value,
      },
    }));
  };

  const handleReset = () => {
    const defaults = getDefaultSettings();
    setSettings(defaults);
  };

  const navItems = [
    { label: '首页', href: '/', icon: Home },
    { label: '文章', href: '/posts', icon: BookOpen },
    { label: '简介', href: '/intro', icon: User },
    { label: '友链', href: '/friends', icon: Link2 },
  ];

  return (
    <>
      {/* 顶部透明悬浮 Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 sm:h-24 bg-transparent select-none transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full px-6 sm:px-12 flex items-center justify-between">
          {/* 左侧：纯白 Logo */}
          <div className="flex items-center">
            <a
              href="/"
              className="flex items-center text-xl sm:text-2xl font-['Comfortaa'] font-bold tracking-normal text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] hover:opacity-90 transition-opacity"
            >
              <span>NAPH130's Blog</span>
            </a>
          </div>

          {/* 中间：导航选项组 (首页、简介) */}
          <nav className="flex items-center gap-8 sm:gap-10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-2 text-base sm:text-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white font-semibold drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)]'
                      : 'text-white/80 hover:text-white hover:drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)] hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* 右侧：设置按钮 */}
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
