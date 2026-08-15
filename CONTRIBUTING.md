# 贡献指南 | Contributing Guide

感谢关注轻启 SwiftEase！本仓库是 `@swiftease/*` 低代码平台包的源码（yarn workspaces + lerna monorepo），Issue 与 PR 都会被维护者认真处理。

## 开发环境

```bash
# 要求：Node.js 20+、yarn 1.x
yarn install --ignore-engines   # 安装全部 workspace 依赖
yarn build                      # lerna 全量构建（father，ESM 输出）
```

`examples/complex` 是参考应用，可直接调试平台包。

## 提交 PR 前的硬性要求

1. `yarn build` 必须通过（CI 会执行同样门禁）。
2. 涉及某个包的改动，请在该包内自测（消费方视角：`examples/complex` 引用验证）。
3. 跨包 API 变更需同步更新依赖该 API 的下游包（workspace 内部引用同为 `@swiftease/*`）。

## 注意事项

- **antd 版本目前统一钉在 5.18.0**：升级到 5.2x 会触发 formily 适配器的声明生成不可移植问题（TS2742，antd 类型结构与 yarn1 hoist 布局耦合），需要专项处理（显式类型标注或 pnpm），请勿在普通 PR 中顺手升级。
- `designable/*` 是 fork 自 alibaba/designable 的深度定制，改动请保持与上游差异最小化并注明原因。
- 本地示例工程（drawdb/taro/react-admin 等）不纳入版本库（见 .gitignore）。

## 发布流程（维护者）

```bash
yarn build                              # 构建门禁
# 逐包更新 package.json version 后：
lerna publish from-package --yes        # 需要 npm org 维护者凭据
git tag v<version> && git push --tags
```

## 许可证

提交即表示你同意贡献内容以 [Apache 2.0](./LICENSE) 许可证开源。
