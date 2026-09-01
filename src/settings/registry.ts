import { frostedGlassCategory } from './items/frostedGlass';

/**
 * 全局注册的所有设置大类列表
 * 新增配置项时在此数组中追加即可
 */
export const settingCategories = [
  frostedGlassCategory,
] as const;

/**
 * 获取所有设置项的默认值聚合对象
 */
export function getDefaultSettings(): Record<string, Record<string, unknown>> {
  const defaults: Record<string, Record<string, unknown>> = {};
  for (const cat of settingCategories) {
    defaults[cat.field] = { ...(cat.defaultValues as unknown as Record<string, unknown>) };
  }
  return defaults;
}

/**
 * 执行所有大类的 apply 函数，应用当前设置至页面
 */
export function applyAllSettings(settings: Record<string, Record<string, unknown>>): void {
  if (typeof document === 'undefined') return;
  for (const cat of settingCategories) {
    const values = settings[cat.field] ?? (cat.defaultValues as unknown as Record<string, unknown>);
    cat.apply(values as never);
  }
}

/**
 * 按字段名查找对应大类配置
 */
export function getCategoryByField(field: string): (typeof settingCategories)[number] | undefined {
  return settingCategories.find((cat) => cat.field === field);
}
