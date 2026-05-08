# AI Sight

> 多 Agent 提示词工程工作台 — 一个展示 AI Agent 长链推理与多模型协作能力的原型工具

[![Platform](https://img.shields.io/badge/Platform-Pure%20Frontend-brightgreen)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## 🎯 项目概述

**AI Sight** 是一个面向 AI 创作者的多 Agent 协作提示词生成与管理工作台。

针对当前 AI 创作者在多模型协作（Midjourney + Kling + Suno 等）中面临的**提示词管理混乱、版本迭代困难、跨工具提示词适配成本高**的痛点，设计了三 Agent 协作架构，实现从创作需求输入到多模型提示词产出的全链路自动化。

---

## 🤖 核心架构

```
用户输入创作需求
        ↓
┌──────────────────────────────────────┐
│  🔍 理解 Agent（Understanding）       │
│  解析需求 · 拆解任务 · 提取关键词      │
└──────────────────────────────────────┘
        ↓
┌──────────────────────────────────────┐
│  ✨ 生成 Agent（Generation）          │
│  Midjourney · Kling · Suno 提示词     │
│  多版本迭代 · 质量评估                 │
└──────────────────────────────────────┘
        ↓
┌──────────────────────────────────────┐
│  ⚡ 执行 Agent（Execution）            │
│  工具链模拟 · 执行报告 · 导出功能       │
└──────────────────────────────────────┘
```

### 三个 Agent 的分工

| Agent | 职责 | 展示能力 |
|---|---|---|
| **理解 Agent** | 解析用户需求 → 拆解为结构化任务 | 自然语言理解、任务拆解 |
| **生成 Agent** | 针对每个 AI 工具生成专用提示词 | 多模型适配、提示词工程 |
| **执行 Agent** | 模拟完整工具链调用流程 | Agent 工作流、Function Calling 模拟 |

---

## ✨ 功能特性

- 📝 **需求输入面板** — 支持自由输入或快速示例选择
- 🔍 **理解 Agent** — 实时展示需求解析过程（打字机效果）
- ✨ **生成 Agent** — 同时生成 MJ / Kling / Suno 三种提示词
- ⚡ **执行 Agent** — 可视化工具链调用全流程
- 📋 **Tab 切换输出** — 分工具查看和复制提示词
- 📦 **一键导出** — 导出完整提示词包
- 🎨 **深色科技感 UI** — SVG 动画流程图 + 流畅交互
- 🔄 **纯本地运行** — 零 API 成本，零网络依赖，双击即用
- 📚 **工作流模板市场** — 9 个内置模板，覆盖图像/视频/音乐/文案
- 🌐 **社区模板库** — 连接 GitHub Gist，一键导入社区模板
- ⭐ **收藏系统** — 收藏常用模板，快速调用
- 📥📤 **导入/导出** — JSON 格式备份与恢复模板数据

---

## 🛠️ 技术栈

| 层级 | 技术 |
|---|---|
| 结构 | HTML5 + CSS3（原生，无框架） |
| 逻辑 | 原生 JavaScript（ES6+） |
| 动画 | CSS Animations + SVG + Canvas-free |
| 架构 | 三 Agent 协作（模拟模式） |
| 部署 | 零依赖 · 浏览器直接打开即用 |

---

## 📂 文件结构

```
├── index.html          # 主界面（4 模式：生成/解析/转换/模板）
├── app.js              # 主逻辑 + 社区功能
├── css/
│   └── style.css       # 深色科技感样式
├── js/
│   ├── agents.js       # Agent 模拟逻辑
│   └── animation.js    # 动画效果
├── data/
│   ├── prompts.js      # 提示词模板库
│   └── templates.js    # 官方工作流模板数据
└── README.md           # 本文档
```

---

## 🚀 快速开始

**方式一：直接打开**
```
双击 index.html 在浏览器中打开即可
```

**方式二：本地服务器**
```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .
```
访问 `http://localhost:8080`

---

## 🌐 社区模板库

AI Sight 支持从 GitHub Gist 读取社区模板：

- **Gist 地址**：[github.com/lzw-DDS](https://gist.github.com/lzw-DDS/d7bf5665a038c6a0a717fdea13fa622f)
- **功能**：一键导入社区模板 → ⭐ 收藏到本地 → 导出备份 JSON

在「模板市场」模式中点击「🌐 社区模板库」即可使用。

---

## 🔮 后续规划

- [ ] 增加更多 AI 工具支持（Stable Diffusion、DALL-E 等）
- [ ] 提示词版本管理与 A/B 测试对比
- [ ] 多语言界面支持

---

## 📄 License

MIT License — 可自由使用、修改和分发
