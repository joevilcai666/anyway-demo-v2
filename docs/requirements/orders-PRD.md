# 产品需求文档 (PRD)：Orders（MVP）

| 文档信息 | 详情 |
| :--- | :--- |
| **项目** | Anyway - AI 商业化基础设施 |
| **模块** | Orders（收款记录） |
| **版本** | v1.0 |
| **状态** | 草稿 (Draft) |
| **作者** | 产品经理 |
| **更新时间** | 2026-01-05 |

---

## 1. 背景与问题空间 (Context & Problem Space)

### 1.1 产品背景
- Anyway 已接入 Stripe Connect 作为 merchant 的收款与结算基础设施。
- 当前 Console 已具备 Products、Payments、Finance 等模块，但缺少一个面向 merchant 的“订单/收款记录”检索与追溯入口。

### 1.2 核心痛点
- merchant 无法在 Console 中以“商品/用户/时间”维度快速定位一笔收款记录，用于对账、开通会员权限或排查支付问题。
- 现阶段依赖 Stripe Dashboard 进行排查会造成上下文割裂：无法直接对齐 Anyway 内的 Product 与 merchant 的用户标识（external_user_id 等）。

---

## 2. MVP 目标 (MVP Goals)

### 2.1 MVP 目标
- 提供一个稳定、可检索、可导出的 Orders 记录入口，满足 merchant 的日常对账与排障。
- 交互形态与 Trace 详情一致：列表 + 侧滑详情，保留上下文并提升效率。
- 为自动化场景提供最小开发者出口：Payment Data API（配合 API Key）让 merchant 可在后端同步收款记录并自动开通会员权限。

### 2.2 成功标准（验收口径）
- 商户能在 30 秒内完成：按时间范围与商品/状态定位一笔订单 → 打开详情 → 跳转 Stripe 核验。
- Orders 列表支持基础筛选（时间/状态/商品）与服务端分页，在 10k 订单量级下仍可用。
- CSV 导出可用：能按日期范围导出并包含核心字段，导出文件与筛选条件一致。

---

## 3. 用户画像与待办任务 (User Personas & JTBD)

### 3.1 目标用户
- AI 应用/Agent 开发者与小团队：以“收款→交付/开通权限”为核心工作流，需要快速对账与排查支付问题。
- API/开发者平台：需要把收款记录同步进自有系统（CRM、权限系统、数据仓库），偏好 API-first 的数据获取方式。

### 3.2 JTBD 表
| 待办任务 (JTBD) | 用户需求 / 痛点 |
| :--- | :--- |
| 快速检索收款记录 | “我想按时间/商品/用户快速找到某笔付款记录。” |
| 对账与排障 | “我需要确认订单金额、币种、状态，以及失败/退款原因，并能追溯到 Stripe。” |
| 交付与权限开通 | “我需要在订单成功后快速给用户开通会员/额度，最好能自动化。” |
| 导出数据 | “我需要导出一段时间内的收款记录做对账或归档。” |

---

## 4. 范围与不做什么 (Scope)

### 4.1 In Scope（本期范围）
- Orders 列表页：
  - 查询：时间范围、商品、状态。
  - 分页：服务端分页，默认按创建时间降序。
  - 导出：按日期范围与行数上限导出 CSV。
- Orders 详情（侧滑面板）：
  - 展示订单的核心字段、支付信息、退款信息、关键元数据与 Stripe 追溯链接。
- Developer 出口（与 Developers 模块联动）：
  - Payment Data API Key（复用 Developers/API Keys 的交互与权限体系）。
  - Payment Data API：支持按条件拉取 Orders 记录（只读）。

### 4.2 Out of Scope（本期明确不做）
- 在 Console 内完成退款/部分退款流程、处理 dispute/chargeback、订阅重试与催收、会计口径报表（收入确认）。
- 自定义列/自定义字段建模、复杂权限矩阵、自动化规则引擎。
- 多币种换汇（FX）与税务/发票流程。

---

## 5. 核心概念与术语 (Key Concepts & Terminology)

