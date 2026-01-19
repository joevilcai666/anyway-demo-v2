# 产品需求文档 (PRD)：Product Catalog & Pricing Agent (MVP)

| 文档信息 | 详情 |
| :--- | :--- |
| **项目** | Anyway - AI 商业化基础设施 |
| **模块** | Products - Products & Pricing Agent |
| **版本** | v2.0 (2-Step Wizard + Optional Pricing Assistant) |
| **状态** | 草稿 (Draft) |
| **作者** | 产品经理 |
| **更新时间** | 2026-01-13 |

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
- 打通闭环：创建商品（2步向导）→ 生成可分享收款链接 → 观察点击与支付转化。
- 智能定价的定位：**可选辅助工具**，提供可解释建议，不阻塞创建流程，不做自动改价或动态定价。

### 2.2 成功标准（用于验收与复盘）
- 商户 0→1 激活：
  - 能在一次会话内完成：创建商品（2步） + 发布 + 生成链接。
  - TTFP（Time To First Payment）可被观测（至少能从事件中计算）。
- 定价建议使用率：
  - 追踪智能定价组件的查看率和使用率（但不要求100%使用）。
  - 追踪建议采纳率（Min/Typical/Max的应用情况）。

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
| 快速把 Agent 变成可卖商品 | "我想快速生成一个可分享的收款链接开始收费。" |
| 获取可执行的定价起点 | "我不知道该收多少钱，希望有一个区间与理由可参考。" |
| 灵活的定价决策 | "我希望能快速手动定价，或者在需要时获取智能建议。" |
| 观察转化并复盘定价 | "我想知道链接是否有效、价格是否合理，并据此迭代。" |

---

## 4. 范围与不做什么 (Scope)

### 4.1 In Scope（本期范围）
- Products：
  - 商品列表与详情（含空状态与筛选）。
  - **2步创建向导**：
    - Step 1：基础信息 + 收入模型 + 价格确认（左侧表单）
    - Step 1：智能定价助手（右侧可选组件）
    - Step 2：生成收款链接 + 产品摘要
  - **Payment Links管理**：
    - 为一个商品创建多个Payment Link，每个Link绑定独立的Price配置
    - 2步创建向导：创建新Price（可选智能定价）→ 生成Link
    - Links列表：显示Link名称、URL、关联Price、状态、时间信息
    - 操作：创建、启用/禁用、编辑元数据、删除、复制URL
  - 草稿自动保存机制。
  - 列表页快速编辑入口。
- 收入模型：
  - One-time（一次性）。
  - Subscription（仅支持月/年，一期不做试用期、Quarterly等）。
  - Usage-based（单位定义 + 单价；一期不做最低消费/预付额度）。
- Pricing Agent（可选组件）：
  - **基础字段**：Target customer type（必填）、Use case category（必填）。
  - **高级选项**：Trace成本参考（可选）、手动成本输入（可选）、Value type（可选，多选）。
  - 三种模型的结构化输入 → 推荐区间（min/typical/max）→ 可选择应用。
  - **不在一期范围**：护栏提示（价格低于Min警告）、历史建议记录、自动生成。
- 数据与埋点：
  - 商品创建/发布漏斗；链接点击/结账/支付回流；建议请求/采纳情况。

### 4.2 Out of Scope（本期明确不做）
- 自动改价、A/B 测试、多价格并行实验、实时动态定价。
- 护栏提示（价格低于建议Min时的红色/橙色警告）。
- 智能定价历史记录和对比。
- Usage-based 端到端计量与对账系统（按调用/token/时长的自动化计量与争议处理）。
- Subscription模型的试用期（Trial period days）、Quarterly周期、Annual折扣。
- Usage-based的Minimum charge、预付额度/Package。
- 税务、发票、多币种 FX 等复杂结算能力（一期币种统一为USD）。

---

## 5. 功能需求 (Functional Requirements)

### 5.1 Products 列表页（含空状态）
**目标：** 让商户快速看到已有商品与状态，并能创建新商品。

- 有数据状态（表格）字段：
  - Product（名称）
  - Revenue Model（One-time / Subscription / Usage-based）
  - Links（Payment Links数量，如"3 links"）
  - Status（Draft / Published / Archived）
- 空状态：
  - 强视觉引导 + 主按钮「Add a Product」。
- 筛选：
  - Status：All / Draft / Published / Archived。

