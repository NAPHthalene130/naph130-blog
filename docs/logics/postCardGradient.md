# 文章卡片封面渐变过渡逻辑 (Post Card Cover Gradient)

应用于“文章（`/posts`）”列表页中文章展示卡片的设计。在维持全站统一的纯净半透明磨砂玻璃卡片底座的前提下，实现封面图片左侧边缘平滑渐隐消融（Gradient Fade Mask）进入磨砂玻璃卡片的视觉效果。

源码文件：
- `src/pages/posts.astro`

---

## 1. 详细实现原理与遮罩技术

### 1.1 纯净磨砂玻璃底座保留
卡片容器严格继承当前项目的磨砂玻璃美学规范：
```html
<article class="group relative flex flex-col md:flex-row items-stretch justify-between rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/25 hover:border-white/40 shadow-sm transition-all duration-300 overflow-hidden">
  <!-- 左侧元数据与内容 -->
  <!-- 右侧渐变封面 -->
</article>
```

### 1.2 CSS 线性透明度遮罩（Linear Alpha Mask）
传统的背景渐变遮罩（`bg-gradient-to-r` 覆盖层）在半透明磨砂玻璃卡片上会产生色块断层，无法真实透出卡片背后的模糊壁纸。
因此改用 **CSS `mask-image` / `-webkit-mask-image` 矢量透明度遮罩**：
```css
mask-image: linear-gradient(
  to right,
  transparent 0%,
  rgba(0, 0, 0, 0.25) 10%,
  rgba(0, 0, 0, 0.85) 30%,
  black 50%
);
-webkit-mask-image: linear-gradient(
  to right,
  transparent 0%,
  rgba(0, 0, 0, 0.25) 10%,
  rgba(0, 0, 0, 0.85) 30%,
  black 50%
);
```
- **左侧 0% ~ 10%**：Alpha 完全透明（`transparent`），封面左边缘彻底隐形，100% 透出磨砂玻璃卡片底色。
- **中间 10% ~ 30%**：S 型非线性透明度插值，呈现平滑自然的烟雾消隐过渡。
- **右侧 50% ~ 100%**：Alpha 恢复为完全不透明（`black`），完整展示高清封面细节。

### 1.3 悬停交互动效
封面图片包裹在 `overflow-hidden` 容器内，结合 `transform group-hover:scale-105 transition-transform duration-500`，在用户光标移入卡片时产生微幅放大景深感，而左侧渐变过渡线始终稳定锚定在卡片内。

---

## 2. 踩坑点与 Bug 修复记录

### 坑 1：使用实体渐变覆层（`from-white`）导致半透明底座被污染
- **现象**：如果在图片左侧覆盖一层 `bg-gradient-to-r from-white`，在半透明磨砂卡片上会看到一块死白色的矩形渐变色块，遮挡了底层的虚化壁纸。
- **修复**：放弃实体颜色渐变覆盖，改用通道级透明度遮罩（`mask-image`），使图片本身的像素直接产生由实入虚的渐隐效果，完美与半透明磨砂底座相融。
