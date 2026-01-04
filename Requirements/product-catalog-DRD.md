# Anyway Product Catalog & Pricing Agent DRD

## 1. 设计背景与目标

### 1.1 设计背景
- 本设计需求文档对应 PRD《Anyway Product Catalog & Pricing Agent》MVP。
- 目标是让设计师清晰理解：
  - 信息架构：Product Catalog 在 Console 中的位置与层级。
  - 页面结构：商品列表、创建向导、商品详情、定价建议区域的布局。
  - 交互细节：三种收入模型下的表单与 Pricing Agent 的交互语法。
  - 状态与反馈：空状态、加载、错误、护栏提示的视觉与交互。

### 1.2 设计目标
- 让首次使用的开发者/创始人，在几分钟内完成从“没有任何商品”到“生成首个收款链接”的路径，并理解自己做了哪些关键决策。
- 在定价环节，让智能建议成为“可编辑的起点”和“风险护栏”，而不是难以理解的黑盒输出。

---

## 2. 信息架构（IA）

### 2.1 模块定位
- Anyway Console 顶层导航：
  - Dashboard
  - Product Catalog（本次新增）
  - Payments
  - Finance
  - Settings

### 2.2 Product Catalog 子结构
- Product Catalog
  - Products 列表页
  - Product Detail 页面
    - Overview（基础信息 + 表现）
    - Pricing（价格与定价历史）
    - Links（收款链接列表）

### 2.3 页面导航与入口
- 左侧主导航中新增「Product Catalog」入口。
- 页内入口：
  - Products 列表页：顶部右侧「Add a Product」按钮。
  - Product Detail 页：右上角「Create payment link」按钮。

---

## 3. 核心页面与布局

### 3.1 Products 列表页

#### 3.1.1 有数据状态
- 布局：
  - 顶部区域：
    - 左侧：页面标题「Products」，简短描述。
    - 右侧：主按钮「Add a Product」。
  - 过滤区域：
    - 状态筛选：All / Draft / Published / Archived。
  - 列表区域：
    - 表头字段：
      - Product（名称）
      - Revenue Model（One-time / Subscription / Usage-based）
      - Default Price（金额 + 币种 + 周期/单位）
      - Status
      - Last 7d Payments（简要数字）
    - 每行点击可进入 Product Detail。

#### 3.1.2 空状态
- 触发条件：商户没有任何商品。
- 内容构成：
  - 插画或简单图标。
  - 标题：例如「Create your first product」。
  - 描述：一句话解释 Product Catalog 能帮他做什么。
  - 主按钮：「Add a Product」。

### 3.2 创建商品向导（Add a Product）

#### 3.2.1 向导结构
- 建议使用 3 步 Wizard，顶部步骤指示清晰：
  - Step 1: Basics
  - Step 2: Model, inputs & price
  - Step 3: Payment link

#### 3.2.2 Step 1：Basics
- 左侧：表单字段
  - Product name（输入框）
  - Deliverable description（多行文本，可选）
- 右侧：说明区域
  - 提供 1–2 个示例，帮助用户写出清晰的交付物描述。

#### 3.2.3 Step 2：Model, inputs & price（定价输入 + 生成建议 + 价格确认）
- 总体布局建议采用「左右结构」：
  - 左侧：Revenue model + Pricing inputs + Price 表单。
  - 右侧：Pricing Agent 建议卡（在本步骤完成生成）。

- 左侧表单：
  - Revenue model（使用三张卡片或 Tab）：
    - One-time / Subscription / Usage-based
  - Currency（默认 USD）
  - 模型上下文（按 revenue model 变化）：
    - Subscription：Billing period（Monthly/Yearly）
    - Usage-based：Usage unit name（例如：API call / 1K tokens / run）
  - Pricing inputs（建议用分组标题组织，如「Customer」「Value」「Costs」）：
    - Target customer type（单选）
    - Use case category
    - Cost inputs（支持选择 Trace 作为参考，并展示平均 workflow 成本，只读）
    - （待定）Value type / Human Equivalent Value
  - Price：
    - One-time：Price amount
    - Subscription：Amount
    - Usage-based：Unit price

- 右侧 Pricing Agent 建议卡：
  - 卡片顶部：
    - 标题：例如「Pricing suggestion」。
    - 状态信息：
      - Last updated 时间戳（可选）。
      - Confidence badge：Low / Medium / High。
  - 主体内容：
    - 主 CTA：「Get pricing suggestion」
    - Recommendation：
      - 推荐价格区间：Min / Typical / Max
      - 一键应用按钮：将 Typical 应用到左侧 Price 表单
    - Assumptions / Rationale 区域，默认折叠
  - 交互要求：
    - 用户修改任一输入后，建议卡进入「Out of date」状态，并提供「Regenerate」按钮。
    - 不自动频繁请求，始终由用户显式触发生成/重新生成。

#### 3.2.4 Step 3：Payment link（生成收款链接）
- 布局：
  - 生成按钮 + 链接展示区（URL + Copy）
  - 如 Product 为 Draft：在生成前引导完成 Publish（或在操作内自动完成并给出状态反馈）
  - 生成链接默认绑定当前 Product 的默认 Price
  - 支持禁用链接（例如商品归档后自动禁用）

---

## 4. Product Detail 页面