### 5.2 Add a Product 创建向导（Wizard）
**目标：** 让 merchant 在 **2 步**内完成商品定义、定价与链接生成。智能定价作为右侧可选组件，不阻塞创建流程。

#### Step 1：基础信息 + 收入模型 + 价格确认（左右布局）

**左侧表单（必填路径）**：

1. **基础信息**：
   - Product Name（必填）
     - Placeholder示例："E.g., Weekly Business Report"
     - 校验：提交时校验唯一性（同一Merchant下）
   - Deliverable Description（选填但有引导）
     - Placeholder示例："E.g., A weekly report summarizing your key business metrics and insights"

2. **Revenue Model选择**（三选一，选择后动态展开对应字段）：
   - One-time / Subscription / Usage-based
   - 每个模型展示简短说明与典型场景示例

3. **价格配置**（按选择的Model动态展开）：
   - **One-time**：
     - Price amount（输入框）
     - 币种：统一USD，不需要用户选择
     - 验证：范围0.01-1,000,000，最多2位小数

   - **Subscription**：
     - Amount（输入框）
     - Billing period（下拉框）：Monthly / Yearly（仅此两个选项）
     - **不在一期范围**：Trial period days、Quarterly、Annual discount

   - **Usage-based**：
     - Unit name（输入框，必填）：例如 "API call" / "1K tokens" / "run"
     - Unit price（输入框，必填）：每单位单价
     - **不在一期范围**：Minimum charge、预付额度/Package

4. **币种显示**：
   - UI始终显示 "USD"
   - 例如："99 USD" 或 "USD 99"

**右侧组件：智能定价助手（可选）**：

- **默认状态**：展开但空状态
  - 引导文案："Not sure what to charge? Let our AI help you set the right price"
  - 问题引导式设计

- **基础字段**（默认显示，必填）：
  1. **Target customer type**（单选）：
     - Individual/Small team
     - Small Business (10-50 people)
     - Growth Enterprise (50+ people)

  2. **Use case category**（自由文本输入，必填）：
     - 不提供预设分类或标签
     - 用户自由描述用例

- **高级选项**（点击"Advanced options"展开后显示）：

  1. **Cost相关字段**：
     - **Trace成本参考**（Checkbox/开关）：
       - 用户选择是否需要将trace作为成本参考
       - 后端自动计算最近N条Trace（如最近30天或50条）的平均值作为成本参考
       - 如果没有trace数据，显示引导："We don't have your cost data yet. Tell us your estimated cost per delivery to get better recommendations"

     - **手动成本输入**（单个输入框，可选）：
       - "Estimated cost per delivery"
       - 用户可以手动输入每次执行的平均成本

  2. **Value字段**：
     - **Value type**（多选Checkbox，可选）：
       - Save time
       - Increase revenue
       - Reduce cost
       - Other

- **按钮状态管理**：
  - 必填字段（Target customer type + Use case category）未完成时，"Get suggestion"按钮置灰
  - 完成后按钮变为可点击状态

- **智能定价建议输出**：
  - 推荐价格区间：Min / Typical / Max
  - 置信度：Low / Medium / High
  - **应用交互**：提供三个按钮
    - "Apply Min" / "Apply Typical" / "Apply Max"
    - 点击后将对应价格填入左侧Price输入框
  - Assumptions / Rationale：默认折叠

- **无成本时的处理**：
  - 即使没有任何成本数据（无Trace也无手动成本），仍允许生成建议
  - 基于Product Name/Use Case/Customer Type生成市场参考定价
  - 在Assumptions中明确说明："No cost data provided, recommendations based on market benchmarks only"

- **失败处理**：
  - LLM调用失败时，显示错误提示："Unable to generate suggestion. Please try again or set your price manually."
  - 提供重试按钮
  - **不阻塞流程**：用户仍可在左侧填写价格并继续

- **响应式布局**：
  - 窄屏幕（笔记本）下，右侧组件可折叠
  - 用户需要时再展开

**草稿自动保存**：
- 用户在Step 1填写任何字段时，自动保存为Draft状态
- 用户可以随时离开和回来

#### Step 2：生成收款链接（Payment Link）

**布局内容**：
- **产品摘要**：
  - 显示Product名称
  - 显示Revenue Model
  - 显示价格
  - 让用户确认信息无误

- **生成按钮**："Generate payment link"

- **自动发布**：
  - 如果Product是Draft状态，自动Publish并生成链接

- **链接展示**：
  - 显示生成的URL
  - Copy按钮

