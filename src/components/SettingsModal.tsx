import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Sliders } from 'lucide-react';
import { settingCategories, type SettingControlItem } from '@/settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Record<string, Record<string, unknown>>;
  onUpdateValue: (categoryField: string, itemField: string, value: unknown) => void;
  onReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateValue,
  onReset,
}) => {
  const renderControl = (
    categoryField: string,
    control: SettingControlItem<unknown>,
    currentCategoryValues: Record<string, unknown>
  ) => {
    const isCategoryEnabled =
      'enabled' in currentCategoryValues ? Boolean(currentCategoryValues.enabled) : true;
    const value = currentCategoryValues[control.field] ?? control.defaultValue;
    const isDisabled = control.field !== 'enabled' && !isCategoryEnabled;

    switch (control.type) {
      case 'switch':
        return (
          <div key={control.field} className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-neutral-800">{control.label}</span>
            <button
              type="button"
              role="switch"
              aria-checked={Boolean(value)}
              onClick={() => onUpdateValue(categoryField, control.field, !value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner border border-white/50 ${
                Boolean(value)
                  ? 'bg-sky-500 shadow-sky-600/30'
                  : 'bg-white/40 backdrop-blur-md'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.15)] transition-transform duration-300 ${
                  Boolean(value) ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        );

      case 'slider':
        return (
          <div key={control.field} className="space-y-2 py-1">
            <div className="flex justify-between text-xs font-medium text-neutral-700">
              <span>{control.label}</span>
              <span className="text-sky-600 font-semibold drop-shadow-xs">
                {String(value)} {control.unit ?? ''}
              </span>
            </div>
            <input
              type="range"
              min={control.min ?? 0}
              max={control.max ?? 100}
              step={control.step ?? 1}
              disabled={isDisabled}
              value={Number(value)}
              onChange={(e) =>
                onUpdateValue(categoryField, control.field, Number(e.target.value))
              }
              className="w-full h-1.5 bg-neutral-300/60 backdrop-blur-sm rounded-lg appearance-none cursor-pointer accent-sky-500 disabled:opacity-30 transition-opacity"
            />
          </div>
        );

      case 'select':
        return (
          <div key={control.field} className="space-y-2 py-1">
            <span className="text-xs font-medium text-neutral-700 block">{control.label}</span>
            <div className="grid grid-cols-3 gap-2">
              {control.options?.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onUpdateValue(categoryField, control.field, opt.value)}
                  className={`py-2 px-2 text-xs font-medium rounded-xl transition-all duration-200 backdrop-blur-md border ${
                    value === opt.value
                      ? 'border-sky-400 bg-sky-500/20 text-sky-800 font-semibold shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                      : 'border-white/60 bg-white/40 text-neutral-700 hover:bg-white/70 hover:border-white/90 shadow-xs'
                  } disabled:opacity-30`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 背景轻微遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/15 backdrop-blur-xs"
          />

          {/* 凸透镜晶莹面板 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-[28px] p-6 sm:p-7 select-none z-10"
            style={{
              backdropFilter: 'blur(20px) brightness(1.1) saturate(140%)',
              WebkitBackdropFilter: 'blur(20px) brightness(1.1) saturate(140%)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.45) 50%, rgba(240, 249, 255, 0.55) 100%)',
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.2),
                inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.95),
                inset 0 -1.5px 2px 0 rgba(255, 255, 255, 0.4),
                inset 1.5px 0 1.5px 0 rgba(255, 255, 255, 0.6),
                inset -1.5px 0 1.5px 0 rgba(255, 255, 255, 0.6)
              `,
              border: '1px solid rgba(255, 255, 255, 0.75)',
            }}
          >
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 border border-sky-500/20 shadow-xs">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-neutral-800 tracking-tight">设置</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="关闭"
                className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-800 hover:bg-black/5 active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 设置大类与子项渲染 */}
            <div className="py-2">
              {settingCategories.map((category, catIndex) => {
                const categoryValues = settings[category.field] ?? category.defaultValues;
                return (
                  <section
                    key={category.field}
                    className={catIndex > 0 ? 'mt-6 pt-6 border-t border-neutral-200/60' : ''}
                  >
                    {/* 大项标题与描述 */}
                    <div className="mb-3.5">
                      <h4 className="text-sm font-bold text-neutral-800">{category.name}</h4>
                      {category.description && (
                        <p className="text-xs text-neutral-500 mt-0.5">{category.description}</p>
                      )}
                    </div>

                    {/* 小项列表与小项分隔线 */}
                    <div className="space-y-3.5 divide-y divide-neutral-200/50">
                      {category.items.map((control, itemIndex) => (
                        <div key={control.field} className={itemIndex > 0 ? 'pt-3.5' : ''}>
                          {renderControl(category.field, control, categoryValues)}
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* 底部操作 */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-200/50">
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-500 hover:text-neutral-800 hover:bg-black/5 active:scale-95 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>恢复默认</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 active:scale-95 shadow-md shadow-sky-500/20 transition-all"
              >
                完成
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default SettingsModal;
