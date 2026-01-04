# 产品需求文档 (PRD)：Agent 行为追踪与仪表盘 (MVP)

| 文档信息 | 详情 |
| :--- | :--- |
| **项目** | Anyway - AI 商业化基础设施 |
| **模块** | 仪表盘 - Agent 行为追踪 (Dashboard - Agent Actions Tracking) |
| **版本** | v1.0 (Optimized CN) |
| **状态** | 草稿 (Draft) |
| **作者** | 产品经理 |

---

## 1. 背景与问题空间 (Context & Problem Space)

### 1.1 产品愿景
Anyway 是专为 **AI 初创企业和开发者** 设计的商业化基础设施。与传统的 SaaS 计费系统（如 Stripe）不同，AI 产品面临的是可变的、基于用量的成本结构（例如 LLM Token 消耗）。

**核心痛点：** 商家无法准确计算单体经济效益（毛利），因为他们缺乏一个统一的视角来将 **上游成本（Token/API 调用）** 与 **下游收入（计费）** 连接起来。

### 1.2 MVP 目标
本 MVP 的目标是构建 **“成本计量 (Cost Metering)”** 的基础能力。我们将提供一个仪表盘，用于可视化 AI Agent 的执行能力。通过追踪 Agent 的 “Trace”（执行轨迹），帮助商家明确以下三点：
1.  **成本 (Cost)**：这一次具体的交付（Delivery）花了多少钱？
2.  **行为 (Behavior)**：Agent 执行了哪些步骤？
3.  **结果 (Outcome)**：成功了还是失败了？

---

## 2. 用户画像与待办任务 (User Personas & JTBD)

**目标用户：** AI 代理服务商 (Agencies)、自由职业者、小型 SaaS 团队、Agent 工作室。

| 待办任务 (JTBD) | 用户需求 / 痛点 |
| :--- | :--- |
| **验证单体经济效益** | “我想计算特定客户/项目的真实成本和毛利，而不是靠猜。” |
| **调试与优化** | “我需要知道钱花在哪儿了。哪个步骤最贵或最慢？” |
| **透明度** | “我想给客户提供一份可解释的账单：这是 Agent 做的事情，这是资源消耗。” |
| **无缝集成** | “我想在不重写代码的情况下开始追踪。” |

---

## 3. 核心概念与术语 (Key Concepts & Terminology)

为确保后端、前端和 SDK 之间的一致性，定义以下层级结构：

-   **Merchant (商家)**：Anyway 的客户（即开发者）。
-   **Agent (智能体)**：被追踪的具体 AI 服务或机器人。
-   **Delivery (交付)**：Agent 的一次完整执行工作流（例如，“写一篇博客文章”）。这是计费单元。
-   **Step (步骤)**：Delivery 中的原子操作（例如，“调用 LLM”、“搜索网络”、“执行 Python 代码”）。
-   **Usage (用量)**：每个 Step 的可量化消耗（Token 数、秒数、API 调用次数）。
-   **Cost (成本)**：Usage 对应的货币价值（美元）。

---

## 4. 功能需求：引导与激活 (Onboarding & Activation)

**目标：** 推动商家从 “查看样例数据” 到 “发送第一条真实 Trace”。

### 4.1 空状态：样例数据模式 (Sample Data Mode)
**场景：** 新商家首次登录。
-   **默认视图：** 仪表盘 **不得为空**。应预加载 **样例数据 (Sample Data)**（3-5 个 Demo Deliveries，每个包含 3-6 个 Steps）。
-   **视觉提示：** 仪表盘顶部常驻 **横幅 (Banner)**。
    -   *文案：* “您正在查看样例数据。” (You are viewing sample data.)
    -   *副文案：* “连接 Python SDK 以查看您的第一条实时 Delivery trace。”
    -   *操作：* [连接 Python SDK] 按钮。

### 4.2 集成流程 (Connect Modal)
**触发：** 点击 [连接 Python SDK]。
**交互：** 一个 3 步渐进式清单弹窗。

#### 步骤 1：认证 (Authentication)
-   **操作：** 创建/获取 API Key。
-   **UI：** 复用现有的 “Developers -> API Keys” 组件。
-   **验证：** 用户成功复制 API Key。
-   **状态：** 标记步骤 1 为 ✅。

#### 步骤 2：安装 (Installation)
-   **操作：** 安装 Python SDK。
-   **内容：**
    -   命令：`pip install anyway-sdk`（带复制按钮）。
    -   链接：“查看 API 文档”、“故障排除”。
-   **验证：** 用户点击 “继续”。注意：在接收到数据之前，无法在客户端验证安装，因此这是“软”确认。

#### 步骤 3：验证 (Verification - The "Aha" Moment)
-   **操作：** 发送测试 Trace。
-   **机制：** 用户在自己的环境中使用 SDK 运行代码片段。
-   **反馈循环：**
    -   前端轮询/监听该商家的第一个 `delivery_created` 事件。
    -   **成功：**
        1.  Toast 通知：“收到测试 Delivery！”
        2.  弹窗关闭。
        3.  横幅消失。
        4.  仪表盘刷新显示 **实时数据 (Live Data)**（即刚才的测试 trace）。
        5.  重定向/打开该新 Delivery 的详情视图。
    -   **超时/失败：** 如果 X 秒后未收到数据，显示故障排除提示。

