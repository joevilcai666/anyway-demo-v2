# 产品需求文档 (PRD)：Product Catalog & Pricing Agent (MVP)

| 文档信息 | 详情 |
| :--- | :--- |
| **项目** | Anyway - AI 商业化基础设施 |
| **模块** | Product Catalog - Products & Pricing Agent |
| **版本** | v1.1 (Optimized CN) |
| **状态** | 草稿 (Draft) |
| **作者** | 产品经理 |
| **更新时间** | 2026-01-04 |

---

## 1. 背景与问题空间 (Context & Problem Space)

### 1.1 产品背景
- Anyway 是面向 AI 应用与 API 型业务的商业化基础设施，负责“成本计量 → 定价 → 收款”一体化闭环。
- 当前已接入 Stripe Connect 用于收款和结算，Payment/Finance 模块负责交易与资金流。
- 现状缺口：缺少一个清晰的 Product Catalog 模块，将 Agent/服务包装成可售卖商品（Offer），并在定价环节提供智能辅助。

### 1.2 核心痛点
- 商户缺乏系统化方式把 Agent / API / 服务定义为可售卖商品，并快速生成可收款的链接。
- 商户对“该收多少钱”高度不确定：One-time / Subscription / Usage-based 三种模型各有复杂性，容易出现“卖得越多越亏”的情况。
- 市面工具多停留在“收款”层面，缺乏对单位经济学（成本 → 毛利）与护栏机制的支持。

---

## 2. MVP 目标 (MVP Goals)

### 2.1 MVP 目标
- 打通闭环：创建商品 → 选择收入模型 → 获取定价建议 → 确认价格 → 生成可分享收款链接 → 观察点击与支付转化。
- 智能定价的定位：提供**可解释建议 + 成本护栏**，不做自动改价或动态定价。

### 2.2 成功标准（用于验收与复盘）
- 商户 0→1 激活：
  - 能在一次会话内完成：创建商品 + 发布 + 生成链接。
  - TTFP（Time To First Payment）可被观测（至少能从事件中计算）。
- 定价建议有效性：
  - 有一定比例商户会请求建议并采纳（通过埋点衡量）。

---

## 3. 用户画像与待办任务 (User Personas & JTBD)

### 3.1 目标用户
- AI Agent 开发者 / 小团队创始人：希望快速开始收费，对成本/毛利有感知但缺乏定价经验。
- API / 开发者平台：提供调用型 API，希望按用量收费，并能避免低价导致亏损。

### 3.2 典型场景
- 场景 1：给一个新 Agent 做一次性收费上架并生成收款链接。
- 场景 2：为工具类产品配置订阅价格并通过链接收款。
- 场景 3：为 API 服务设计按用量单价与最低消费，并通过链接收款。

### 3.3 JTBD 表
| 待办任务 (JTBD) | 用户需求 / 痛点 |
| :--- | :--- |
| 快速把 Agent 变成可卖商品 | “我想快速生成一个可分享的收款链接开始收费。” |
| 获取可执行的定价起点 | “我不知道该收多少钱，希望有一个区间与理由可参考。” |
| 避免亏损与毛利失控 | “我担心成本太高导致卖得越多亏得越多，需要护栏提醒。” |
| 观察转化并复盘定价 | “我想知道链接是否有效、价格是否合理，并据此迭代。” |

---

## 4. 范围与不做什么 (Scope)

### 4.1 In Scope（本期范围）
- Product Catalog：
  - 商品列表与详情（含空状态与筛选）。
  - 创建商品向导：名称、描述、收入模型选择、价格配置、定价建议。
  - 收款链接生成：基于 Stripe/Payment 能力生成 Payment Link，并追踪点击/转化。
- 收入模型：
  - One-time（一次性）。
  - Subscription（至少支持月/年）。
  - Usage-based（单位定义 + 单价 + 最低消费/预付额度为主；计量与结算依托 Stripe/Payment）。
- Pricing Agent：
  - 三种模型的结构化输入 → 推荐区间（min/typical/max）→ 护栏价（floor）→ 一键应用。
- 数据与埋点：
  - 商品创建/发布漏斗；链接点击/结账/支付回流；建议请求/采纳情况。