**成功反馈**：
- Success Toast："Your product is live!"
- 引导文案："Share this link to start receiving payments"
- 可选"What's next"提示：
  1. Copy link
  2. Share with customers
  3. View in Dashboard

### 5.3 Payment Links 管理（创建、管理、展示）
**目标：** 让商户能够为一个商品创建多个收款链接，每个链接绑定独立的Price配置，支持多种收款方式（如不同tier的订阅级别）。

#### 5.3.1 核心逻辑
- **创建Payment Link = 创建新Price + 创建新Link**（1:1关系）
  - 每次创建Payment Link时，都会创建一个新的Price实例
  - 一个Price对应一个Payment Link
  - 不支持从已有Price中选择创建Link（简化逻辑）
  - 一个Product可有多个Price，每个Price通过一个Link对外售卖

#### 5.3.2 创建Payment Link向导（2步Wizard）

**入口：** 在商品详情页的Payment Links管理区域，点击主按钮"Create Payment Link"

**Step 1：创建新Price + 智能定价助手（左右布局）**

**左侧表单（必填路径）**：

1. **Price Name（必填）**：
   - 输入框，必填
   - Placeholder示例："E.g., Basic Tier", "Pro Tier", "Enterprise Plan"
   - 用途：区分不同的Price配置，便于在Links列表中识别
   - 校验：提交时校验非空

2. **Revenue Model选择**（三选一，选择后动态展开对应字段）：
   - One-time / Subscription / Usage-based
   - 每个模型展示简短说明与典型场景示例

3. **价格配置**（按选择的Model动态展开）：
   - **One-time**：
     - Price amount（输入框）
     - 币种：统一USD，不需要用户选择
     - 验证：范围0.01-1,000,000，最多2位小数

   - **Subscription**：
     - Amount（输入框）
     - Billing period（下拉框）：Monthly / Yearly（仅此两个选项）

   - **Usage-based**：
     - Unit name（输入框，必填）：例如 "API call" / "1K tokens" / "run"
     - Unit price（输入框，必填）：每单位单价

4. **币种显示**：
   - UI始终显示 "USD"
   - 例如："99 USD" 或 "USD 99"

**右侧组件：智能定价助手（可选）**：

- **默认状态**：展开但空状态
  - 引导文案："Not sure what to charge? Let our AI help you set the right price"
  - 问题引导式设计

- **基础字段**（默认显示，必填）：
  1. **Target customer type**（单选）：
     - Individual/Small team
     - Small Business (10-50 people)
     - Growth Enterprise (50+ people)

  2. **Use case category**（自由文本输入，必填）：
     - 不提供预设分类或标签
     - 用户自由描述用例

- **高级选项**（点击"Advanced options"展开后显示）：

  1. **Cost相关字段**：
     - **Trace成本参考**（Checkbox/开关）：
       - 用户选择是否需要将trace作为成本参考
       - 后端自动计算最近N条Trace（如最近30天或50条）的平均值作为成本参考
       - 如果没有trace数据，显示引导："We don't have your cost data yet. Tell us your estimated cost per delivery to get better recommendations"

     - **手动成本输入**（单个输入框，可选）：
       - "Estimated cost per delivery"
       - 用户可以手动输入每次执行的平均成本

  2. **Value字段**：
     - **Value type**（多选Checkbox，可选）：
       - Save time
       - Increase revenue
       - Reduce cost
       - Other

- **按钮状态管理**：
  - 必填字段（Target customer type + Use case category）未完成时，"Get suggestion"按钮置灰
  - 完成后按钮变为可点击状态

- **智能定价建议输出**：
  - 推荐价格区间：Min / Typical / Max
  - 置信度：Low / Medium / High
  - **应用交互**：提供三个按钮
    - "Apply Min" / "Apply Typical" / "Apply Max"
    - 点击后将对应价格填入左侧Price输入框
  - Assumptions / Rationale：默认折叠

- **无成本时的处理**：
  - 即使没有任何成本数据（无Trace也无手动成本），仍允许生成建议
  - 基于Product Name/Use Case/Customer Type生成市场参考定价
  - 在Assumptions中明确说明："No cost data provided, recommendations based on market benchmarks only"

- **失败处理**：
  - LLM调用失败时，显示错误提示："Unable to generate suggestion. Please try again or set your price manually."
  - 提供重试按钮
  - **不阻塞流程**：用户仍可在左侧填写价格并继续