### 4.1 布局
- 顶部 Header：
  - 左侧：Product 名称 + 状态标签（Draft/Published/Archived）。
  - 右侧：主要 CTA：
    - 「Create payment link」。
    - 辅助菜单：Edit product / Archive。

- 页面内容划分为两列：
  - 左列（较宽）：Overview + Performance。
  - 右列（较窄）：Pricing summary + Latest recommendation。

### 4.2 Overview 区域
- 展示：
  - Product 基础信息（名称、描述、收入模型、默认价格）。
  - 最近创建/更新时间。

### 4.3 Performance 区域
- 显示简单的漏斗：
  - Clicks → Checkout started → Paid。
  - 图形可用简化的柱状/条形或小型漏斗图。
  - 仅需提供最近 7 天或 30 天切换。

### 4.4 Pricing summary 区域
- 内容：
  - 当前默认 Price 信息。
  - 最近一次 Pricing Recommendation 摘要：
    - 当时建议的 typical price。
    - 采纳情况（是否采纳/是否手动修改）。
    - 当前实际价格相对于建议的偏差（例如 +10% 或 -20%）。
  - 查看详细定价历史的入口（跳转或展开）。

### 4.5 Links 区域
- 展示与该 Product 相关的 PaymentLink 列表：
  - URL（可缩短展示）。
  - Status。
  - 最近 7 天的点击与支付数。
  - 禁用/启用操作入口。
  - Disabled 的 Link 打开时提示「Link is disabled」并返回安全页。

---

## 5. 状态、反馈与错误处理

### 5.1 Loading 与空状态
- 在定价建议请求过程中：
  - Pricing Agent 卡片展示 skeleton 或 loading 状态，保留卡片框架，避免布局跳变。
  - 显示简短文案：例如「Thinking about your price…」。
- 请求失败：
  - 卡片中展示错误提示和重试按钮。
  - 告知用户可以先手动填写价格，不阻塞流程。

### 5.2 护栏提示（Guardrail）
- 当用户输入价格低于建议区间 Min 时：
  - 在 Price 输入框附近显示红色/橙色辅助文本。
  - 提供简短解释，强调这是对照建议区间的风险提醒，而不是硬性禁止。
  - 不强制禁止保存，但需要视觉上明确提醒风险。

### 5.3 表单校验
- 必填项缺失时：
  - 采用标准 form error 提示，字段下方红色文案。
  - Step 切换时阻止前进，并在顶部给出汇总提示。

### 5.4 多次请求定价建议
- 设计需支持用户在修改 Pricing inputs 后重新请求建议：
  - 在建议卡中保留上一次请求时间。
  - 可以提示“Last updated at …”。
  - 当 inputs 发生变更但尚未重新生成时：
    - 在卡片顶部显示「Out of date」badge。
    - 主 CTA 变为「Regenerate suggestion」。

---

## 6. 组件与交互模式

### 6.1 复用与限制
- 尽量复用既有设计系统中的：
  - 表单控件（Input/Select/Radio/Slider）。
  - 卡片组件。
  - Tag/Badge 样式。
  - 表格组件。
- 避免为本功能单独引入新奇的交互模式（例如完全自由画布），保持 OOUI 风格。

### 6.2 Pricing Agent 卡片组件
- 拆成三个可复用子组件：
  - RecommendationSummary：展示区间与按钮。
  - DeviationHint：展示偏离建议区间的提示。
  - AssumptionList：结构化展示假设。
- 保持卡片的高度尽可能可控，以适应右侧固定栏布局。

### 6.3 Wizard 步骤组件
- 顶部 stepper：
  - 支持显示当前步骤与总步骤数。
  - 支持点击返回前一步（但需要保留用户已填写的数据）。

---

## 7. 文案与语气

### 7.1 总体语气
- 面向开发者/创始人，语气应：
  - 专业，但不过于金融化。
  - 解释清楚“为什么给出这样的建议”，帮助学习定价思路。
  - 避免承诺收益或“保证”类用语。

### 7.2 关键文案区域
- 定价建议卡：
  - 标题建议示例：「Suggested price range」。
  - 提示文案示例：「Pricing below the suggested range may increase risk.」。
- 护栏提示：
  - 强调“提醒”和“可持续性”，避免像错误信息。
- 空状态：
  - 重点回答“我为什么要先创建 Product”，“创建后可以做什么”。

---

## 8. 响应式与可访问性

### 8.1 响应式
- 最主要的目标设备为桌面宽屏，但需要保证在笔记本尺寸下：
  - 向导步骤仍然可见。
  - Pricing Agent 卡不会被完全挤出视口，可考虑在窄屏下改为折叠区域或 Tab 切换。

### 8.2 可访问性
- 重要交互控件（按钮、输入框、链接）符合基础对比度要求。
- 向导步骤、错误提示与警告文本对色盲用户可辨识（文字与图标结合）。

---

## 9. 设计交付物清单

- 页面级线框图：
  - Products 列表页（有数据 & 空状态）。
  - Add a Product 向导各步骤。
  - Product Detail 页面。
- 组件规格：
  - Pricing Agent 卡片及子组件。
  - Revenue model 选择卡片。
  - 偏离建议区间提示样式。
- 状态图：
  - Loading、Error、Empty state。
  - 价格低于建议区间 Min 状态。