### 4.2 Out of Scope（本期明确不做）
- 自动改价、A/B 测试、多价格并行实验、实时动态定价。
- Usage-based 端到端计量与对账系统（按调用/token/时长的自动化计量与争议处理）。
- 税务、发票、多币种 FX 等复杂结算能力。

---

## 5. 功能需求 (Functional Requirements)

### 5.1 Products 列表页（含空状态）
**目标：** 让商户快速看到已有商品与状态，并能创建新商品。

- 有数据状态（表格）字段：
  - Product（名称）
  - Revenue Model（One-time / Subscription / Usage-based）
  - Default Price（金额 + 币种 + 周期/单位）
  - Status（Draft / Published / Archived）
  - Last 7d Payments（简版数字）
- 空状态：
  - 强视觉引导 + 主按钮「Add a Product」。
- 筛选：
  - Status：All / Draft / Published / Archived。

### 5.2 Add a Product 创建向导（Wizard）
**目标：** 让 merchant 在 3–4 步完成商品定义、定价建议、价格确认与链接生成（一期优先简化实现复杂度，减少字段与自动化推导）。

#### Step 1：基础信息
- 字段：
  - Product Name（必填）
  - Deliverable Description（选填，支持 placeholder 示例）
- 校验规则：
  - name 非空
  - 名称唯一性（在同一 merchant 下）

#### Step 2：收入模型选择（Revenue Model）
- 三选一：
  - One-time / Subscription / Usage-based
- 每个模型展示简短说明与典型场景示例。

#### Step 3：智能定价输入（Pricing inputs）
- Target customer type（单选）：
  - 个人用户/小团队
  - Small Business（10-50 人）
  - 成长型企业（50+ 人）
- Use case category：
  - 如：文档分析、代码审查、营销内容生成…
- 成本（Cost）：
  - 若有 Trace：
    - 支持选择 1 个或多个历史 Trace（Delivery）作为参考，系统展示“平均 workflow 成本（只读）”
    - 允许手动填写额外的 API 成本（可选）
  - 若无 Trace：
    - 手动填写成本（可选）
- （待定）Value type：
  - 节省时间 / 增收 / 降本
- （待定）Human Equivalent Value：
  - 如：同样工作人工的成本

#### Step 4：价格确认（Price）
- Price 表单（按 revenue_model 变化）：
  - One-time：Price amount + Currency
  - Subscription：Amount + Currency + Billing period（Monthly/Yearly）
  - Usage-based：Unit price + Currency
- Pricing Agent 推荐定价卡片：
  - 推荐区间 min / typical / max
  - assumptions / rationale（可折叠）
  - Apply：一键把 typical 写入 Price 表单

#### Step 5：生成收款链接（Payment Link）
- 基于当前 Product + Revenue Model + Price 生成收款链接
  - 若当前 Product 仍为 draft：在创建链接前自动 publish（或提示用户发布后继续）
- 展示 URL + 一键复制

### 5.3 收款链接生成（Payment Link）
**目标：** 生成可分享链接，并为后续归因与表现统计提供最小数据闭环。

- 行为：
  - 基于当前 Product + 默认 Price 生成 PaymentLink。
  - 展示 URL（或短链）+ 一键复制。
  - 支持禁用链接（例如商品归档后自动禁用）。

### 5.4 商品详情与表现（Product Detail）
**目标：** 让用户看到商品基本信息、价格与链接表现，支持复盘定价与转化。

- 基础信息：
  - 名称、描述、收入模型、默认价格、状态。
- 表现（简版）：
  - 最近 7/30 天：Clicks、Checkout started、Paid、转化率。
- 定价建议摘要：
  - 最近一次 recommendation 摘要与采纳情况（是否采纳/修改幅度）。

---

## 6. 数据逻辑与状态 (Data Logic & States)

本章节用“研发要做什么”的语言描述核心概念，覆盖数据模型、状态机、权限与 API，便于拆解任务。

### 6.1 数据模型（MVP 必需）