- **响应式布局**：
  - 窄屏幕（笔记本）下，右侧组件可折叠
  - 用户需要时再展开

**Step 2：生成Payment Link**

**布局内容**：
- **摘要**：
  - 显示Price Name
  - 显示Revenue Model
  - 显示价格
  - 让用户确认信息无误

- **生成按钮**："Generate payment link"

- **链接展示**：
  - 显示生成的URL
  - Copy按钮

**成功反馈**：
- Success Toast："Payment link created!"
- 引导文案："Share this link to start receiving payments"
- 可选"What's next"提示：
  1. Copy link
  2. Share with customers
  3. View in Dashboard

#### 5.3.3 Payment Links列表与管理（商品详情页）

**列表展示**：
- 每行显示一个Payment Link，包含以下字段：
  - **Link Name**：用户可编辑的名称（如"Basic Tier", "Twitter Campaign"）
  - **URL**：完整的Payment Link URL，带Copy按钮
  - **关联的Price**：显示Price Name + 金额 + 周期/单位
  - **Status**：Active / Disabled（Badge样式）
  - **Created At**：创建时间
  - **Last Accessed At**：最后访问时间（可选）
- **排序**：按创建时间倒序（最新的在最前面）
- **空状态**：
  - 引导文案："Create your first payment link to start selling"
  - 主按钮："Create Payment Link"

**操作**：
- **创建新Link**：点击主按钮"Create Payment Link"，进入2步创建向导
- **启用/禁用Link**：
  - 点击启用/禁用按钮，切换Link状态
  - 禁用的Link无法被访问和支付
- **编辑Link元数据**：
  - 点击编辑按钮，可以修改Link Name
  - 不允许修改Link绑定的Price
- **删除Link**：
  - 点击删除按钮，永久删除该Payment Link
  - 删除前需要用户确认
- **复制URL**：点击Copy按钮，复制Link URL到剪贴板

### 5.4 商品详情页（Product Detail）
**目标：** 让用户查看商品基本信息和管理Payment Links，聚焦核心功能。

**布局结构**：

#### 5.4.1 Product基础信息区
- **基础信息**：
  - Product Name（商品名称）
  - Deliverable Description（交付物描述）
  - Revenue Model（收入模型）：One-time / Subscription / Usage-based
  - Status（状态）：Draft / Published / Archived

- **操作入口**：
  - Edit Product：编辑商品基础信息（跳转到编辑页面或打开编辑表单）
  - Publish / Archive：发布或归档商品

#### 5.4.2 Payment Links管理区
- **区域标题与操作**：
  - 标题："Payment Links"
  - 主按钮："Create Payment Link"（点击进入创建向导）

- **Links列表**（见5.3.3）：
  - 展示该Product的所有PaymentLink
  - 每行显示：Link Name、URL、关联Price、Status、Created At、Last Accessed At
  - 按创建时间倒序排序
  - 操作：启用/禁用、编辑Link Name、删除、复制URL

- **空状态**：
  - 当该Product没有Payment Links时，显示空状态
  - 引导文案："Create your first payment link to start selling"
  - 主按钮："Create Payment Link"

**移除区域**（从原设计）：
- 默认Price展示区（不再需要默认Price概念）
- 定价建议摘要区（简化详情页，避免信息过载）
- Performance区域（Clicks、Checkout started、Paid、转化率等漏斗数据）
- Last 7d Payments字段（移至Links列表或后续版本）

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
- 用途：承载"怎么收费"，一个 Product 可有多个 Price，每个 Price 对应一个 PaymentLink（1:1关系）。
- 必需字段（通用）：
  - price_id
  - product_id
  - price_name（必填）：价格方案的名称，如"Basic Tier"、"Pro Tier"、"Enterprise Plan"
  - revenue_model：one_time / subscription / usage_based
  - currency
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
- 规则：
  - **移除is_default概念**：不再需要默认Price，所有Price都是平等的
  - 创建Payment Link时必须创建新的Price

#### 6.1.3 PaymentLink（收款链接）
- 用途：生成可分享的链接，绑定一个独立的 Price，用于归因与收款。
- 必需字段：
  - payment_link_id
  - product_id
  - price_id（外键，绑定到一个Price）
  - link_name（必填）：链接的名称，用户可编辑，如"Basic Tier", "Twitter Campaign"
  - url（来自 Stripe/Payment 模块）
  - status：active / disabled
  - created_at
  - last_accessed_at（可选）：最后访问时间，用于展示