- **Order（订单/收款记录）**：merchant 的一次“购买结果”记录，是 Orders 模块的核心对象。用于对齐 merchant 的 Products 与其 Users，并能追溯到 Stripe 对应对象。
- **User（买家）**：merchant 的终端用户，至少包含 email 或 external_user_id（其一可为空，但不应同时为空）。
- **Product（商品）**：对齐 Products 业务模块中的商品（Offer）。
- **Payment Object（Stripe 支付对象）**：PaymentIntent / Charge / Checkout Session / Invoice 之一或多种的组合。MVP 内统一抽象为可追溯的 `stripe_payment_object`。
- **Refund（退款）**：Stripe Refund；MVP 仅展示，不提供操作入口。

---

## 6. 功能需求 (Functional Requirements)

### 6.1 Orders 列表页

#### 6.1.1 页面目标
- 让 merchant 以最少步骤定位一笔收款记录，并进入详情查看收款细节与 Stripe 追溯入口。

#### 6.1.2 页面结构（信息架构）
- 顶部：页面标题 + 辅助描述（可选）+ 主操作「Export CSV」
- 筛选区：
  - 时间范围（必有）：默认 Last 7 days，可切换自定义起止
  - Product（可选）：下拉选择
  - Status（可选）：All / Paid / Failed / Refunded / Partially refunded / Pending
- 列表区：表格 + 分页

#### 6.1.3 表格字段（MVP 必须列）
| 列名 | 规则 |
| :--- | :--- |
| **Date** | `YYYY-MM-DD HH:mm`，本地时区 |
| **Product** | Product name（缺失则展示 “Unknown”） |
| **Customer** | 优先展示 email；若无则展示 external_user_id |
| **Status** | Badge：Paid / Failed / Refunded / Partially refunded / Pending |
| **Amount** | `amount + currency`，保留 2 位小数（或按币种规则） |

#### 6.1.4 表格字段（可选列，默认隐藏或二期）
- Payment method（card / bank / …）
- Stripe ID（可复制）
- Refund amount（若有）

#### 6.1.5 交互与规则
- 点击行：打开右侧侧滑详情面板（与 Trace View 的交互一致），保留列表上下文。
- 分页：
  - 服务端分页，默认 page_size=50，可选 20/50/100
- 查询条件变更：
  - 立即刷新列表（无需额外“Search”按钮）

### 6.2 Order 详情（侧滑面板）

#### 6.2.1 目标
- 在不跳离 Orders 列表的情况下，看到“一笔订单的可执行信息”

#### 6.2.2 信息结构（MVP 必须，需与截图保持一致的层级）
- 顶部 Header（与截图一致）：
  - 主标题：`amount + currency`（大号展示）
  - 副标题：`From {customer_email}`（优先 email；无 email 则展示其他用户标识）
  - 右上角：关闭按钮（X）
- Header 底部：`Begin refund` 功能按钮
- 板块一：Payment details
  - Status：Badge
  - Date received：`YYYY-MM-DD HH:mm`
  - Product：Product name（缺失则展示 “Unknown”）
  - Amount：`amount + currency`
  - Processing fees：若可用则展示（可折叠展开费用细项；不可用则隐藏）
  - Net：若可用则展示（不可用则隐藏）
- 板块二：Payment method details
  - Payment method：Card + brand
  - Number：信用卡仅展示后四位
  - Expires
  - Type
  - Country
  - CVC check
  - Zip check
  - Owner：付款人
  - Owner Email：付款人邮件
  - Address
  - 规则：无数据字段不展示占位行
- 板块三：Timeline
  - 展示支付生命周期关键事件与时间戳（按时间倒序或正序保持一致）
  - 事件示例：Payment started / Payment authorized / Payment captured / Payment failed / Refund created
  - 规则：按照 Stripe 返回的数据展示即可

### 6.3 导出 CSV

#### 6.3.1 目标
- 满足 merchant 对账/归档需求：按时间范围导出收款记录，并与当前筛选条件保持一致。

#### 6.3.2 交互
- 列表页顶部按钮「Export CSV」：
  - 默认导出当前筛选条件下的数据
  - 允许用户指定：
    - Date range（必填，默认当前范围）
    - Max rows（必填，默认 5,000；允许 1,000 / 5,000 / 10,000）
- 导出结果：
  - 直接下载文件（如实现异步任务，则先返回“生成中”状态并在完成后提供下载链接）

#### 6.3.3 CSV 字段（MVP 必须）
- order_id
- created_at
- status
- product_id
- product_name
- customer_email
- customer_external_user_id
- amount
- currency
- stripe_object_type
- stripe_object_id