#### 6.1.1 Product（商品）
- 用途：承载“卖什么（Offer）”，并作为 Pricing 与 PaymentLink 的归属对象。
- 必需字段：
  - product_id
  - merchant_id
  - name
  - deliverable_description（可选）
  - status：draft / published / archived
  - created_at / updated_at
- 规则：
  - archived 不可生成新链接；已生成链接一期默认禁用。

#### 6.1.2 Price（价格方案）
- 用途：承载“怎么收费”，一个 Product 可有多个 Price，一期只要求有一个默认 Price。
- 必需字段（通用）：
  - price_id
  - product_id
  - revenue_model：one_time / subscription / usage_based
  - currency
  - is_default
  - created_at / updated_at
- One-time 字段：
  - unit_amount
- Subscription 字段：
  - unit_amount
  - billing_period：monthly / yearly
  - trial_period_days（可选，一期允许不做）
- Usage-based 字段：
  - unit_amount（单价）
  - usage_unit_name（例如：API call / 1K tokens / run）
  - usage_unit_description（可选）
  - minimum_charge（可选）

#### 6.1.3 PaymentLink（收款链接）
- 用途：生成可分享的链接，绑定 Product + 默认 Price，用于归因与表现统计。
- 必需字段：
  - payment_link_id
  - product_id
  - price_id
  - url（来自 Stripe/Payment 模块）
  - status：active / disabled
  - created_at
- 规则：
  - Product archived 时，关联的 PaymentLink 必须 disabled。

#### 6.1.4 PricingInputSnapshot（定价输入快照）
- 用途：记录一次“定价建议请求”的结构化输入，支持追溯与复盘。
- 必需字段：
  - snapshot_id
  - product_id
  - revenue_model
  - raw_inputs（JSON，存储表单结构化输入）
  - created_by（user_id）
  - created_at
- 规则：
  - raw_inputs 不包含任何终端客户 PII，只包含商户自身定价信息（成本/价值/频次等）。

#### 6.1.5 PricingRecommendation（定价建议结果）
- 用途：保存 LLM 输出的推荐区间与解释，供 UI 展示与“Apply”动作使用。
- 必需字段：
  - recommendation_id
  - snapshot_id
  - recommended_min_price / recommended_typical_price / recommended_max_price
  - confidence_level：low / medium / high
  - assumptions（JSON：关键假设列表）
  - rationale（JSON：结构化理由）
  - llm_model
  - prompt_version
  - schema_version
  - applied_to_price_id（可选）
  - created_at

### 6.2 状态机与权限（MVP）
- Product status：
  - draft：可编辑；不可被外部购买；一期默认不允许生成链接。
  - published：可生成链接；可被外部购买。
  - archived：只读；不可生成链接；已有链接需禁用。
- PaymentLink status：
  - active：可访问。
  - disabled：访问时提示“Link is disabled”并返回安全页（由 Payment 模块或前端承接）。
- 权限：
  - 仅 merchant 成员可 CRUD 自己的 Product/Price/Link。
  - 请求定价建议一期不做角色细分。

### 6.3 API 需求（以 Console 为主）
- Products：
  - POST /products：创建 Product（返回 draft）
  - GET /products：列表（支持 status filter）
  - GET /products/{id}：详情（含默认 Price、最新 recommendation 摘要、links 摘要）
  - PATCH /products/{id}：编辑基础信息
  - POST /products/{id}/publish：发布
  - POST /products/{id}/archive：归档
- Prices：
  - POST /products/{id}/prices：创建/更新默认 Price（一期允许覆盖写）
  - GET /products/{id}/prices：列表（一期可只返回 default）
- Payment links：
  - POST /products/{id}/payment-links：生成链接（绑定默认 Price）
  - GET /products/{id}/payment-links：列表与表现摘要
  - POST /payment-links/{id}/disable：禁用
- Pricing：
  - POST /products/{id}/pricing-snapshots：保存定价输入（或与 recommendation 请求合并）
  - POST /products/{id}/pricing-recommendations：请求定价建议（同步返回结果，或返回 job_id 轮询）
  - POST /pricing-recommendations/{id}/apply：把 typical 写入默认 Price，并记录 applied_to_price_id

