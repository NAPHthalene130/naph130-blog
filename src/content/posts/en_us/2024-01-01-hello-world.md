---
title: Hello, World
date: 2024-01-01
category: Frontend
coverImg: hello-cover.png
description: This is my very first blog post, documenting the birth of this static blog project.
tags:
  - Vue
  - blog
  - project
pinned: true
draft: false
---

## Origin

I have always wanted a blog that is completely under my control. No backend dependencies, no third-party platforms. All content exists as Markdown files.

Inline image example: [[demo.jpg]]

## Tech Stack

This blog is built with:

- **Vue 3**: The Progressive JavaScript Framework
- **Vite**: Next Generation Frontend Tooling
- **TypeScript**: JavaScript with syntax for types
- **Tailwind CSS**: A utility-first CSS framework
- **markdown-it**: Flexible Markdown parser

## Design Philosophy

### Build-time Rendering

All articles are imported via `import.meta.glob` at build time, packed into the bundle as static strings — zero network requests at runtime.

### Glassmorphism Design

Semi-transparent cards, soft shadows, and refined rounded corners create a light and airy visual experience.

### Multi-language Support

Built-in Chinese and English bilingual support with URL path prefix language detection.

## Features

- Light/Dark mode toggle
- Table of Contents navigation
- Client-side fuzzy search
- Code syntax highlighting with one-click copy
- Image lightbox preview
- Reading progress bar
- Mouse-following ripple background

---

> The best time to plant a tree was 20 years ago. The second best time is now.
