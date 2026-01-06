# 产品需求文档 (PRD)：Finance（MVP）

| 文档信息 | 详情 |
| :--- | :--- |
| **项目** | Anyway - AI 商业化基础设施 |
| **模块** | Finance（结算与提款） |
| **版本** | v1.0 |
| **状态** | 草稿 (Draft) |
| **作者** | 产品经理 |
| **更新时间** | 2026-01-06 |

---

## 1. 背景与问题空间 (Context & Problem Space)

### 1.1 产品背景
- Anyway 使用 Stripe Connect 作为 merchant 的收款与结算基础设施。
- merchant 需要在 Console 内完成“余额查看 → 提款 → 追溯提款状态/到账时间”的闭环，而不是跳转到 Stripe 处理。

### 1.2 核心痛点
- merchant 不清楚“可提现金额 / 在途金额 / 不同币种余额”的区别，导致提款失败或频繁咨询。
- merchant 不清楚提款的进度与失败原因（例如账户信息未完善、提款被 Stripe 拒绝）。
- merchant 未绑定 Stripe Connect 时，会阻断收款链路（例如 Products 的 generate payment link），但缺少清晰的引导与状态提醒。

---

## 2. MVP 目标 (MVP Goals)

### 2.1 MVP 目标
- 在 Console 内提供 Finance 首页：清晰展示可提现余额、在途余额与最近的提款/结算流水。
- 提供提款能力（基于 Stripe Connect）：merchant 能发起提款并追踪状态。
- 提供 Stripe Connect 绑定与状态区分：未绑定时引导完成绑定。
- 与 Products 模块形成一致的前置条件：未绑定 Stripe Connect 时不可生成收款链接，并明确提示去完成绑定。

### 2.2 成功标准（验收口径）
- merchant 能在 60 秒内完成：进入 Finance → 看到可提现余额 → 发起一笔提款 → 在列表中看到提款状态。
- 未绑定 Stripe Connect 的 merchant 能在 Finance 首页明确看到阻断点，并能进入绑定流程。
- 提款失败时，merchant 能看到明确的失败原因与下一步动作（例如重试或查看 Stripe 详情）。

---

## 3. 用户画像与待办任务 (User Personas & JTBD)

### 3.1 目标用户
- AI 应用/Agent 商户：关注现金流与提现效率，需要快速把收入提到银行账户。
- 运营/财务协作角色（轻量）：需要对账与追溯提款记录，但不需要复杂会计报表。

### 3.2 JTBD 表
| 待办任务 (JTBD) | 用户需求 / 痛点 |
| :--- | :--- |
| 查看可提现余额 | “我现在能提现多少钱？哪些钱还在路上？” |
| 发起提款 | “我想把可用余额提现到我的银行卡。” |
| 追溯提款进度 | “这笔提款到哪一步了？预计什么时候到账？” |
| 解决绑定/失败 | “为什么不能提现？我要做什么才能恢复提款？” |
| 完成 Stripe Connect 绑定 | “我需要绑定收款账户，否则无法收款/提现。” |

---

## 4. 范围与不做什么 (Scope)

### 4.1 In Scope（本期范围）
- Stripe Connect 绑定与状态：
  - 未绑定：引导发起绑定流程。
  - 已绑定可用：允许查看余额与提款。
- Finance 首页（Balance & Payouts）：
  - 余额卡：Available in your balance / On the way to your bank。
  - 交易/结算明细（简版）：可按时间范围查看余额变动项（来自 Stripe Balance Transactions）。
- 提款（Withdraw / Payout）：
  - 发起提款：输入金额（不超过 available）、确认提交。
- 跨模块约束（Products）：
  - 未绑定 Stripe Connect：Products 的 generate payment link 入口不可用，并提供跳转到 Finance 的引导。

### 4.2 Out of Scope（本期明确不做）
- 在 Console 内管理收款账户（银行账户/卡）的新增与编辑（一期以跳转 Stripe 或引导完成为主）。
- 税务/发票、收入确认、对账报表、分账与多主体结算。
- 风控策略与自定义审核（完全依托 Stripe 的能力与结果）。

---

## 5. 核心概念与术语 (Key Concepts & Terminology)

- **Stripe Connect account**：merchant 的收款/结算账户（本模块以其状态决定可用能力）。
- **Balance**：Stripe 侧余额集合，按币种拆分。
- **Available**：可用于提现或消费的余额。
- **On the way to your bank**：已发起提现、在转账过程中的金额。
- **Payout（Withdrawal）**：一次提现动作。
- **Balance transaction**：余额变动项，用于追溯收入/费用/退款/提款等导致的余额变化。

---

## 6. 功能需求 (Functional Requirements)

### 6.1 Stripe Connect 状态与引导

#### 6.1.1 状态定义（MVP）
- **Not connected**：未完成 Stripe Connect 绑定。
- **Connected**：已绑定 Stripe Connect 且可正常收款与提款。

#### 6.1.2 规则
- Finance 模块所有数据查询与操作必须以当前 merchant 的 `stripe_account_id` 为上下文；Not connected 时不可查询余额/提款数据。
- Not connected 时：
  - Finance 首页展示绑定引导（主按钮：Connect with Stripe）。
  - 提示对 Products 生成收款链接的影响（不可用）。