---

## 7. 数据逻辑与状态 (Data Logic & States)

### 7.1 Order 状态定义（MVP）
- **Paid**：收款成功（可对齐 Stripe 侧“已支付”语义）。
- **Failed**：收款失败（可记录 failure_code / failure_message）。
- **Pending**：支付进行中或待确认（可选；若 MVP 只展示最终态，也可不暴露该状态给用户）。
- **Refunded**：已全额退款。
- **Partially refunded**：已部分退款。

### 7.2 数据模型（MVP 必需字段）

#### 7.2.1 Order
- order_id（内部主键）
- merchant_id
- product_id（可为空）
- customer_email（可为空）
- customer_external_user_id（可为空）
- amount
- currency
- status
- created_at
- stripe_account_id（Connect account）
- stripe_object_type（payment_intent / charge / checkout_session / invoice）
- stripe_object_id
- stripe_dashboard_url
- metadata（JSON）

#### 7.2.2 Refund
- refund_id
- order_id
- amount
- currency
- created_at
- stripe_refund_id

### 7.3 关键规则
- 数据隔离：所有查询必须强制限定 `merchant_id`（以及环境：test/live，如适用）。
- 追溯一致性：Order 详情中必须能跳转到 Stripe Dashboard 的对应对象（Stripe Dashboard URL 可在后端统一生成）。
- PII 最小化：Orders 仅展示 merchant 已提供/已拥有的用户标识（email / external_user_id）。不额外引入身份证明类敏感信息。

---

## 8. API 需求 (API Requirements)

### 8.1 Console API（给前端）
- GET `/orders`
  - query：`from` `to` `status[]` `product_id` `page` `page_size`
  - 返回：orders[] + total + page/page_size
- GET `/orders/{order_id}`
  - 返回：order + refunds[]（如有）+ stripe_dashboard_url + payment_method_details（如有）+ timeline（如有）
- POST `/orders/exports`
  - body：`from` `to` `status[]` `product_id` `max_rows`
  - 返回：download_url（或 job_id）

### 8.2 Payment Data API（给商户后端自动化）
- 认证：Payment Data API Key（在 Developers / API Keys 中管理）
- GET `/payment-data/orders`
  - query：同 `/orders`，支持 `cursor` 或 `page` 分页
  - 返回：与 CSV 字段一致的结构化 records

---

## 9. 指标与埋点 (Metrics & Instrumentation)

### 9.1 关键产品指标
- Orders 使用率：有交易的 merchant 中，访问 Orders 的比例
- 定位效率：打开 Orders → 打开某笔订单详情 的中位时长
- 导出使用率：使用过 Export CSV 的 merchant 占比

### 9.2 埋点事件（示例）
- orders_page_viewed
- orders_filter_changed
- orders_row_clicked
- order_detail_viewed
- orders_export_clicked
- orders_export_completed
- stripe_dashboard_link_opened

---

## 10. 非功能需求 (Non-functional Requirements)

### 10.1 性能
- 列表接口 P95 < 1.5s（同一 merchant，10k 订单量级）。
- 详情接口 P95 < 1.0s。

### 10.2 可靠性
- 如果底层数据同步存在延迟，UI 需有可解释提示（例如“Data may be delayed by a few minutes”）。

### 10.3 安全
- API Key 仅展示一次（若复用现有规则，以 Developers 模块为准）。
- 所有数据访问必须校验 merchant 权限与环境隔离（test/live）。

---

## 11. 依赖与风险 (Dependencies & Risks)

### 11.1 外部依赖
- Stripe Connect（交易对象与退款对象的可用性、字段一致性）。

### 11.2 主要风险
- Stripe 对象映射复杂导致字段不一致：MVP 必须先统一抽象为可追溯的 `stripe_object_type + stripe_object_id`。
- 数据延迟/遗漏影响对账体验：需定义同步机制与容错策略（技术方案由工程确定，但需满足可用性指标）。

---

## 12. 里程碑建议（示意） (Milestones)

- Milestone 1：Orders 列表 + 基础筛选/分页 + 侧滑详情（含 Stripe 跳转）
- Milestone 2：CSV 导出 + Export 失败/加载状态完善
- Milestone 3：Payment Data API Key 联动 + Payment Data API（只读）
