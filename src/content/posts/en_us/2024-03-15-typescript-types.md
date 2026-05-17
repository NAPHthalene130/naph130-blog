---
title: TypeScript Type Gymnastics
date: 2024-03-15
category: Engineering
description: From basic generics to advanced utility types, master the core techniques of TypeScript type programming step by step.
tags:
  - TypeScript
  - engineering
pinned: false
draft: false
---

## Why Learn Type Gymnastics

TypeScript's type system is Turing-complete. This means you can **program with types** — compute, derive, and constrain your code at compile time.

## Basic Generics

```typescript
// Simplest generic
function identity<T>(arg: T): T {
  return arg
}

// Generic constraints
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length
}
```

## Built-in Utility Types

TypeScript provides many useful utility types:

- **`Partial<T>`** — all properties optional
- **`Required<T>`** — all properties required
- **`Readonly<T>`** — all properties readonly
- **`Pick<T, K>`** — pick selected properties
- **`Omit<T, K>`** — omit selected properties

## Conditional Types

```typescript
type IsString<T> = T extends string ? 'yes' : 'no'
type A = IsString<'hello'> // 'yes'
type B = IsString<42>      // 'no'
```

## Summary

Type gymnastics is not about showing off — it eliminates potential bugs at compile time. Master these techniques and your TypeScript code will be safer and more elegant.
