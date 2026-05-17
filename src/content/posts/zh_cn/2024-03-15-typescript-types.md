---
title: TypeScript 类型体操入门
date: 2024-03-15
category: 工程化
description: 从基础泛型到高级类型工具，一步步掌握 TypeScript 类型编程的核心技巧。
tags:
  - TypeScript
  - 工程化
pinned: false
draft: false
---

## 为什么学类型体操

TypeScript 的类型系统是图灵完备的。这意味着你可以**用类型来编程**——在编译期计算、推导、约束你的代码。

## 基础泛型

```typescript
// 最简单的泛型
function identity<T>(arg: T): T {
  return arg
}

// 泛型约束
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length
}
```

## 内置工具类型

TypeScript 提供了大量实用工具类型：

- **`Partial<T>`** — 所有属性可选
- **`Required<T>`** — 所有属性必选
- **`Readonly<T>`** — 所有属性只读
- **`Pick<T, K>`** — 从 T 中选取部分属性
- **`Omit<T, K>`** — 从 T 中排除部分属性

## 条件类型

```typescript
type IsString<T> = T extends string ? 'yes' : 'no'
type A = IsString<'hello'> // 'yes'
type B = IsString<42>      // 'no'
```

## 总结

类型体操不是炫技，而是让你的代码在编译期就杜绝大量潜在 bug。掌握这些技巧，你的 TypeScript 代码会更加安全和优雅。