- 规则：
  - **1:1关系**：一个Price对应一个PaymentLink，创建Link时必须创建新的Price
  - Product archived 时，关联的 PaymentLink 必须 disabled。
  - Link的元数据（link_name）可编辑，但不能修改绑定的price_id。

#### 6.1.4 PricingInputSnapshot（定价输入快照）
- 用途：记录一次"定价建议请求"的结构化输入，支持追溯与复盘。
- 必需字段：
  - snapshot_id
  - product_id
  - revenue_model
  - target_customer_type（必填）
  - use_case_category（必填）
  - use_trace_cost_reference（boolean，是否使用trace成本参考）
  - avg_trace_cost（decimal，trace平均成本，如果使用）
  - manual_cost（decimal，手动输入的成本）
  - value_types（array of strings，多选的value types）
  - raw_inputs（JSON，存储完整表单结构化输入）
  - created_by（user_id）
  - created_at
- 规则：
  - raw_inputs 不包含任何终端客户 PII，只包含商户自身定价信息（成本/价值/频次等）。
  - avg_trace_cost 仅在use_trace_cost_reference为true时有值。

#### 6.1.5 PricingRecommendation（定价建议结果）
- 用途：保存 LLM 输出的推荐区间与解释，供 UI 展示与"Apply"动作使用。
- 必需字段：
  - recommendation_id
  - snapshot_id
  - recommended_min_price / recommended_typical_price / recommended_max_price
  - confidence_level：low / medium / high
  - assumptions（JSON：关键假设列表）
  - rationale（JSON：结构化理由）
  - cost_source：enum ('trace' | 'manual' | 'none') - 成本数据来源
  - has_cost_data：boolean - 是否有成本数据
  - llm_model
  - prompt_version
  - schema_version
  - applied_price_type：enum ('min' | 'typical' | 'max' | null) - 应用的价格类型
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
  - GET /products/{id}：详情（含基础信息、links列表）
  - PATCH /products/{id}：编辑基础信息
  - POST /products/{id}/publish：发布
  - POST /products/{id}/archive：归档
- Prices：
  - **移除独立的Price管理端点**：Price不再单独管理，而是通过创建Payment Link时一并创建
  - Price通过PaymentLink隐式管理，一个Price对应一个PaymentLink
- Payment links：
  - POST /products/{id}/payment-links：创建Payment Link（同时创建新Price，自动Publish如果Product是Draft）
    - Request body：
      - price_name（必填）：价格方案名称
      - revenue_model（必填）：收入模型
      - price_config（必填）：按revenue_model动态展开的价格配置
      - link_name（必填）：链接名称（可后续编辑）
      - currency（固定USD）
    - Response：创建的PaymentLink和Price信息
  - GET /products/{id}/payment-links：列表（含Link信息、关联Price、状态、时间）
  - GET /payment-links/{id}：单个Payment Link详情
  - PATCH /payment-links/{id}：编辑Link元数据（link_name）
  - POST /payment-links/{id}/enable：启用Link
  - POST /payment-links/{id}/disable：禁用Link
  - DELETE /payment-links/{id}：删除Link（及关联的Price）
- Merchants（新增）：
  - GET /merchants/{merchant_id}/avg-trace-cost：查询平均Trace成本
    - Response: { has_trace_data: boolean, avg_cost: decimal, trace_count: number, period_days: number }
- Pricing：
  - POST /products/{id}/pricing-snapshots：保存定价输入（或与 recommendation 请求合并）
  - POST /products/{id}/pricing-recommendations：请求定价建议（同步返回结果，或返回 job_id 轮询）
  - POST /pricing-recommendations/{id}/apply：把指定价格（min/typical/max）写入正在创建的Price，并记录 applied_price_type

### 6.4 埋点与归因（MVP）
- Catalog 行为事件（由前端采集）：
  - products_product_created
  - products_product_published
  - pricing_assistant_viewed（可选，追踪右侧组件查看率）
  - pricing_assistant_fields_completed（可选，追踪字段完成情况）
  - pricing_recommendation_requested
  - pricing_recommendation_received
  - pricing_recommendation_applied（包含applied_price_type: min/typical/max）
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
   - 校验必填字段：target_customer_type、use_case_category、currency（固定USD）、必要的 price context（例如 subscription 的 billing_period）。
   - 归一化金额与单位（例如把成本统一为货币金额；usage-based 的推荐价格明确为"per unit"）。

