# thaterror 🛡️

[![npm version](https://img.shields.io/npm/v/@thaterror/core.svg)](https://www.npmjs.com/package/@thaterror/core)
[![Bun Checked](https://img.shields.io/badge/Bun-checked-blue?logo=bun&logoColor=white)](https://bun.sh)
[![codecov](https://codecov.io/gh/tarnishablec/thaterror/graph/badge.svg?token=69B4KK0WSH)](https://codecov.io/gh/tarnishablec/thaterror)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/tarnishablec/thaterror/unit-test.yml)
![GitHub License](https://img.shields.io/github/license/tarnishablec/thaterror)
![bundle size](https://img.shields.io/bundlephobia/minzip/@thaterror/core)
![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label)
[![CodeQL Analysis](https://github.com/tarnishablec/thaterror/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/tarnishablec/thaterror/actions/workflows/codeql-analysis.yml)
[![Total TypeScript](https://img.shields.io/badge/Types-100%25%20Safe-blue)](https://github.com/tarnishablec/thaterror)
[![No Any](https://img.shields.io/badge/Any-None-success)](https://github.com/tarnishablec/thaterror)

A concise, type-safe error handling toolkit for TypeScript inspired by Rust's thiserror. Use the
`@thaterror/core` package to define domain-driven error families with zero boilerplate, then adopt
or serialize them with optional adapters (for example, a `pino` adapter is available).

## The Core Value

Handling `Error` in large-scale TypeScript projects can be frustrating:

- `instanceof` is not always reliable across different packages, multiple versions, or due to structural typing matches.
- Error context (Payload) is often lost during propagation.
- Integrating third-party errors (e.g., `Hono`, `TypeORM`, `SyntaxError`) into your domain model usually requires messy
  manual conversion.

`thaterror` solves these with a **Schema-first** philosophy, bringing **Rust-like ergonomics** to TypeScript error
handling.

## ✨ Features

- **🎯 Zero Boilerplate**: A single `That` call generates error factories with built-in type guards and payload
  support.
- **🏗️ Domain-Driven**: Define error families that encapsulate your business logic.
- **🌉 Native Integration**: "Naturalize" external errors into your family using `enroll` and `bridge`.
- **🧠 Intelligent Transformation**: The `from` method provides strict type checking, ensuring only registered error
  types are processed.
- **🦾 Total Type Safety**: Perfect type narrowing that automatically infers payload types from your schema.
- **🦀 thiserror-like Experience**: Declarative, robust, and designed for developers who value type correctness.

## 🚀 Quick Start

This repository is split into focused packages:

- [@thaterror/core](./packages/core) — the main library: how to define errors, strong typing, adapters.
- [@thaterror/pino-adapter](./packages/pino-adapter) — a small adapter to serialize `ThatError` instances for `pino`.

Installation

To use the core library:

```bash
bun add @thaterror/core
// or with npm
npm install @thaterror/core
```

If you want the pino adapter for structured logging:

```bash
bun add @thaterror/pino-adapter pino
```

Contributing

See the individual package READMEs for development and testing instructions.

## 📜 License

[MPL-2.0](https://github.com/tarnishablec/thaterror/blob/main/LICENSE)