### 6.4 埋点与归因（MVP）
- Catalog 行为事件（由前端采集）：
  - catalog_product_created
  - catalog_product_published
  - pricing_recommendation_requested
  - pricing_recommendation_received
  - pricing_recommendation_applied
  - payment_link_created
- Link 漏斗事件（从 Payment/Stripe 回流或 Webhook 生成）：
  - payment_link_clicked
  - checkout_started
  - payment_succeeded

---

## 7. 定价建议与确认（PricingRecommendation）一期实现（LLM Workflow）

本章节定义一期如何搭建“定价建议与确认”的端到端 workflow。目标是：结构化输入 → 可解释输出 → 价格确认 → 可追溯落库。为降低一期复杂度，不引入确定性护栏计算（floor price），成本信息以“输入/参考”形式进入模型推理。

### 7.1 触发时机与输入来源
- 触发时机：
  - 在创建向导 Step 4（价格确认）页面，用户点击「Get pricing suggestion」触发。
  - Step 3 的 inputs 变更后，需要用户显式点击重新生成（避免自动频繁调用）。
- 输入来源（组装为一份请求 payload）：
  - Product：name、deliverable_description（可为空）。
  - revenue_model：one_time / subscription / usage_based。
  - Price context（来自 Step 4 表单）：currency；subscription 的 billing_period；usage_based 的 unit 定义（若在 Step 4 承载）。
  - Pricing inputs（来自 Step 3 表单）：
    - target_customer_type
    - use_case_category
    - cost_inputs（manual_cost / trace_cost_estimate / extra_api_cost）
    - （待定）value_type / human_equivalent_value

### 7.2 一期 workflow 步骤（服务端为主）
1. 校验与归一化
   - 校验必填字段：name、revenue_model、currency、必要的 price context（例如 subscription 的 billing_period）。
   - 归一化金额与单位（例如把成本统一为货币金额；usage-based 的推荐价格明确为“per unit”）。
2. 组装成本参考（可选）
   - 若用户选择 Trace（Delivery）：
     - 从系统读取所选 Trace 的总成本，计算平均 workflow 成本（只读展示值）
     - 若用户填写 extra_api_cost，将其叠加为 cost_estimate（用于提示模型）
   - 若无 Trace：
     - 使用 manual_cost（若填写）作为 cost_estimate
3. 组装 LLM prompt（见 7.3）
4. 调用 LLM 生成建议
   - 一期建议固定模型参数：
     - temperature 偏低（强调稳定与可复现）
     - 输出必须为 JSON，便于校验与渲染
5. 输出校验与安全处理
   - JSON schema 校验：字段齐全、类型正确、价格区间合理（min ≤ typical ≤ max）。
   - 基础合理性校验：
     - recommended_* 必须为正数
     - usage_based 下推荐的价格单位必须明确为“per unit”
   - 若 LLM 输出无法解析/校验失败 → 走降级策略（见 7.5）
6. 落库与返回
   - 保存 PricingInputSnapshot（含 trace_id(s) 与 cost_estimate 的来源）
   - 保存 PricingRecommendation（包含 llm_model、prompt_version、schema_version）
   - 返回给前端用于渲染推荐卡片
7. 用户确认与应用
   - 「Apply」动作将 recommended_typical_price 写入默认 Price，并在 recommendation 上记录 applied_to_price_id
   - 用户手动修改价格时，不修改 recommendation

### 7.3 Prompt 规范（一期模板）

#### 7.3.1 System Prompt（建议）
你是资深 B2B SaaS 定价顾问，面向 AI Agent / API / 开发者工具。你需要基于用户提供的结构化信息输出可执行的定价建议。

规则：
- 不要承诺收益，不要输出“保证”类话术。
- 如果信息不足，必须降低置信度，并在 assumptions 中明确缺失点。
- 输出必须为严格 JSON，不包含任何额外文本。
- 输出价格必须使用输入的 currency。
- 输出必须满足：recommended_min_price ≤ recommended_typical_price ≤ recommended_max_price。