2. 组装成本参考（可选）
   - 若用户选择使用Trace成本参考（use_trace_cost_reference = true）：
     - 从系统查询该Merchant最近N条Trace（如最近30天或50条）的平均成本
     - 调用API：`GET /api/v1/merchants/{merchant_id}/avg-trace-cost`
     - 返回值包括：has_trace_data、avg_cost、trace_count、period_days
     - 如果没有trace数据，在响应中明确标记has_trace_data = false
   - 若用户填写manual_cost：
     - 将manual_cost作为cost_estimate
   - 若既无Trace也无manual_cost：
     - cost_estimate为null，继续生成建议（基于市场参考）

3. 组装 LLM prompt（见 7.3）

4. 调用 LLM 生成建议
   - 一期建议固定模型参数：
     - temperature 偏低（强调稳定与可复现）
     - 输出必须为 JSON，便于校验与渲染

5. 输出校验与安全处理
   - JSON schema 校验：字段齐全、类型正确、价格区间合理（min ≤ typical ≤ max）。
   - 基础合理性校验：
     - recommended_* 必须为正数
     - usage_based 下推荐的价格单位必须明确为"per unit"
   - 若 LLM 输出无法解析/校验失败 → 走降级策略（见 7.5）

6. 落库与返回
   - 保存 PricingInputSnapshot（含所有定价输入字段）
   - 保存 PricingRecommendation（包含 cost_source、has_cost_data、llm_model、prompt_version、schema_version）
   - 返回给前端用于渲染推荐卡片

7. 用户确认与应用
   - 用户可选择应用Min/Typical/Max中的任意一个价格
   - 「Apply」动作将对应价格写入默认 Price，并在 recommendation 上记录 applied_price_type 和 applied_to_price_id
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
    "use_trace_cost_reference": true,
    "avg_trace_cost": 0.50,
    "manual_cost": null,
    "value_types": ["save_time", "reduce_cost"]
  }
}
```

**字段说明**：
- `use_trace_cost_reference`：boolean，是否使用trace成本参考
- `avg_trace_cost`：decimal，trace平均成本（如果use_trace_cost_reference为true且有trace数据）
- `manual_cost`：decimal，手动输入的成本（如果用户填写）
- `value_types`：array of strings，多选的value types
- 若没有任何成本数据，avg_trace_cost和manual_cost都为null
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
  - 展示 min / typical / max 三点
  - 对每个价格点提供独立的「Apply」按钮（"Apply Min" / "Apply Typical" / "Apply Max"）
- 置信度
  - confidence_level 显示为 Badge（Low/Medium/High），并可悬浮查看原因（来自 assumptions）。
- 成本数据来源
  - 在Assumptions中明确说明成本数据来源（Trace / 手动输入 / 市场参考）

### 7.5 降级策略与失败处理（MVP 必须）
- LLM 请求失败/超时/输出不合规：
  - 返回"无法生成建议"的状态给前端，提供重试按钮。
  - 显示错误提示："Unable to generate suggestion. Please try again or set your price manually."
  - **不阻塞流程**：用户仍可手动填写价格并继续生成链接。
- 无成本数据：
  - 仍然生成建议，在Assumptions中明确说明："No cost data provided, recommendations based on market benchmarks only"
  - 自动设置confidence_level为Low或Medium
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
- 智能定价使用率：
  - 查看右侧组件的用户占比。
  - 请求建议的商品占比。
  - 采纳建议的比例（应用min/typical/max）。
- 链接转化漏斗：
  - Click → Checkout started → Paid。

### 8.2 埋点事件（示例）
- products_product_created
- products_product_published
- pricing_assistant_viewed
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
- Trace数据服务（用于计算平均成本）。

### 10.2 主要风险
- 成本数据不完整导致定价建议不准确（已通过无成本时仍可生成建议来缓解）。
- 商户对建议的预期过高，需要通过文案与 UI 控制期望。
- 智能定价作为可选组件，使用率可能较低（需要通过引导文案和UI设计来提高使用率）。

---

---

## 11. 里程碑建议（示意） (Milestones)

- Milestone 1：2步向导 + Product + Price + PaymentLink 基础能力，支持手动定价。
- Milestone 2：右侧智能定价组件（Pricing Assistant），支持Trace成本参考和手动成本输入。
- Milestone 3：商品详情页中的定价建议结果展示（简化版，无Performance区域）。
- 后续迭代：护栏提示、历史记录对比、更丰富的Subscription/Usage-based配置。
