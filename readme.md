# SwiftEase (轻启)

[![License](https://img.shields.io/badge/license-Apache%202-blue.svg)](./LICENSE)
[![CI](https://github.com/CloudSilk/SwiftEase/actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)

[Discord](https://discord.gg/AXgZhNPv) | [Contributing](./CONTRIBUTING.md) | [中文介绍](#中文介绍)

---

## What is SwiftEase?

**SwiftEase** (轻启) is the open-source **low-code platform frontend** behind [CloudSilk MOM](https://github.com/CloudSilk/CloudSilk). It publishes a set of npm packages (`@swiftease/*`) that render entire business applications — CRUD pages, dynamic forms, flow/cell designers — from backend metadata, so product pages are configured rather than coded.

Monorepo managed by yarn workspaces + lerna, built on [Formily](https://formilyjs.org), [antd v5](https://ant.design), [designable](https://github.com/alibaba/designable) and [AntV X6](https://github.com/antvis/X6).

### Packages

| Package | Purpose |
|---------|---------|
| `@swiftease/atali-pkg` | Shared runtime: auth token, request wrappers, routing utils |
| `@swiftease/atali-components` | Business component library |
| `@swiftease/atali-form` | Dynamic form engine (schema-driven Formily renderer) |
| `@swiftease/atali-curd` | Metadata-driven CRUD pages (table/tree/card layouts) |
| `@swiftease/atali-graph` | Graph/flow canvas (X6 based, BPM & cell editing) |
| `@swiftease/formily-antd-v5` | Formily ↔ antd v5 adapter |
| `@swiftease/designable-*` | Form/flow designers (forked from alibaba/designable, v5 adapted) |

### Quick Start

```bash
# prerequisites: Node.js 20+, yarn 1.x
yarn install --ignore-engines   # bootstrap all workspaces
yarn build                      # lerna build all packages (father, ESM output)
```

Consume in an app — see [CloudSilk web](https://github.com/CloudSilk/CloudSilk/tree/main/web) for a real-world setup:

```json
{ "dependencies": { "@swiftease/atali-curd": "^1.0.0", "@swiftease/atali-form": "^1.0.0" } }
```

Examples live in [`examples/`](./examples) (`complex` is the reference app).

### Releasing

```bash
yarn build                          # gate must pass (CI enforces)
lerna publish from-package --yes    # requires npm login (org maintainer)
```

---

# 中文介绍

[Discord](https://discord.gg/AXgZhNPv)

“轻启”(SwiftEase)：低代码平台，让应用轻松启动和运行。作为 [云梭 MOM](https://github.com/CloudSilk/CloudSilk) 的前端底座，通过 `@swiftease/*` npm 包把后端元数据渲染为完整的业务页面——CRUD、动态表单、流程/单元格设计器，产品页面以配置而非编码方式交付。

## 快速开始

```bash
yarn install --ignore-engines
yarn build
```

## 包一览

- `atali-pkg` 公共运行时（鉴权/请求/路由工具）
- `atali-components` 业务组件库
- `atali-form` 动态表单引擎
- `atali-curd` 元数据驱动 CRUD 页面
- `atali-graph` 图形/流程画布（X6）
- `formily-antd-v5` / `designable-*` Formily 适配与设计器（fork 自 alibaba/designable）

## 感谢

- [@formily](https://formilyjs.org) / [antd@5](https://ant.design) / [umijs](https://umijs.org/) / [designable](https://github.com/alibaba/designable) / [Ant Design Pro](https://github.com/ant-design/ant-design-pro) / [AntV X6](https://github.com/antvis/X6)

## 社区

如果微信群二维码过期，请添加社区助手的微信，备注云梭（见 [CloudSilk](https://github.com/CloudSilk/CloudSilk)）。
