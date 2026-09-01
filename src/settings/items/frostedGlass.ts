import type { SettingCategory } from '../types';

export interface FrostedGlassValues {
  enabled: boolean;
  blur: number;
  opacity: number;
  tint: 'white' | 'light' | 'dark';
}

export const frostedGlassCategory: SettingCategory<FrostedGlassValues> = {
  name: '背景磨砂效果',
  field: 'frostedGlass',
  description: '调节背景图的模糊度与遮罩质感',
  icon: 'Sliders',
  defaultValues: {
    enabled: true,
    blur: 12,
    opacity: 35,
    tint: 'white',
  },
  items: [
    {
      field: 'enabled',
      label: '磨砂遮罩开关',
      type: 'switch',
      defaultValue: true,
    },
    {
      field: 'blur',
      label: '模糊强度',
      type: 'slider',
      min: 0,
      max: 30,
      step: 1,
      unit: 'px',
      defaultValue: 12,
    },
    {
      field: 'opacity',
      label: '遮罩浓度',
      type: 'slider',
      min: 0,
      max: 90,
      step: 5,
      unit: '%',
      defaultValue: 35,
    },
    {
      field: 'tint',
      label: '色调风格',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: '纯白', value: 'white' },
        { label: '冷白', value: 'light' },
        { label: '深色', value: 'dark' },
      ],
    },
  ],
  apply: (values: FrostedGlassValues) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (!values.enabled) {
      root.style.setProperty('--glass-blur', '0px');
      root.style.setProperty('--glass-bg', 'transparent');
      root.style.setProperty('--glass-opacity', '0');
    } else {
      root.style.setProperty('--glass-blur', `${values.blur}px`);
      root.style.setProperty('--glass-opacity', `${values.opacity / 100}`);

      if (values.tint === 'white') {
        root.style.setProperty('--glass-bg', `rgba(255, 255, 255, ${values.opacity / 100})`);
      } else if (values.tint === 'light') {
        root.style.setProperty('--glass-bg', `rgba(240, 249, 255, ${values.opacity / 100})`);
      } else {
        root.style.setProperty('--glass-bg', `rgba(15, 23, 42, ${values.opacity / 100})`);
      }
    }
  },
};
