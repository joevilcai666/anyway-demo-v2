# Anyway Finance（结算与提款）DRD（MVP）

## 1. 设计背景与目标

### 1.1 设计背景
- 本设计需求文档对应 PRD《Finance（MVP）》。
- Finance 模块承接 Stripe Connect 的结算能力，在 Console 内为 merchant 提供“余额总览 + 提款 + 结算流水追溯”的界面与交互。
- 模块需要与 Orders / Product Catalog 信息架构保持一致，遵循工具型产品清晰、密度适中的布局原则。

### 1.2 设计目标
- 让用户一眼看懂“现在可提现吗、能提多少、钱在什么状态/哪一步”。
- 降低 Stripe Connect 绑定状态的理解成本：以清晰的 Banner 与 CTA 引导用户完成绑定。
- 让提款表单与列表信息“可执行”：余额、金额与状态一目了然，并能在需要时跳转 Stripe 进行更深排查。

---

## 2. 信息架构（IA）

### 2.1 模块定位（MVP 推荐）
- Console 左侧主导航中，Finance 作为一级模块存在：
  - Dashboard
  - Product Catalog
  - Payments
  - Finance（本模块）
  - Settings
  - Developers

### 2.2 Finance 子结构
- Finance
  - Finance 首页（Balance & Payouts，默认视图）

---

## 3. 核心页面与布局

### 3.1 Finance 首页

#### 3.1.1 有数据状态（已绑定且有余额/流水）
- 页面顶部 Header：
  - 左侧：标题「Finance」+ 一句简要描述（可选，例如 “View balances and payouts powered by Stripe Connect.”）
  - 右侧：主按钮「Withdraw」
- Connect 状态提示条（Banner）：
  - 已绑定状态不展示
- Balance 概览区域：
  - 字段 1：Available in your balance
    - 展示：`amount + currency`
  - 字段 2：On the way to your bank
    - 展示：`amount + currency`
- Balance activity（表格，简版）：
  - 表头字段（MVP 必须）：
    - Amount
    - Fees
    - Total
    - Type
    - Description
    - Created
    - Available on
  - 行交互：
    - MVP 阶段仅用于查看，不支持点击进入详情

#### 3.1.2 Not connected 状态
- 当 ConnectStatus = not_connected：
  - 主要视图仍然是 Finance 首页，但核心内容被绑定引导替代：
    - 顶部 Banner：说明未绑定状态及其影响（无法收款/无法提现）。
    - 主区域：
      - 插画/图标（轻量）
      - 标题示例：「Connect Stripe to start receiving payments」
      - 描述：简要说明绑定后可以做什么（收款、提现、查看结算）
      - 主按钮：「Connect with Stripe」
      - 次要文案：说明 Products generate payment link 将不可用，并提示“Go to Products to see more”
- 与 Products 的关系提示：
  - 在空状态描述中加入一句明确说明：
    - “You won’t be able to generate payment links for your products until Stripe Connect is set up.”

---

## 4. 关键组件与交互规范

### 4.1 Balance 卡片
- 数值排版：
  - 展示 `amount + currency`
  - 两行信息对应两项字段：Available in your balance / On the way to your bank

### 4.2 Withdraw 按钮与对话框
- 按钮态：
  - Enabled：ConnectStatus = connected 且有可提现余额
  - Disabled：
    - ConnectStatus = not_connected：tooltip 提示 `Connect Stripe to enable withdrawals.`
    - Available balance = 0：tooltip 提示 `No available balance to withdraw.`
- 对话框结构（弹窗）：
  - 标题：`Pay out funds to your bank account`
  - 字段：
    - Available balance：只读展示 `amount + currency`
    - Amount to pay out：金额输入框（默认填充为 available balance）
    - Internal note：输入框（可选）
    - Statement descriptor：输入框（可选，默认展示 merchant 的 statement descriptor）
    - Send payout to：只读展示 payout destination（银行/卡展示名）
  - 按钮：
    - Cancel
    - Pay out `{amount} {currency}`（主按钮）
  - Loading/禁用态：
    - 提交中，主按钮进入 loading，避免重复提交。

### 4.3 表格可读性
- Created / Available on 列：
  - 固定宽度，统一格式（Created 为 `YYYY-MM-DD HH:mm`，Available on 为 `YYYY-MM-DD`）。
- Amount 列：
  - 右对齐，格式为 `amount + currency`。
  - 负数金额在 Balance activity 中可使用前缀减号或不同颜色标识。

---

## 5. 错误与反馈状态

### 5.1 Loading
- 首页加载：
  - Balance 区域使用 skeleton 卡片，占位结构与实态一致。
  - 表格区域使用 skeleton table。

### 5.2 Error
- Finance 首页错误：
  - Balance 区域：错误提示条 + Retry 按钮，不覆盖整个页面。
  - Activity 表格：在表格区域展示错误文案 + Retry。

### 5.3 空状态
- Balance activity 空列表：
  - 文案示例：「No balance activity yet」
  - 可选：引导用户前往 Orders 了解收款记录。

---

## 6. 响应式与可访问性

### 6.1 响应式（MVP 目标）
- 桌面优先设计：
  - 在常见笔记本宽度下，Finance 首页主要区域需避免出现双层滚动条。
  - 表格允许横向滚动，字段不强行压缩到难以阅读。

### 6.2 可访问性
- Status Badge：
  - 使用颜色 + 文本双重编码，避免仅依赖颜色传递状态。
- 关键按钮：
  - Hover/Focus 态与禁用态需清晰区分。
  - 外链（Stripe Dashboard）需有明显图标或视觉提示其为外部跳转。

---

## 7. 设计交付物清单

- 页面级线框图：
  - Finance 首页（Not connected / Connected 两种状态）
  - Finance 首页空状态（无 activity）
  - Withdraw 弹窗（正常、校验错误、提交中）
- 组件规格：
  - Connect 状态 Banner（信息与警示两种样式）
  - Balance 卡片
  - Balance activity 表格
  - Withdraw 弹窗输入组件
- 状态稿：
  - Loading / Error / Empty state（Finance 首页）