#### 7.3.2 User Prompt（输入 payload 示例）
```json
{
  "product": {
    "name": "string",
    "deliverable_description": "string"
  },
  "revenue_model": "one_time | subscription | usage_based",
  "currency": "USD",
  "price_context": {
    "billing_period": "monthly | yearly",
    "usage_unit_name": "string"
  },
  "inputs": {
    "target_customer_type": "individual_or_small_team | small_business | growth_enterprise",
    "use_case_category": "string",
    "cost_inputs": {
      "trace_ids": ["string"],
      "trace_avg_workflow_cost": 0,
      "manual_cost": 0,
      "extra_api_cost": 0,
      "currency": "USD"
    },
    "value_type": "save_time | increase_revenue | reduce_cost | unknown",
    "human_equivalent_value": "string"
  }
}
```

#### 7.3.3 Output Schema（一期必须字段）
```json
{
  "recommended_min_price": 0,
  "recommended_typical_price": 0,
  "recommended_max_price": 0,
  "confidence_level": "low | medium | high",
  "assumptions": [
    {
      "title": "string",
      "detail": "string"
    }
  ],
  "rationale": [
    {
      "title": "string",
      "detail": "string"
    }
  ]
}
```

### 7.4 一期输出到 UI 的映射规则
- 推荐区间
  - 展示 min / typical / max 三点，并对 typical 提供「Apply」按钮。
- 置信度
  - confidence_level 显示为 Badge（Low/Medium/High），并可悬浮查看原因（来自 assumptions）。

### 7.5 降级策略与失败处理（MVP 必须）
- LLM 请求失败/超时/输出不合规：
  - 返回“无法生成建议”的状态给前端，提供重试按钮。
  - 用户仍可手动填写价格并继续生成链接（不阻塞闭环）。
- 数据异常（用户填 0、负数、极端值）：
  - 服务端在校验阶段直接拦截，提示用户修正输入。

### 7.6 可观察性与版本管理（MVP 必须）
- 每次定价建议必须落库：
  - llm_model、prompt_version、schema_version、created_by、created_at。
  - 便于复现线上问题、对比不同 prompt 的效果。
- 建议在服务端生成 correlation_id，用于串联：
  - PricingInputSnapshot → PricingRecommendation → Apply 行为 → 后续转化表现。

---

## 8. 指标与埋点 (Metrics & Instrumentation)

### 8.1 关键产品指标
- TTFP（Time To First Payment）：商户从创建商品到首单支付的时间。
- 商品创建完成率：开始创建 → 保存为 draft/published 的比例。
- 定价建议使用率：
  - 请求建议的商品占比。
  - 采纳建议的比例（直接应用 typical 或在其附近微调）。
- 链接转化漏斗：
  - Click → Checkout started → Paid。

### 8.2 埋点事件（示例）
- catalog_product_created
- catalog_product_published
- pricing_recommendation_requested
- pricing_recommendation_applied
- payment_link_created
- payment_link_clicked
- checkout_started
- payment_succeeded

---

## 9. 技术考量与非功能需求 (Technical Considerations)

### 9.1 性能
- 商品列表支持在 100 个商品量级下流畅加载。
- 定价建议请求响应时间目标：< 5 秒（端到端）。

### 9.2 安全与合规
- 不在定价建议中提供保证收益或投资建议式文案。
- 存储的 PricingInputSnapshot 与 Recommendation 中，不包含最终用户的敏感隐私信息。

### 9.3 可观察性与审计
- 每次 PricingRecommendation 都保留输入/输出与触发人信息，支持后续审计与问题排查。

---

## 10. 依赖与风险 (Dependencies & Risks)

### 10.1 外部依赖
- Stripe Connect 的账户能力与 Payment 模块提供的 API。
- 大模型服务（定价 Agent 调用的 LLM）。

### 10.2 主要风险
- 成本数据不完整导致定价建议不准确。
- 商户对建议的预期过高，需要通过文案与 UI 控制期望。

---

---

## 11. 里程碑建议（示意） (Milestones)

- Milestone 1：Product + Price + PaymentLink 基础能力，支持手动定价。
- Milestone 2：PricingInputSnapshot + PricingRecommendation（L1 护栏型能力）。
- Milestone 3：商品详情中的基本漏斗数据与定价建议结果展示。