---

## 5. 功能需求：仪表盘 (Delivery List)

**目标：** 提供 Agent 活动和成本的高层视图。

### 5.1 列表字段
| 列名 | 数据源 / 逻辑 | 排序 |
| :--- | :--- | :--- |
| **Delivery ID** | 唯一 UUID（UI 中截断显示） | - |
| **Timestamp (时间戳)** | `created_at`。格式：`YYYY-MM-DD HH:MM` (本地时区) | 默认降序 |
| **Agent** | Agent 名称 <br> 用户邮箱（上下文） | - |
| **Status (状态)** | 徽章：`Success` (绿), `Failed` (红), `Running` (蓝) | 可筛选 |
| **Steps (步骤数)** | 该 Delivery 中的步骤总数 | 降序 |
| **Tokens** | 所有步骤的 Token 总和 | 降序 |
| **Cost (成本)** | 所有步骤的成本总和 (USD) | 降序 |
| **Action (操作)** | “Trace” 按钮（打开详情面板） | - |

### 5.2 筛选与分页
-   **时间范围：** 全局日期选择器（开始时间 - 结束时间）。
-   **状态筛选：** 全部 / 成功 / 失败 (All / Success / Failed)。
-   **分页：** 服务端分页，`page_size=50`。

---

## 6. 功能需求：Delivery 详情 (Trace View)

**目标：** 深入查看单次执行，以审计成本和行为。
**交互：** 侧滑面板 (Slide-over panel)，保留列表上下文。

### 6.1 头部与摘要
-   **头部：** Delivery ID + 状态徽章。
-   **摘要卡片：**
    -   **总成本 (Total Cost)**：`Σ step.cost`
    -   **持续时间 (Duration)**：`ended_at - started_at`
    -   **总 Token 数 (Total Tokens)**：`Σ step.tokens`

### 6.2 执行轨迹 (Execution Trace - Tree List)
采用 **"树状列表 (Tree List)"** 视图，支持无限层级嵌套。

-   **层级结构 (Hierarchy)与交互：**
    -   **Tree Table 模式：** 默认仅展示顶层 Parent Spans。
    -   **展开/折叠：** 用户点击父级左侧的箭头 `▶`，在当前行下方展开显示所有直接子级 Child Spans。
    -   **视觉引导：** 必须使用垂直连接线 (Guide Lines) 连接父子节点，明确从属范围。

-   **列表项内容 (List Item Fields)：**
    -   **Identity (左侧)：**
        -   **Visuals**：折叠箭头 + 缩进连接线 + 图标。
        -   **Name**：步骤名称。
        -   **Model/System**：服务商图标 + 模型名称。
    -   **Metrics (右侧)：**
        -   **Tokens**：仅展示 **Total Tokens** (e.g., "257")。
        -   **Cost**：该步骤成本 ($)。
        -   **Duration**：耗时 (e.g., "1.2s")。
        -   **Status**：状态徽章 (🟢 Success / 🔴 Failed)。

### 6.3 步骤详情面板 (Step Details - Drawer)
点击列表项后，从右侧滑出详情面板。**保持极简**，仅展示该步骤的核心数据。

-   **Configuration (配置)：**
    -   Model: `gpt-4o` (Requested vs Actual)
    -   Parameters: `temperature`, `max_tokens`
-   **Usage Details (用量明细)：**
    -   **Total Tokens**: 257
    -   Input: 97 / Output: 160 (在此处展示明细)
-   **Performance (性能)：**
    -   Finish Reason (`stop`, `length` 等)
    -   Start Time / End Time

---

## 7. 数据逻辑与状态 (Data Logic & States)

### 7.1 状态定义
-   **Running (运行中)：** Delivery 已开始，尚无结束时间。
-   **Success (成功)：** Delivery 已完成，所有步骤成功（或已优雅处理）。
-   **Failed (失败)：** Delivery 已完成，明确标记为失败或因错误超时。

### 7.2 成本计算
-   **单一来源 (Source of Truth)：** 后端根据 `Usage * Price` 计算成本。
-   **灵活性：** SDK 发送 `Usage`（例如，“gpt-4”，500 tokens）。后端将 “gpt-4” 映射为每 1k token 的价格。
-   **显示：** 所有成本以 USD 显示。精度：单价保留 4-6 位小数，汇总保留 2 位小数（或悬停显示完整精度）。

---

## 8. 技术考量 (Technical Considerations - For Devs)

1.  **延迟 (Latency)：** 仪表盘应近乎实时更新。对于 “测试 Trace” 步骤，考虑使用乐观 UI (Optimistic UI) 或轮询。
2.  **幂等性 (Idempotency)：** 确保如果 SDK 重试，不会重复计算同一个 Step。
3.  **数据量 (Data Volume)：** `input` 和 `output` 字段可能很大（文本块）。不要在列表 API 中加载它们；仅在详情 API 中加载。
4.  **SDK 约束：** SDK 定义了 “Delivery” 的边界。如果用户终止进程，Delivery 可能会无限期保持 “Running” 状态。需实现后端超时机制（例如，不活动 1 小时后自动判定失败）或处理 “僵尸 (Zombie)” 状态。