### 6.2 Finance 首页（Balance & Payouts）

#### 6.2.1 页面目标
- 让 merchant 一眼判断“能提现多少钱/钱在哪里”，并能快速发起提款与追溯提款状态。

#### 6.2.2 页面结构（信息架构）
- 顶部：页面标题「Finance」+ 主操作「Withdraw」
- 模块一：Connect 状态提示条（仅在 Not connected 显示）
- 模块二：Balance 概览卡
  - Available in your balance
  - On the way to your bank
- 模块三：Balance activity（表格，简版）
  - 展示最近 N 条余额变动项（收入/费用/退款/提款等）

#### 6.2.3 Balance 概览卡（MVP 必须字段）
- Available in your balance
- On the way to your bank

#### 6.2.4 Balance activity 字段（MVP 必须列）
| 列名 | 规则 |
| :--- | :--- |
| **Amount** | `amount + currency`（正负号明确） |
| **Fees** | `fees + currency`（通常为负；若不可用则隐藏） |
| **Total** | `total + currency`（等于 amount + fees；若不可用则隐藏） |
| **Type** | Payment / Payout / Refund / Fee / Adjustment（按 Stripe 映射） |
| **Description** | Stripe description（若不可用则隐藏） |
| **Created** | `YYYY-MM-DD HH:mm`，本地时区 |
| **Available on** | `YYYY-MM-DD`（该笔余额变动可用日期；若不可用则隐藏） |

### 6.3 提款（Withdraw / Create payout）

#### 6.3.1 触发入口
- Finance 首页主按钮「Withdraw」
- Not connected 时：按钮置灰并展示原因

#### 6.3.2 交互（MVP）
- 点击 Withdraw 打开弹窗（与 Stripe 交互一致）：
  - 标题：Pay out funds to your bank account
  - Available balance：只读展示 `amount + currency`
  - Amount to pay out（必填）：输入金额（默认填充为 available balance）
  - Internal note（可选）：输入框
  - Statement descriptor（可选）：输入框（默认展示 merchant 的 statement descriptor）
  - Send payout to：只读展示 payout destination（银行/卡展示名）
  - Cancel / Pay out `{amount} {currency}`（主按钮）
- 校验规则：
  - amount > 0
  - amount <= available
  - 失败提示：展示来自后端/Stripe 的错误消息

#### 6.3.3 结果
- 成功：弹窗关闭，Balance 概览卡与 Balance activity 刷新
- 失败：弹窗内显示错误并允许重试

---

## 7. 数据逻辑与状态 (Data Logic & States)

### 7.1 数据模型（MVP 必需字段）

#### 7.1.1 ConnectStatus
- merchant_id
- stripe_account_id（可为空）
- status：not_connected / connected

#### 7.1.2 Balance（按币种）
- currency
- available_amount
- on_the_way_amount
- updated_at

#### 7.1.3 Payout（Withdrawal）
- payout_id（内部主键）
- merchant_id
- amount
- currency
- status
- arrival_date（可为空）
- destination_display（可为空）
- stripe_payout_id
- stripe_dashboard_url（可为空）
- created_at
- failure_reason（可为空）

#### 7.1.4 BalanceActivity
- activity_id（内部主键）
- merchant_id
- type
- amount
- currency
 - fees_amount（可为空）
 - total_amount（可为空）
 - description（可为空）
 - available_on（可为空）
- stripe_balance_transaction_id（可为空）
- created_at

### 7.2 关键规则
- 数据隔离：所有查询必须强制限定 `merchant_id`（以及环境：test/live，如适用）。
- 金额精度：金额展示按币种规则格式化；输入与计算使用最小货币单位。
- 幂等性：创建提款需支持幂等键，避免重复提交导致重复提款。

---

## 8. API 需求 (API Requirements)

### 8.1 Console API（给前端）
- GET `/finance/connect-status`
  - 返回：ConnectStatus
- POST `/finance/connect-onboarding`
  - 返回：onboarding_url（跳转到 Stripe Connect 绑定/继续流程）
- GET `/finance/balance`
  - 返回：balances[]（按币种）
- POST `/finance/payouts`
  - body：`amount` `idempotency_key` `internal_note?` `statement_descriptor?`
  - 返回：payout
- GET `/finance/balance-activity`
  - query：`from` `to` `page` `page_size`
  - 返回：activities[] + total + page/page_size

---

## 9. 指标与埋点 (Metrics & Instrumentation)

### 9.1 关键产品指标
- Connect 完成率：进入 Finance 且未绑定的 merchant 中，完成绑定的比例
- 提款渗透率：有 available 余额的 merchant 中，发起过提款的比例
- 提款成功率：提款成功笔数 / 提款发起笔数
- 提款失败原因分布：按 failure_reason 聚合

### 9.2 埋点事件（示例）
- finance_page_viewed
- finance_connect_cta_clicked
- finance_withdraw_clicked
- finance_withdraw_submitted
