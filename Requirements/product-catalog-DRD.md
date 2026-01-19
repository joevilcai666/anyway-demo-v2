# Anyway Products & Pricing Assistant DRD (Design Requirements Document)

| 文档信息 | 详情 |
| :--- | :--- |
| **项目** | Anyway - AI 商业化基础设施 |
| **模块** | Products - Products & Pricing Assistant |
| **版本** | v2.0 (2-Step Wizard + Optional Pricing Assistant) |
| **状态** | 详细设计规范（Detailed Design Spec） |
| **更新时间** | 2026-01-13 |
| **作者**：产品设计师 |
| **对应PRD**：product-catalog-and-pricing-agent-PRD.md v2.0 |

---

## 文档修订说明

**v2.0 重大更新**：
- ✅ 完全重写第3章"创建商品向导"，从3步改为2步结构
- ✅ 新增第3.2.3节"智能定价助手组件"，提供8个完整状态的详细交互规范
- ✅ 新增详细的视觉层次规范（背景色、边框、阴影、间距等）
- ✅ 完全重写第4章"Product Detail页面"，移除Performance区域
- ✅ 完全重写第5章"状态、反馈与错误处理"，删除护栏提示内容
- ✅ 完全重写第7章"文案与语气"，提供完整的文案规范和一致性检查清单
- ✅ 所有交互细节、状态转换、错误处理均已详细说明
- ✅ 所有文案与PRD完全一致

**设计目标**：
- 本DRD提供production-ready级别的设计规范
- AI可直接根据此文档生成高质量的产品原型
- 所有交互状态、视觉规范、文案均已明确定义
- 严格遵循PRD的功能范围，无超出或遗漏

---

## 1. 设计背景与目标

### 1.1 设计背景
- 本设计需求文档对应 PRD《Anyway Products & Pricing Agent》v2.0。
- 核心设计挑战：
  - 将复杂的创建流程简化为2步，同时保持信息的完整性和可理解性。
  - 设计一个不阻塞主流程的智能定价助手（Pricing Assistant），使其成为可选的辅助工具。
  - 在左右分栏布局中平衡左侧表单的核心路径和右侧组件的引导性。
- 设计师需要清晰理解：
  - 信息架构：Products模块在Console中的位置与层级。
  - 页面结构：商品列表、2步创建向导、商品详情的布局规范。
  - 交互细节：三种收入模型下的动态表单与Pricing Assistant的交互语法。
  - 状态与反馈：空状态、加载、错误、引导提示的视觉与交互规范。

### 1.2 设计目标
- **效率目标**：让首次使用的开发者/创始人，在3分钟内完成从"没有任何商品"到"生成首个收款链接"的路径。
- **认知目标**：用户能够清晰理解每个决策点（收入模型选择、定价配置），不感到困惑。
- **智能目标**：Pricing Assistant作为可选组件，通过问题引导式设计吸引用户，但不强迫使用。
- **美学目标**：遵循OOUI（Object-Oriented UI）原则，保持与Anyway Console设计系统的一致性。

---

## 2. 信息架构（IA）

### 2.1 模块定位
- Anyway Console 顶层导航（Sidebar Primary Navigation）：
  - Dashboard
  - **Products**（本次新增，原Product Catalog）
  - Payments
  - Finance
  - Settings

### 2.2 Products 子结构
- **Products**
  - Products 列表页（List View）
  - Add a Product 向导（2-Step Wizard）
  - Product Detail 页面（Detail View）
    - Overview（基础信息 + Last 7d Payments）
    - Pricing Summary（当前价格 + 定价建议摘要）
    - Links（收款链接列表）

### 2.3 页面导航与入口
- **主导航入口**：
  - 左侧Sidebar中新增「Products」入口，使用icon + label的导航项样式
  - 激活状态使用品牌色高亮背景

- **页内入口**：
  - Products 列表页：页面Header右上角Primary Action按钮「Add a Product」
  - Product Detail 页：页面Header右上角Primary Action按钮「Create payment link」
  - Products 列表页：每行提供「Edit」快捷入口（icon button或inline action）

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

#### 3.2.1 向导结构（2步Wizard）
本向导采用精简的2步结构，顶部步骤指示清晰：
- **Step 1**: 基础信息 + 收入模型 + 价格确认 + 智能定价助手（可选）
- **Step 2**: 生成收款链接

**设计原则**：
- Step 1采用左右分栏布局：左侧必填表单，右侧可选的智能定价助手
- 草稿自动保存：用户在Step 1填写任何字段时，自动保存为Draft状态
- 用户可以随时离开和回来，已填写内容不会丢失

#### 3.2.2 Step 1：基础信息 + 收入模型 + 价格确认

**总体布局**：
- 采用**左右分栏结构**：
  - 左侧（主栏，约65-70%宽度）：必填表单路径
  - 右侧（次栏，约30-35%宽度）：智能定价助手（可选组件）
- 在桌面宽屏下两栏并排显示，在笔记本尺寸下右侧组件可折叠

**左侧表单（必填路径）**：

##### 1. 基础信息字段
- **Product Name**（输入框，必填）
  - Label: "Product name"
  - Placeholder: "E.g., Weekly Business Report"
  - 验证规则：
    - 必填字段，提交时校验
    - 同一Merchant下必须唯一
    - 字符限制：1-255字符
  - 说明文字：输入框下方显示简短提示"Give your product a clear, descriptive name"

- **Deliverable Description**（多行文本框，可选）
  - Label: "What does your product deliver?"
  - Placeholder: "E.g., A weekly report summarizing your key business metrics and insights"
  - 字符限制：最多500字符
  - 说明文字：输入框下方显示"Optional: Help your customers understand what they'll receive"
  - 引导提示：在字段旁提供1-2个示例链接或折叠的"See examples"区域

##### 2. Revenue Model选择（核心交互）
- **选择方式**：使用三张卡片式单选组件，垂直排列
- **选项与说明**：

  **选项1：One-time**
  - Title: "One-time payment"
  - Description: "Charge once for a single delivery or service"
  - Example: "Perfect for: One-off reports, consultations, single-use tools"

  **选项2：Subscription**
  - Title: "Subscription"
  - Description: "Recurring payments for ongoing access or service"
  - Example: "Perfect for: Weekly reports, monthly analytics, ongoing support"

  **选项3：Usage-based**
  - Title: "Usage-based"
  - Description: "Charge based on how much your customers use"
  - Example: "Perfect for: API calls, token consumption, per-run executions"

- **交互状态**：
  - Default: 浅灰背景，边框颜色neutral-200
  - Hover: 背景变白，边框颜色加深neutral-300
  - Selected: 品牌色背景或边框高亮（根据设计系统），左侧显示选中标记（✓）
  - Focus: 显示focus ring（focus:ring-2）
- **选择后行为**：
  - 卡片下方动态展开对应的Price配置字段
  - 展开动画：smooth transition（duration-200），高度从0到auto
  - 同时滚动页面，确保展开的字段在视口内

##### 3. 价格配置字段（按Revenue Model动态展开）

**当选择"One-time"时展开：**
- **Price Amount**（数字输入框，必填）
  - Label: "Price"
  - Prefix: "$"（USD符号，固定显示）
  - Placeholder: "0.00"
  - 验证规则：
    - 必填字段
    - 范围：0.01 - 1,000,000
    - 最多2位小数
  - 说明文字：显示为"USD"（币种固定，不需要用户选择）

**当选择"Subscription"时展开：**
- **Amount**（数字输入框，必填）
  - Label: "Price per period"
  - Prefix: "$"
  - Placeholder: "0.00"
  - 验证规则：同One-time

- **Billing Period**（下拉选择，必填）
  - Label: "Billing period"
  - 选项：
    - "Monthly"
    - "Yearly"
  - 说明文字：选择后显示示例价格，例如"$99/month"或"$990/year"

**当选择"Usage-based"时展开：**
- **Unit Name**（文本输入框，必填）
  - Label: "Unit name"
  - Placeholder: "E.g., API call, 1K tokens, run"
  - 说明文字：输入框下方显示"Customers will be charged per unit"
  - 验证规则：必填，1-50字符

- **Unit Price**（数字输入框，必填）
  - Label: "Price per unit"
  - Prefix: "$"
  - Placeholder: "0.00"
  - 验证规则：同One-time

- **价格预览**：在字段下方动态显示，例如"$0.10 per API call"

##### 4. Revenue Model切换时的数据保留策略
- **保留字段**：Product Name、Deliverable Description
- **清空字段**：所有Revenue Model相关的价格配置字段
  - 从One-time切换到Subscription：清空Price Amount
  - 从Subscription切换到Usage-based：清空Amount、Billing Period
  - 等等
- **Pricing Assistant处理**：
  - 切换Revenue Model后，如果之前有生成的建议，清空建议结果
  - 显示提示："Your revenue model has changed. Please get a new pricing suggestion."
  - Pricing Assistant重置为默认空状态

**草稿自动保存反馈**：
- 在页面底部左侧显示小字："Draft saved at [timestamp]"
- 字号：text-xs
- 颜色：text-neutral-500
- 时间格式：12小时制，例如"2:35 PM"
- 不使用Toast或弹窗，避免干扰用户
- 每次自动保存后更新时间戳（节流机制，例如最多每5秒更新一次）

---

#### 3.2.3 智能定价助手组件（Pricing Assistant）

**组件概述与定位**：
- **位置**：Step 1页面右侧，固定展示（可折叠）
- **性质**：可选辅助组件，不阻塞主流程
- **目标**：帮助用户快速获取可执行的定价起点，但不强迫使用
- **用户可以**：完全忽略此组件，直接在左侧表单手动填写价格

##### 视觉层次与交互权重（关键设计规范）

**设计原则**：
- 右侧组件的视觉权重必须**弱于**左侧必填表单
- 用户应首先注意到左侧表单，其次才看到右侧辅助组件
- 通过视觉设计明确传达"可选"和"辅助"的性质

**详细视觉规范**：

1. **背景色差异**：
   - 使用与主表单**不同的背景色**来区分层次
   - 建议方案：使用浅色背景（如bg-neutral-50或bg-yellow-50/5）
   - 目的：让右侧组件在视觉上"后退"，不抢占注意力

2. **边框样式**：
   - 使用较细的边框（border-width: 1px）
   - 边框颜色浅于主表单（建议border-neutral-200或border-dashed）
   - 可选：使用虚线边框进一步弱化视觉存在感

3. **阴影层级**：
   - 阴影强度**弱于**主表单区域
   - 主表单：shadow-lg或shadow-xl
   - 右侧组件：shadow-sm或无shadow
   - 目的：避免右侧组件在视觉上"浮起"过多

4. **间距关系**：
   - 与主表单的gap：建议gap-6或gap-8（24-32px），足够分隔但不显得疏远
   - 内部padding：建议p-4或p-5（16-20px），保持内容紧凑
   - 目的：明确区域边界，同时保持整体布局紧凑

5. **标题与文字样式**：
   - 组件标题使用较小字号（text-base或text-sm）
   - 颜色使用中性色（text-neutral-700或text-neutral-600），避免强烈的品牌色
   - 说明文字使用更小字号（text-xs或text-[10px]）

6. **按钮样式**：
   - 主CTA（"Get pricing suggestion"）使用**次要按钮样式**（secondary button）
   - 避免使用primary button样式，防止与左侧表单的主按钮竞争
   - 按钮尺寸适中（md size），不过大

7. **典型场景下的视觉引导策略**：
   - **首次进入**：右侧组件展开但处于空状态，使用引导文案吸引用户，但不过度干扰
   - **填写主表单时**：用户注意力自然在左侧，右侧组件保持低视觉权重
   - **需要帮助时**：用户可以随时查看右侧组件，通过空状态文案引导使用
   - **已生成建议后**：右侧组件显示结果，但视觉权重仍然弱于主表单（背景色、边框样式保持不变）

##### 组件状态与交互流程

**状态1：默认空状态（Empty State）**

**触发条件**：用户首次进入Step 1，还未填写任何Pricing Assistant字段

**视觉表现**：
- 组件完全展开，占据右侧固定区域
- 背景色：浅色背景（如bg-neutral-50）
- 边框：1px solid，颜色border-neutral-200

**内容布局**：
```
┌─────────────────────────────┐
│ Pricing Assistant            │  ← 标题（text-base, font-semibold, text-neutral-700）
│                              │
│ [图标或插画]                 │  ← 简单图标（info-icon或lightbulb-icon）
│                              │
│ Not sure what to charge?     │  ← 引导标题（text-sm, font-medium, text-neutral-800）
│ Let our AI help you set      │  ← 引导描述（text-sm, text-neutral-600）
│ the right price.             │
│                              │
│ [Get pricing suggestion]     │  ← 主CTA按钮（secondary style，**置灰disabled**）
│                              │
│ [可选：提示文字]             │  ← text-xs, text-neutral-500
│ Answer 2 quick questions     │
│ to get personalized         │
│ recommendations              │
└─────────────────────────────┘
```

**文案规范**：
- 标题："Pricing Assistant"或"Need pricing help?"
- 引导标题："Not sure what to charge?"
- 引导描述："Let our AI help you set the right price."
- 按钮文字："Get pricing suggestion"（**必填字段未完成时置灰disabled**）
- 可选提示："Answer 2 quick questions to get personalized recommendations"

**按钮状态管理**：
- 初始状态：按钮置灰（disabled），背景色bg-neutral-100，文字text-neutral-400
- 触发条件：必填字段（Target customer type + Use case category）有值后，按钮变为可点击状态
- 可点击状态：背景色bg-white，边框border-neutral-300，hover时bg-neutral-50

---

**状态2：填写基础字段（Form State）**

**触发条件**：用户点击"Get pricing suggestion"按钮（或组件自动展开引导问题）

**视觉表现**：
- 保持相同的背景色和边框样式
- 内部布局从"引导文案"转换为"表单字段"

**内容布局**：
```
┌─────────────────────────────┐
│ Pricing Assistant            │
│                              │
│ Tell us about your business  │  ← 分组标题1（text-sm, font-semibold, text-neutral-700）
│                              │
│ Target customer type *       │  ← Label（text-xs, font-medium, text-neutral-600）
│ ○ Individual/Small team      │  ← Radio选项
│ ○ Small Business (10-50)     │
│ ○ Growth Enterprise (50+)    │
│                              │
│ Use case category *          │  ← Label（text-xs, font-medium, text-neutral-600）
│ [文本输入框]                 │  ← Placeholder: "E.g., Weekly business analytics"
│                              │
│ [Advanced options ▾]         │  ← 可折叠区域（text-xs, text-neutral-500）
│                              │
│ [Get pricing suggestion]     │  ← 主CTA（必填字段未完成时仍disabled）
└─────────────────────────────┘
```

**基础字段详细说明**：

1. **分组标题**："Tell us about your business"
   - 样式：text-sm, font-semibold, text-neutral-700
   - 位置：字段组上方，margin-bottom: 8px

2. **Target customer type**（单选，必填）
   - Label: "Target customer type"（text-xs, font-medium, text-neutral-600）
   - 必填标记：红色星号"*"
   - 选项展示：垂直排列的radio buttons
   - 选项内容：
     - "Individual/Small team"
     - "Small Business (10-50 people)"
     - "Growth Enterprise (50+ people)"
   - 说明文字：字段下方显示text-xs, text-neutral-500，例如"This helps us understand your pricing strategy"
   - 交互：选中后radio显示填充色或选中标记

3. **Use case category**（文本输入，必填）
   - Label: "Use case category"（text-xs, font-medium, text-neutral-600）
   - 必填标记：红色星号"*"
   - Placeholder: "E.g., Weekly business analytics"
   - 字段类型：单行文本输入框
   - 说明文字：字段下方显示text-xs, text-neutral-500，例如"Briefly describe what your product does"
   - 字符限制：1-200字符
   - 交互：输入后实时校验，超过限制时显示错误提示

4. **Advanced options**（可折叠区域）
   - 按钮：text-xs, text-neutral-500，右侧显示展开图标▶
   - 默认状态：折叠
   - 点击后展开，显示高级字段（见下一节）

**按钮状态更新逻辑**：
- 初始：disabled，背景色bg-neutral-100
- Target customer type已选，Use case category为空：仍disabled
- 两个字段都有值：变为enabled，背景色bg-white，文字text-neutral-900，边框border-neutral-300
- hover时：bg-neutral-50
- 点击后：触发"加载中"状态

---

**状态3：高级选项展开（Advanced Options State）**

**触发条件**：用户点击"Advanced options"展开按钮

**视觉表现**：
- 保持组件整体背景色和边框
- 高级区域使用较深的背景色区分（如bg-white或bg-neutral-100/50）

**内容布局**：
```
┌─────────────────────────────┐
│ Pricing Assistant            │
│                              │
│ [...基础字段...]             │
│                              │
│ Advanced options             │  ← 展开指示（▼图标）
│ ━━━━━━━━━━━━━━━━━━━━━━━━━  │  ← 分隔线（border-t, border-neutral-200）
│                              │
│ Cost information (optional)  │  ← 子分组标题（text-xs, font-semibold）
│                              │
│ ☐ Use my actual costs       │  ← Checkbox或Toggle开关
│   [说明文字]                 │  ← text-[10px], text-neutral-500
│                              │
│ [Trace成本展示区域]          │  ← 仅当勾选时显示
│ ├─ Average cost: $0.52       │  ← text-xs, font-mono, text-neutral-600
│ ├─ Based on: 47 traces       │
│ └─ Period: Last 30 days      │
│                              │
│ Or enter manual estimate:    │  ← Label（text-[10px], text-neutral-500）
│ [$0.00 per delivery]        │  ← 数字输入框
│                              │
│ Value type (optional)        │  ← 子分组标题（text-xs, font-semibold）
│                              │
│ ☐ Save time                  │  ← Checkbox多选
│ ☐ Increase revenue           │
│ ☐ Reduce cost                │
│ ☐ Other                      │
│                              │
│ [Get pricing suggestion]     │
└─────────────────────────────┘
```

**高级字段详细说明**：

##### A. Cost相关字段

**1. Use my actual costs**（Checkbox或Toggle开关）
- Label: "Use my actual costs"
- 说明文字：开关下方显示text-[10px], text-neutral-500，"We'll use your workflow cost data to calculate profitable pricing"
- 默认状态：未勾选（unchecked）

**2. Trace成本展示区域**（仅当勾选时显示）
- **显示条件**：用户勾选"Use my actual costs"，且后端返回has_trace_data = true
- **布局**：浅色背景框（bg-neutral-100），圆角rounded-md，padding: p-3
- **内容**：
  - "Average cost: $0.52 per delivery"（text-xs, font-mono, font-semibold, text-neutral-700）
  - "Based on: 47 traces"（text-[10px], text-neutral-500）
  - "Period: Last 30 days"（text-[10px], text-neutral-500）- **无数据时的处理**：如果后端返回has_trace_data = false，显示引导提示框：
  - 背景色：bg-blue-50或bg-info（浅蓝色）
  - 边框：border-blue-200
  - 图标：info-icon（蓝色）
  - 文案：
    - 标题："No cost data yet"（text-xs, font-semibold, text-blue-800）
    - 描述："We don't have your workflow cost data. Tell us your estimated cost per delivery to get better recommendations."（text-[10px], text-blue-700）
  - 引导动作：提示用户填写"Or enter manual estimate"字段**3. Manual cost input**（数字输入框，可选）
- Label: "Or enter manual estimate"
- 说明文字：text-[10px], text-neutral-500，"Estimated cost per delivery"
- Placeholder: "$0.00"
- 前缀："$"符号
- 验证规则：0 - 10,000，最多2位小数
- 说明：输入框下方显示text-[10px], text-neutral-400，"Help us calculate pricing that covers your costs"

##### B. Value type字段

**Label**："Value type (optional)"
**说明文字**：text-[10px], text-neutral-500，"Select all that apply"

**选项**（Checkbox多选）：
- ☐ Save time
- ☐ Increase revenue
- ☐ Reduce cost
- ☐ Other

**交互**：
- 点击选项时切换选中状态
- 选中项显示填充色或对勾标记
- 可以多选，也可以不选（完全可选）

---

**状态4：加载中（Loading State）**

**触发条件**：用户点击"Get pricing suggestion"按钮

**视觉表现**：
- 组件整体保持布局，避免高度跳变
- 背景色和边框保持不变
- 显示loading spinner或skeleton

**内容布局**：
```
┌─────────────────────────────┐
│ Pricing Assistant            │
│                              │
│ [spinner动画]                │  ← 居中显示，size: md
│                              │
│ Thinking about your price…   │  ← 加载文案（text-sm, text-neutral-600）
│ This usually takes 3-5       │  ← 次要文案（text-xs, text-neutral-500）
│ seconds.                     │
└─────────────────────────────┘
```

**动画与反馈**：
- Spinner：标准旋转动画（animate-spin），颜色neutral-400
- 文案："Thinking about your price…"（text-sm, text-neutral-600，居中）
- 次要文案："This usually takes 3-5 seconds."（text-xs, text-neutral-500）
- 避免使用过于活泼的文案（如"Hold tight..."），保持专业语气

**超时处理**：
- 如果请求超过10秒仍未返回，更新文案为"Taking longer than expected…"
- 提供"Cancel"按钮（text-xs, text-neutral-500，下划线）
- 用户点击Cancel后，恢复到之前的状态（保留已填写的字段）

---

**状态5：成功返回建议（Success State）**

**触发条件**：LLM成功返回定价建议

**视觉表现**：
- 保持组件背景色和边框
- 显示建议结果卡片
- 使用成功的视觉提示（如绿色accent或checkmark图标）

**内容布局**：
```
┌─────────────────────────────┐
│ Pricing Assistant            │
│                              │
│ ✓ Pricing suggestion ready   │  ← 成功标题（text-sm, font-semibold, text-green-700）
│ [Badge: Medium confidence]   │  ← 置信度badge（bg-green-50, text-green-700）
│                              │
│ Recommended price range      │  ← 分组标题（text-xs, font-semibold, text-neutral-700）
│                              │
│ Min      Typical   Max       │
│ $49      $99       $149      │  ← 价格展示（font-mono, font-semibold）
│ [Apply]  [Apply]   [Apply]   │  ← 应用按钮（secondary style, text-xs）
│                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                              │
│ Assumptions ▸                │  ← 可折叠区域（text-xs, text-neutral-500）
│                              │
│ [Regenerate suggestion]      │  ← 次要按钮（text-xs, text-neutral-500）
└─────────────────────────────┘
```

**建议输出详细说明**：

##### 1. 标题与置信度
- **成功标题**："Pricing suggestion ready"或"Your personalized pricing"
  - 样式：text-sm, font-semibold, text-green-700
  - 图标：左侧显示checkmark-icon（绿色，size: sm）
- **置信度Badge**：
  - 位置：标题右侧或下方
  - 样式：inline-block, px-2 py-1, rounded-full
  - 颜色根据置信度变化：
    - High: bg-green-50, text-green-700, border-green-200
    - Medium: bg-yellow-50, text-yellow-700, border-yellow-200
    - Low: bg-orange-50, text-orange-700, border-orange-200
  - 文案："High confidence"、"Medium confidence"、"Low confidence"

##### 2. 价格区间展示
- **分组标题**："Recommended price range"（text-xs, font-semibold, text-neutral-700）
- **布局**：三列等宽，使用Grid或Flex布局
- **列结构**：
  ```
  Min          Typical       Max
  $49          $99           $149
  [Apply Min]  [Apply Typ.]  [Apply Max]
  ```
- **价格展示**：
  - 字体：font-mono, font-semibold, text-lg或text-xl
  - 颜色：text-neutral-900
  - 币种符号：前缀"$"
  - 根据Revenue Model显示单位：
    - One-time: "$99"
    - Subscription: "$99/month"或"$990/year"
    - Usage-based: "$0.10 per [unit name]"
- **Apply按钮**：
  - 每个价格点下方一个按钮
  - 样式：secondary button，小尺寸（sm或xs）
  - 文案："Apply Min"、"Apply Typical"、"Apply Max"
  - hover时：bg-neutral-100，边框颜色加深
  - 点击后：将对应价格填入左侧Price输入框，并显示确认反馈

##### 3. Assumptions / Rationale（可折叠）
- **标题**："Assumptions"或"See details"（text-xs, text-neutral-500）
- **图标**：右侧显示▶或▶指示可折叠
- **默认状态**：折叠
- **点击后展开**：
  - 背景色：bg-white或bg-neutral-50，区分于主区域
  - 边框：border-t, border-neutral-200
  - 内容：结构化的假设列表
  ```
  Assumptions:
  • Based on market benchmarks for similar products
  • Targeting Small Business (10-50 people) customers
  • Cost data: Using your actual workflow costs ($0.52/delivery)
  • Expected value: Save time for customers

  Rationale:
  • Min price: Covers your costs with 20% margin
  • Typical price: Aligns with market median for similar services
  • Max price: Premium pricing for high-value customers
  ```
  - 样式：text-[10px]或text-xs, text-neutral-600, 行高leading-relaxed
  - 列表项使用bullet points或numbered list

##### 4. 重新生成按钮
- **文案**："Regenerate suggestion"
- **位置**：组件底部，Assumptions下方
- **样式**：text按钮（text button），text-xs, text-neutral-500
- **交互**：hover时显示下划线或bg-neutral-50
- **功能**：点击后重新请求LLM，返回"加载中"状态

---

**状态6：失败与降级处理（Error State）**

**触发条件**：LLM请求失败、超时、或返回无法解析的结果

**视觉表现**：
- 保持组件布局，不跳变
- 使用错误视觉提示（红色或橙色accent）
- 提供降级方案，不阻塞主流程

**内容布局**：
```
┌─────────────────────────────┐
│ Pricing Assistant            │
│                              │
│ ⚠ Unable to generate        │  ← 错误标题（text-sm, font-semibold, text-orange-700）
│ suggestion                   │
│                              │
│ [错误提示框]                 │  ← bg-orange-50, border-orange-200
│ Something went wrong.        │
│ Please try again or set     │
│ your price manually.         │
│                              │
│ [Try again]  [Dismiss]       │  ← 主按钮 + 次要按钮
│                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                              │
│ [保留已填写的字段]           │
│ Target customer type: Small  │
│ Business (10-50)             │
│ Use case: Weekly analytics   │
└─────────────────────────────┘
```

**错误处理详细说明**：

##### 1. 错误提示框
- **背景色**：bg-orange-50或bg-red-50（浅色）
- **边框**：border-orange-200或border-red-200
- **圆角**：rounded-md
- **Padding**：p-3或p-4
- **图标**：左侧显示warning-icon或error-icon（橙色或红色）

##### 2. 错误文案
- **标题**："Unable to generate suggestion"（text-sm, font-semibold, text-orange-700）
- **描述**（可选）：
  - 通用："Something went wrong. Please try again or set your price manually."
  - 超时："Request timed out. Please try again."
  - 无LLM响应:"Unable to connect to pricing service. Please try again later."
- **样式**：text-xs, text-orange-800或text-red-800

##### 3. 按钮组合
- **主按钮**："Try again"（primary或secondary style）
  - 点击后：重新请求LLM，返回"加载中"状态
- **次要按钮**："Dismiss"（text button或ghost style）
  - 点击后：关闭错误提示，返回到之前的表单状态（保留已填写的字段）

##### 4. 降级策略：不阻塞流程
- **关键原则**：即使Pricing Assistant失败，用户仍可继续主流程
- **保留数据**：错误状态下保留用户已填写的所有字段（Target customer type、Use case等）
- **手动定价提示**：
  - 在错误提示下方显示text-xs, text-neutral-500
  - 文案："You can still set your price manually in the form on the left."
  - 可选：添加一个指向左侧Price输入框的视觉指示（如箭头或highlight）
- **重试机制**：用户可以点击"Try again"重新请求，也可以修改输入后重试

---

**状态7：无成本数据（No Cost Data State）**

**触发条件**：
- 用户勾选了"Use my actual costs"，但后端返回has_trace_data = false
- 或者用户既未勾选Trace，也未填写Manual cost

**视觉表现**：
- 组件仍正常显示其他字段
- 在Cost区域显示info提示框
- 仍允许生成建议（基于市场参考定价）

**内容布局**（集成在Advanced Options区域内）：
```
┌─────────────────────────────┐
│ Advanced options             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                              │
│ Cost information (optional)  │
│                              │
│ ☐ Use my actual costs       │  ← 勾选后显示下方内容
│   [Info提示框]               │  ← bg-blue-50, border-blue-200
│   ℹ No cost data yet        │
│   We don't have your cost    │
│   data yet. Tell us your    │
│   estimated cost per        │
│   delivery to get better    │
│   recommendations.          │
│                              │
│ Or enter manual estimate:    │
│ [$0.00 per delivery]        │
│                              │
│ [Get pricing suggestion]     │  ← 按钮仍可点击（enabled）
└─────────────────────────────┘
```

**无成本数据时的建议输出**：
- 如果用户在无成本数据情况下仍获取建议，成功返回后在Assumptions中明确说明：
  - "No cost data provided"（text-[10px], text-orange-700或font-semibold）
  - "Recommendations based on market benchmarks only"（text-[10px], text-neutral-600）
- 置信度自动设置为Low或Medium（不显示High）

---

**状态8：Out of date（过期状态）**

**触发条件**（用户决策：仅Pricing inputs字段变更）：
- 用户已获取过至少一次建议
- 之后修改了以下任一字段：
  - Target customer type
  - Use case category
  - Cost相关字段（Trace成本参考开关、手动成本输入）
  - Value type

**不触发Out of date**：
- 修改Product Name或Description
- 切换Revenue Model（这种情况下直接清空建议，而不是显示Out of date）

**视觉表现**：
- 组件整体保持背景色和边框
- 在顶部显示"Out of date"badge或banner
- 主CTA从"Get pricing suggestion"变为"Regenerate suggestion"

**内容布局**：
```
┌─────────────────────────────┐
│ [⚠ Out of date]             │  ← Badge（bg-orange-50, text-orange-700）
│ Pricing Assistant            │
│                              │
│ [之前显示的建议结果]         │  ← 保留之前的建议，但灰化或降低透明度
│ Min: $49  Typical: $99       │
│                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                              │
│ You've updated your inputs.  │  ← 提示文案（text-xs, text-neutral-600）
│ [Regenerate suggestion]      │  ← 主CTA（primary style，吸引注意）
└─────────────────────────────┘
```

**交互细节**：
- **Badge样式**：
  - 文案："Out of date"或"Inputs changed"
  - 样式：inline-block, px-2 py-0.5, rounded, bg-orange-50, text-orange-700
  - 位置：组件标题右侧或下方
- **之前建议的处理**：
  - 保留显示，但使用opacity: 0.6或0.7
  - 或者将整个建议区域收起到折叠的"Previous suggestion"中
  - Apply按钮置灰（disabled），无法点击
- **主CTA变化**：
  - 文案从"Get pricing suggestion"变为"Regenerate suggestion"
  - 样式升级为primary button（更明显的视觉权重）
  - 目的：引导用户重新生成建议
- **提示文案**：
  - "You've updated your inputs. Generate a new suggestion for updated pricing."
  - 或"Your inputs have changed. Regenerate to see updated recommendations."

---

##### 响应式行为（Responsive）

**桌面宽屏（> 1280px）**：
- 左右两栏并排显示
- 右侧Pricing Assistant固定宽度（例如320px或360px）
- 左侧表单占据剩余空间
- 使用sticky定位：当页面滚动时，右侧组件保持可见（如果高度允许）

**笔记本尺寸（1024px - 1280px）**：
- 保持左右分栏布局
- 右侧组件宽度可缩小至280px或300px
- 减少内部padding（从p-5改为p-4）
- 字号略微缩小（text-base改为text-sm）

**平板尺寸（768px - 1024px）**：
- 选项1：右侧组件折叠为可展开的panel
  - 默认折叠，右侧显示"Show pricing assistant"按钮
  - 点击后展开为overlay或side panel
- 选项2：改为上下布局
  - 左侧表单在上，右侧组件在下
  - 使用border-t分隔，右侧组件占据完整宽度

**移动端（< 768px）**：
- 完全隐藏右侧组件
- 在页面顶部显示小的"Get pricing help"链接或按钮
- 点击后打开full-screen modal或bottom sheet
- Modal内包含完整的Pricing Assistant表单和结果

---

##### 应用交互（Apply Action）

**触发条件**：用户点击"Apply Min"、"Apply Typical"或"Apply Max"按钮

**交互流程**：
1. **点击Apply按钮**：
   - 按钮显示loading状态（spinner或"…"）
   - 持续时间：100-300ms（模拟视觉反馈）

2. **更新左侧Price输入框**：
   - 将对应价格填入左侧表单的Price输入框
   - 输入框短暂闪烁或高亮（bg-yellow-50或border-yellow-400）
   - 持续时间：500ms - 1s，然后恢复默认样式
   - 目的：让用户注意到价格已应用

3. **确认反馈**（可选）：
   - 显示小的Toast或tooltip："Price applied: $99"
   - 或在按钮旁边显示✓图标，1秒后消失

4. **按钮状态**：
   - Apply按钮在应用后可以继续点击（不disabled）
   - 或显示为"Applied"状态（短暂的文字变化）

5. **滚动到Price字段**（如果需要）：
   - 如果Price输入框不在视口内，平滑滚动到该字段
   - 使用scrollIntoView({ behavior: 'smooth', block: 'center' })

**特殊处理**：
- **Subscription模型**：同时填写Amount和Billing Period
- **Usage-based模型**：同时填写Unit Price和Unit Name（如果Recommendation包含单位建议）
- **数据记录**：
  - 在PricingRecommendation记录中标记applied_price_type（'min' | 'typical' | 'max'）
  - 记录applied_to_price_id和applied_at时间戳

---

##### 关键交互原则总结

1. **不阻塞主流程**：
   - Pricing Assistant完全可选
   - 用户可以完全忽略，直接在左侧表单填写价格
   - 失败或错误时，仍允许手动定价

2. **视觉层次清晰**：
   - 右侧组件视觉权重弱于左侧必填表单
   - 使用浅色背景、较细边框、较弱阴影
   - 按钮使用secondary style，不与主按钮竞争

3. **引导式设计**：
   - 空状态使用友好的引导文案吸引用户
   - 问题式表单（"Tell us about your business"）降低填写门槛
   - 提供可选的Advanced options，不强迫填写

4. **响应迅速**：
   - 按钮状态实时更新（字段填写后立即enabled）
   - 加载状态清晰（spinner + 文案）
   - 成功/失败反馈明确

5. **容错性强**：
   - 失败时提供重试和降级方案
   - 无成本数据时仍可生成建议
   - Out of date状态清晰提示重新生成

---

#### 3.2.4 Step 2：生成收款链接（Generate Payment Link）

**步骤概述**：
- 这是向导的第二步，也是最后一步
- 用户在此步骤确认产品信息并生成可分享的收款链接
- 如果Product是Draft状态，会自动Publish

**总体布局**：
- 使用居中容器，最大宽度max-w-2xl或max-w-3xl
- 垂直布局，从上到下依次展示产品摘要、生成按钮、链接展示、成功反馈

##### 1. 页面标题与进度指示
- **页面标题**："Review and generate link"或"Almost done!"
- **进度指示**：顶部stepper显示当前在Step 2 of 2
- **副标题**（可选）："Review your product details and generate a shareable payment link"

##### 2. 产品摘要卡片（Product Summary）

**布局结构**：
```
┌─────────────────────────────────────┐
│ Product Summary                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ Product name                        │
│ Weekly Business Report              │  ← text-lg, font-semibold
│                                     │
│ Revenue model                       │
│ One-time payment                    │  ← badge样式
│                                     │
│ Price                               │
│ $99 USD                             │  ← text-xl, font-mono, font-semibold
│                                     │
│ [Edit details]                      │  ← text链接，返回Step 1
└─────────────────────────────────────┘
```

**详细字段说明**：

**卡片容器**：
- 背景色：bg-white
- 边框：border, border-neutral-200
- 圆角：rounded-xl
- 阴影：shadow-sm
- Padding：p-6

**Product name**：
- Label："Product name"（text-xs, font-medium, text-neutral-500）
- 值：用户在Step 1填写的Product Name
- 样式：text-lg, font-semibold, text-neutral-900
- 字符限制：超过50字符时截断，显示完整名称在tooltip中

**Deliverable Description**（可选，如果有填写）：
- Label："What it delivers"（text-xs, font-medium, text-neutral-500）
- 值：用户填写的Description
- 样式：text-sm, text-neutral-700
- 字符限制：超过100字符时截断为2行，显示"Show more"链接
- 点击"Show more"后展开完整描述

**Revenue model**：
- Label："Revenue model"（text-xs, font-medium, text-neutral-500）
- 值：显示为badge样式
- Badge样式：
  - One-time: bg-blue-50, text-blue-700, border-blue-200
  - Subscription: bg-purple-50, text-purple-700, border-purple-200
  - Usage-based: bg-green-50, text-green-700, border-green-200
- 显示内容：
  - One-time: "One-time payment"
  - Subscription: "Subscription (Monthly)"或"Subscription (Yearly)"
  - Usage-based: "Usage-based (per [unit name])"

**Price**：
- Label："Price"（text-xs, font-medium, text-neutral-500）
- 值：根据Revenue Model显示不同格式
  - One-time: "$99 USD"
  - Subscription: "$99/month USD"或"$990/year USD"
  - Usage-based: "$0.10 per [unit name] USD"
- 样式：text-xl, font-mono, font-semibold, text-neutral-900
- 强调：使用品牌色或中性深色，突出显示价格

**Status**（如果Product不是Draft）：
- Label："Status"
- 值：Status badge
  - Draft: bg-gray-50, text-gray-700, border-gray-200
  - Published: bg-green-50, text-green-700, border-green-200
  - Archived: bg-neutral-100, text-neutral-500, border-neutral-200

**编辑入口**：
- 位置：卡片底部右侧
- 样式：text链接，text-sm, text-neutral-600
- 文案："Edit details"或"← Go back"
- 交互：hover时显示下划线，点击后返回Step 1，保留已填写的数据

##### 3. 生成按钮区域

**布局**：
- 位置：产品摘要卡片下方，居中对齐
- 按钮样式：Primary button
- 尺寸：Large（lg size）
- 文案："Generate payment link"
- 图标：右侧显示link图标或箭头图标（可选）

**按钮状态**：
- **默认状态**：enabled，可点击
- **点击后**：进入loading状态
  - 显示spinner动画，size: sm
  - 文案变为"Generating link…"或保持"Generate payment link"
  - 按钮disabled，防止重复点击
- **成功后**：自动滚动到链接展示区域

**说明文字**（按钮下方）：
- 文案："Your product will be published automatically if it's still a draft."
- 样式：text-xs, text-neutral-500
- 目的：告知用户会自动Publish，避免混淆

##### 4. 自动发布逻辑（Auto-Publish）

**触发条件**：
- 用户点击"Generate payment link"
- 当前Product状态为Draft

**流程**：
1. 后端接收请求，检查Product状态
2. 如果是Draft，自动执行Publish操作
3. 生成PaymentLink，绑定Product和默认Price
4. 返回生成的URL

**用户感知**：
- 用户无感知自动发布过程
- 不会显示单独的"Publishing…"状态
- 在生成链接的loading过程中完成Publish
- 成功后产品摘要中的Status badge更新为Published

**错误处理**：
- 如果Publish失败：显示错误提示，阻止生成链接
- 错误文案："Unable to publish product. Please try again."
- 提供"Retry"按钮

##### 5. 链接展示区域（Link Display）

**触发条件**：PaymentLink生成成功后显示

**布局结构**：
```
┌─────────────────────────────────────┐
│ ✓ Your product is live!            │  ← 成功标题
│ Share this link to start receiving  │  ← 引导文案
│ payments.                           │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ https://pay.anyway.ai/p/abc123  │ │  ← URL展示框
│ └─────────────────────────────────┘ │
│                                     │
│ [Copy link]    [Test link]          │  ← 操作按钮
└─────────────────────────────────────┘
```

**详细说明**：

**成功标题**：
- 文案："Your product is live!"或"Payment link ready!"
- 图标：左侧显示✓图标（绿色，checkmark-icon）
- 样式：text-lg或text-xl, font-semibold, text-green-700
- 动画：从下方淡入（fade-in-up），duration-300

**引导文案**：
- 文案："Share this link to start receiving payments."
- 样式：text-sm, text-neutral-600
- 位置：成功标题下方

**URL展示框**：
- 容器样式：
  - 背景色：bg-neutral-50或bg-gray-50
  - 边框：border, border-neutral-300
  - 圆角：rounded-lg或rounded-md
  - Padding：p-3或p-4
  - 宽度：100%，最大宽度max-w-lg
- URL文本：
  - 显示完整的PaymentLink URL
  - 样式：text-sm, font-mono, text-neutral-700
  - 居中对齐或左对齐
  - 如果URL过长，使用省略号截断，hover时显示完整URL
- 可选：显示二维码图标，hover时展开二维码（移动端友好）

**操作按钮**：

**主按钮：Copy link**
- 样式：Primary或Secondary button
- 文案："Copy link"
- 图标：左侧或右侧显示copy-icon
- 点击后：
  - 复制URL到剪贴板
  - 按钮短暂显示"Copied!"（500ms-1s）
  - 或显示小的tooltip："Link copied!"
  - 可选：显示checkmark图标，1秒后恢复

**次要按钮：Test link**（可选）
- 样式：text按钮或ghost button
- 文案："Test link"或"Open in new tab"
- 图标：右侧显示external-link-icon
- 行为：在新标签页打开PaymentLink
- 目的：让用户测试链接是否正常工作

**附加操作**（三点菜单或次要链接）：
- "Create another link"：生成同一个Product的另一个PaymentLink
- "Go to Dashboard"：跳转到Dashboard或Products列表页

##### 6. 成功反馈详细流程（Success Feedback）

**完整交互时序**：

1. **点击"Generate payment link"按钮**
   - 按钮进入loading状态（spinner + 文案变化）
   - 后端开始处理（可能需要2-5秒）

2. **生成中状态（如果超过2秒）**
   - 在按钮下方显示loading提示（可选）
   - 文案："Generating your link…"
   - 或显示进度指示器（progress bar，非必需）

3. **成功返回后**
   - 按钮恢复默认状态或变为"Generate another link"
   - 成功区域从下方淡入（fade-in-up）
   - 页面自动滚动到成功区域顶部
   - 滚动行为：smooth scroll，duration-300

4. **成功Toast**（可选，叠加在页面右上角）
   - 文案："Payment link created successfully!"
   - 样式：bg-green-50, border-green-200, text-green-800
   - 图标：checkmark-icon
   - 自动消失：3-5秒后自动隐藏
   - 手动关闭：提供×按钮

5. **成功区域展示**（如上述"链接展示区域"）

##### 7. "What's next"引导（可选）

**位置**：链接展示区域下方

**目的**：引导用户完成下一步操作，提高转化率

**布局**：
```
┌─────────────────────────────────────┐
│ What's next?                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ 1. Copy the link and share it       │  ← 步骤1
│    with your customers              │
│                                     │
│ 2. Test the link yourself           │  ← 步骤2
│                                     │
│ 3. View payments in Dashboard       │  ← 步骤3
│    [Go to Dashboard]                │
└─────────────────────────────────────┘
```

**样式**：
- 容器：浅色背景（bg-neutral-50或bg-yellow-50/5）
- 边框：border-neutral-200
- 圆角：rounded-lg
- Padding：p-5

**步骤样式**：
- 编号：使用圆圈数字（①②③）或粗体数字（1. 2. 3.）
- 文案：text-sm, text-neutral-700
- 布局：垂直列表，每个步骤占据一行

**交互**：
- "Go to Dashboard"按钮：Primary或Secondary style
- 点击后跳转到Dashboard或Products列表页
- 可选：在新标签页打开

**可折叠**：
- 默认展开
- 提供折叠按钮："Hide"
- 折叠后显示小按钮："Show next steps"

##### 8. 错误处理与降级

**错误场景**：

**场景1：生成链接失败（服务器错误）**
- **错误提示**：
  - 标题："Unable to generate payment link"
  - 描述："Something went wrong. Please try again."
  - 样式：bg-red-50, border-red-200, text-red-800
- **操作**：
  - "Try again"按钮：重试生成链接
  - "Go back"按钮：返回Step 1

**场景2：Product缺少必要信息**
- **错误提示**：
  - 标题："Incomplete product information"
  - 描述："Please fill in all required fields before generating a link."
- **操作**：
  - "Go back to Step 1"按钮
  - 在Product Summary中高亮缺失的字段

**场景3：Payment模块不可用**
- **错误提示**：
  - 标题："Payment service unavailable"
  - 描述："We're unable to generate payment links right now. Please try again later."
- **操作**：
  - "Retry"按钮
  - "Contact support"链接（可选）

**降级策略**：
- 即使失败，用户仍可以返回Step 1修改信息
- 不清除已填写的数据
- 提供清晰的错误原因和解决方案

##### 9. 页面底部操作

**位置**：页面底部，固定或随内容滚动

**主要操作**：
- "← Back"：返回Step 1（次要按钮，text样式）
- "Finish"：跳转到Products列表或Dashboard（成功生成链接后显示）

**导航路径**：
- 用户成功生成链接后，提供明确的下一步选择：
  - "Go to Products"：返回Products列表页
  - "View in Dashboard"：跳转到Dashboard
  - "Create another product"：开始新的创建流程

---

## 4. Product Detail 页面

### 4.1 布局
**页面结构**：
- 顶部 Header：
  - 左侧：Product 名称 + 状态标签（Draft/Published/Archived）
  - 右侧：主要 CTA：
    - 「Create payment link」按钮（Primary style）
    - 辅助菜单：Edit product / Archive（三点菜单或下拉菜单）

- 页面内容布局（单列或简化两列）：
  - **方案1：单列布局**（推荐，简化后）
    - Overview区域（全宽）
    - Pricing summary区域（全宽）
    - Links区域（全宽）
  - **方案2：两列布局**
    - 左列（较宽，约65%）：Overview + Links
    - 右列（较窄，约35%）：Pricing summary

**间距与分隔**：
- 区域之间使用gap-6或gap-8（24-32px）
- 每个区域使用独立的card容器（bg-white, border, rounded-xl）

### 4.2 Overview 区域
**触发条件**：用户点击Products列表页中的某一行，或通过其他方式进入Product Detail页

**内容展示**：
```
┌─────────────────────────────────────┐
│ Overview                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ Product name                        │
│ Weekly Business Report              │
│                                     │
│ Description                         │
│ A weekly report summarizing your    │
│ key business metrics and insights   │
│                                     │
│ Revenue model                       │
│ [One-time badge]                    │
│                                     │
│ Price                               │
│ $99 USD                             │
│                                     │
│ Status                              │
│ [Published badge]                   │
│                                     │
│ Last updated                        │
│ Jan 13, 2026 at 2:35 PM             │
│                                     │
│ [Edit product]                      │
└─────────────────────────────────────┘
```

**详细字段说明**：

**卡片容器**：
- 背景色：bg-white
- 边框：border, border-neutral-200
- 圆角：rounded-xl
- 阴影：shadow-sm
- Padding：p-6

**Product name**：
- Label："Product name"（text-xs, font-medium, text-neutral-500）
- 值：Product的name字段
- 样式：text-2xl, font-bold, text-neutral-900
- 字符限制：无截断，完整显示

**Description**（如果有）：
- Label："Description"（text-xs, font-medium, text-neutral-500）
- 值：Product的deliverable_description
- 样式：text-base, text-neutral-700, leading-relaxed
- 空状态：如果为空，显示"-"或"No description provided"（text-neutral-400）

**Revenue model**：
- Label："Revenue model"（text-xs, font-medium, text-neutral-500）
- 值：显示为badge，样式与Step 2产品摘要一致
- 显示内容：
  - One-time: "One-time payment"
  - Subscription: "Subscription (Monthly)"或"Subscription (Yearly)"
  - Usage-based: "Usage-based (per [unit name])"

**Price**：
- Label："Price"（text-xs, font-medium, text-neutral-500）
- 值：显示默认Price的详细信息
- 格式：
  - One-time: "$99 USD"
  - Subscription: "$99/month USD"
  - Usage-based: "$0.10 per API call USD"
- 样式：text-lg, font-mono, font-semibold, text-neutral-900

**Status**：
- Label："Status"（text-xs, font-medium, text-neutral-500）
- 值：Status badge
  - Draft: bg-gray-50, text-gray-700, border-gray-200
  - Published: bg-green-50, text-green-700, border-green-200
  - Archived: bg-neutral-100, text-neutral-500, border-neutral-200

**Last updated**：
- Label："Last updated"（text-xs, font-medium, text-neutral-500）
- 值：Product的updated_at时间
- 格式："Jan 13, 2026 at 2:35 PM"（12小时制）
- 样式：text-sm, text-neutral-600

**Last 7d Payments**（新增字段）：
- Label："Last 7 days"（text-xs, font-medium, text-neutral-500）
- 值：最近7天的支付数量或金额
- 样式：text-lg, font-semibold, text-neutral-900
- 空状态：如果没有支付数据，显示"No payments yet"（text-neutral-400）

**编辑入口**：
- 位置：Overview卡片底部右侧
- 样式：Secondary button或text按钮
- 文案："Edit product"
- 点击后：打开编辑表单（可能是modal或跳转到编辑页面）
- 可选：提供"Archive"操作入口（红色danger按钮）

### 4.3 Pricing summary 区域
**位置**：Overview下方，或右侧（如果是两列布局）

**内容展示**：
```
┌─────────────────────────────────────┐
│ Pricing Summary                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ Current price                       │
│ $99/month                           │  ← text-lg, font-mono
│                                     │
│ Latest pricing recommendation       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Date: Jan 13, 2026                  │
│ Recommended range:                  │
│ Min $79 - Typical $99 - Max $149    │
│                                     │
│ Applied: Typical                    │  ← text-xs, text-green-700
│ ✓ Applied on Jan 13, 2026           │
│                                     │
│ [View full recommendation history]  │  ← text链接
└─────────────────────────────────────┘
```

**详细字段说明**：

**卡片容器**：
- 背景色：bg-white（与Overview一致）
- 其他样式与Overview相同

**Current price**：
- Label："Current price"（text-xs, font-medium, text-neutral-500）
- 值：当前Product的默认Price
- 格式：与Overview中的Price字段一致
- 样式：text-lg, font-mono, font-semibold, text-neutral-900

**Latest pricing recommendation**（如果存在）：
- **Label**："Latest pricing recommendation"（text-sm, font-semibold, text-neutral-700）
- **分隔线**：border-t, border-neutral-200
- **Date**："Jan 13, 2026"（text-xs, text-neutral-500）
- **Recommended range**：
  - 格式："Min $79 - Typical $99 - Max $149"
  - 样式：text-sm, font-mono, text-neutral-700
  - 或使用三列布局展示Min/Typical/Max
- **Applied状态**：
  - 如果已应用：显示"Applied: [Min/Typical/Max]"（text-xs, font-semibold, text-green-700）
  - 如果未应用：显示"Not applied"（text-xs, text-neutral-500）
- **Applied时间**：
  - 如果已应用："Applied on Jan 13, 2026 at 2:35 PM"（text-xs, text-neutral-600）
  - 显示✓图标（绿色，checkmark-icon）
- **手动修改提示**（如果用户手动修改了应用的价格）：
  - 显示："Modified after applying"（text-xs, text-orange-700）
  - 或："Price manually adjusted from $99 to $109"（text-xs, text-neutral-600）

**查看历史入口**：
- 样式：text链接，text-xs, text-neutral-600
- 文案："View full recommendation history"
- 点击后：打开历史记录modal或展开历史列表
- 如果没有任何recommendation，隐藏此区域或显示"No recommendations yet"

**空状态**（如果没有任何recommendation）：
```
┌─────────────────────────────────────┐
│ Pricing Summary                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ Current price                       │
│ $99/month                           │
│                                     │
│ [空状态插画或图标]                  │
│                                     │
│ No pricing recommendations yet      │
│ Get personalized pricing            │
│ suggestions for your product.       │
│                                     │
│ [Get pricing suggestion]            │  ← Secondary button
└─────────────────────────────────────┘
```

- 文案："No pricing recommendations yet"
- 描述："Get personalized pricing suggestions for your product."（text-sm, text-neutral-600）
- 按钮："Get pricing suggestion"（Secondary style）
- 点击后：打开Pricing Assistant组件（可能是在当前页面展开或跳转到编辑页面）

### 4.4 Links 区域
**位置**：Pricing Summary下方（单列布局）或左列下方（两列布局）

**内容展示**：
```
┌─────────────────────────────────────┐
│ Payment Links                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ [Create payment link]               │  ← Primary按钮
│                                     │
│ Link 1                              │
│ URL: https://pay.anyway.ai/p/abc123 │
│ Status: [Active badge]              │
│ Last 7 days: 12 clicks, 3 payments  │
│ [Copy] [Test] [Disable]             │
│                                     │
│ Link 2                              │
│ URL: https://pay.anyway.ai/p/def456 │
│ Status: [Disabled badge]            │
│ Last 7 days: 5 clicks, 1 payment    │
│ [Copy] [Enable]                     │
└─────────────────────────────────────┘
```

**详细字段说明**：

**区域标题与操作**：
- 标题："Payment Links"（text-base, font-semibold, text-neutral-900）
- 右侧按钮："Create payment link"（Primary button，sm尺寸）
- 点击后：打开创建链接modal或跳转到创建流程

**Link列表**：
- 每个Link占据一个卡片或行
- 布局：垂直堆叠，每个Link之间使用border-t分隔

**单个Link卡片**：
- **URL展示**：
  - Label："URL"（text-xs, font-medium, text-neutral-500）
  - 值：完整的PaymentLink URL
  - 样式：text-sm, font-mono, text-neutral-700
  - 截断：超过60字符时使用省略号，hover时显示完整URL（tooltip）
- **Status badge**：
  - Active: bg-green-50, text-green-700, border-green-200
  - Disabled: bg-gray-100, text-gray-500, border-gray-200
- **Last 7d表现**：
  - Label："Last 7 days"（text-xs, font-medium, text-neutral-500）
  - 值："X clicks, Y payments"或"$X in revenue"
  - 样式：text-sm, text-neutral-700
  - 数字使用font-mono
- **操作按钮**：
  - Copy: 复制URL到剪贴板（icon button）
  - Test: 在新标签页打开链接（icon button）
  - Disable/Enable: 切换Link状态（icon button或text button）
  - Disabled状态的Link不显示"Test"按钮

**空状态**（如果没有PaymentLink）：
```
┌─────────────────────────────────────┐
│ Payment Links                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ [Create payment link]               │  ← Primary按钮
│                                     │
│ [空状态插画或图标]                  │
│                                     │
│ No payment links yet               │
│ Create your first link to start     │
│ receiving payments.                 │
└─────────────────────────────────────┘
```

- 文案："No payment links yet"
- 描述："Create your first link to start receiving payments."（text-sm, text-neutral-600）
- 按钮："Create payment link"（Primary style，居中或左对齐）

### 4.5 页面底部操作（可选）
**位置**：页面底部，固定或随内容滚动

**操作按钮**：
- "← Back to Products"：返回Products列表页（Secondary button或text按钮）
- "Create another link"：创建新的PaymentLink（Primary button）

**面包屑导航**（可选）：
- 位置：页面顶部，Header上方
- 格式："Products / Weekly Business Report"
- 点击"Products"返回列表页

---

## 5. 状态、反馈与错误处理

### 5.1 Loading 与空状态

#### Loading状态
**定价建议请求过程中**：
- Pricing Assistant卡片展示loading状态：
  - 保留卡片框架，避免布局跳变
  - 显示spinner动画（居中，size: md）
  - 文案："Thinking about your price…"（text-sm, text-neutral-600）
  - 次要文案："This usually takes 3-5 seconds."（text-xs, text-neutral-500）
- 超时处理（> 10秒）：
  - 更新文案为"Taking longer than expected…"
  - 提供"Cancel"按钮（text-xs, text-neutral-500）

**Payment Link生成过程中**：
- "Generate payment link"按钮进入loading状态：
  - 显示spinner动画（size: sm）
  - 文案变为"Generating link…"或保持不变
  - 按钮disabled，防止重复点击
- 如果超过2秒，在按钮下方显示loading提示（可选）

#### 空状态
**Products列表页空状态**：
- 触发条件：商户没有任何商品
- 视觉元素：
  - 简单图标或插画（可选）
  - 标题："Create your first product"（text-lg, font-semibold, text-neutral-900）
  - 描述："Products are what you sell. Create a product to start receiving payments."（text-sm, text-neutral-600）
  - 主按钮："Add a Product"（Primary button）
- 布局：居中对齐，使用max-w-md容器

**Pricing Assistant空状态**（详见3.2.3节）：
- 默认展开但处于空状态
- 引导文案："Not sure what to charge? Let our AI help you set the right price."
- 主CTA："Get pricing suggestion"（必填字段未完成时disabled）

**Product Detail页Pricing Summary空状态**（详见4.3节）：
- 触发条件：没有任何定价建议
- 文案："No pricing recommendations yet"
- 描述："Get personalized pricing suggestions for your product."
- 按钮："Get pricing suggestion"（Secondary style）

**Payment Links空状态**（详见4.4节）：
- 触发条件：Product没有任何PaymentLink
- 文案："No payment links yet"
- 描述："Create your first link to start receiving payments."
- 按钮："Create payment link"（Primary style）

### 5.2 表单校验

#### 必填字段校验
- **校验时机**：
  - 用户离开字段时（onBlur）：显示字段级别的错误提示
  - 用户点击"Next"或"Generate payment link"时：显示所有错误汇总

- **错误提示样式**：
  - 位置：字段下方，红色文字
  - 样式：text-xs, text-red-600
  - 图标：左侧可选显示warning-icon（小尺寸）
  - 动画：从上方淡入（fade-in）

- **必填字段列表**（Step 1）：
  1. Product name
  2. Revenue model选择（必须选择一个）
  3. 价格配置字段（按选择的模型）：
     - One-time: Price Amount
     - Subscription: Amount + Billing Period
     - Usage-based: Unit Name + Unit Price

- **错误文案示例**：
  - Product name为空："Product name is required"
  - Revenue Model未选择："Please select a revenue model"
  - Price Amount为空或无效："Please enter a valid price (0.01 - 1,000,000)"
  - Price Amount超出范围："Price must be between $0.01 and $1,000,000"

- **格式校验**：
  - Product Name: 1-255字符，超限时显示"Product name must be 255 characters or less"
  - Deliverable Description: 最多500字符，超限时显示"Description must be 500 characters or less"
  - Use case category: 1-200字符，超限时显示"Use case must be 200 characters or less"
  - Unit Name: 1-50字符，超限时显示"Unit name must be 50 characters or less"
  - 价格字段：最多2位小数，超限时显示"Price can have at most 2 decimal places"

- **字段级别的实时校验**：
  - 用户输入时实时校验格式（如数字、字符限制）
  - 显示简短提示（text-neutral-500）
  - 不显示红色错误，除非用户离开字段或提交表单

#### Step切换校验
- **阻止前进的条件**：
  - 任何必填字段为空
  - 任何字段格式不正确
  - 价格超出允许范围

- **错误汇总提示**：
  - 位置：页面顶部，sticky banner
  - 样式：bg-red-50, border-red-200, text-red-800
  - 图标：左侧显示warning-icon
  - 文案："Please fix X error(s) before continuing"
  - 动画：从顶部滑入（slide-down）
  - 自动消失：用户修正所有错误后自动隐藏

- **滚动到错误字段**：
  - 当用户点击"Next"但有错误时，自动滚动到第一个错误字段
  - 错误字段短暂高亮（红色边框或背景）
  - 持续时间：500ms - 1s

### 5.3 多次请求定价建议（Out of Date状态）

**触发条件**（用户决策：仅Pricing inputs字段变更）：
- 用户已获取过至少一次定价建议
- 之后修改了以下任一字段：
  - Target customer type
  - Use case category
  - Cost相关字段：
    - Use my actual costs开关
    - Manual cost输入值
  - Value type选项

**不触发Out of date**：
- 修改Product Name或Description（左侧基础字段）
- 切换Revenue Model（这种情况下直接清空建议，而不是显示Out of date）
- 修改Price Amount（左侧价格字段）

**视觉表现**：
- 在Pricing Assistant卡片顶部显示"Out of date"badge
  - 样式：inline-block, px-2 py-0.5, rounded, bg-orange-50, text-orange-700
  - 位置：组件标题右侧或下方
- 主CTA从"Get pricing suggestion"变为"Regenerate suggestion"
  - 样式升级为primary button（更明显的视觉权重）
- 之前的建议结果：
  - 保留显示，但使用opacity: 0.6或0.7
  - Apply按钮disabled，无法点击
- 提示文案：
  - "You've updated your inputs. Generate a new suggestion for updated pricing."
  - 或"Your inputs have changed. Regenerate to see updated recommendations."

**交互流程**：
1. 用户修改Pricing inputs字段
2. Pricing Assistant立即显示"Out of date"badge（无需等待用户离开字段）
3. 主CTA变为"Regenerate suggestion"（primary style）
4. 用户点击"Regenerate suggestion"
5. 重新请求LLM，返回"加载中"状态
6. 成功后显示新建议，"Out of date"badge消失

### 5.4 草稿自动保存反馈

**触发时机**：
- 用户在Step 1填写或修改任何字段时
- 自动保存到后端，频率控制（例如每5秒最多保存一次）

**视觉反馈**：
- **位置**：页面底部左侧，固定定位或随内容滚动
- **样式**：
  - 文字："Draft saved at 2:35 PM"
  - 字号：text-xs
  - 颜色：text-neutral-500
  - 背景：无背景或透明背景
  - Padding：p-2或p-3
- **时间格式**：
  - 12小时制，例如"2:35 PM"或"11:45 AM"
  - 不显示秒数
- **更新机制**：
  - 每次自动保存成功后更新时间戳
  - 使用节流（throttle）机制，避免频繁更新DOM
  - 例如：最多每5秒更新一次时间戳

**初始状态**：
- 首次进入Step 1时，不显示"Draft saved"提示
- 用户开始填写字段后，首次保存时显示提示
- 淡入动画（fade-in），duration-200

**保存失败处理**：
- 如果自动保存失败：
  - 更新文字为"Failed to save draft"
  - 颜色变为text-red-500
  - 提供"Retry"链接（text-xs, text-red-600，下划线）
  - 点击后重新尝试保存
- 如果连续失败3次：
  - 显示warning提示："Your changes may not be saved. Please copy your work before leaving."
  - 使用toast或banner形式，更明显

**手动保存说明**：
- 不需要提供"Save draft"按钮
- 自动保存机制保证用户数据不会丢失
- 在页面顶部或向导步骤提示中说明："Your work is saved automatically as you go"

### 5.5 错误处理与降级策略

#### 定价建议请求失败
**详见智能定价助手章节（3.2.3节，状态6）**，关键要点：
- 显示错误提示框（bg-orange-50或bg-red-50）
- 提供"Try again"和"Dismiss"按钮
- **不阻塞流程**：用户仍可手动填写价格并继续
- 保留已填写的所有字段
- 在错误提示下方引导用户手动定价："You can still set your price manually in the form on the left."

#### Payment Link生成失败
**详见Step 2章节（3.2.4节，第8小节）**，关键要点：
- 显示错误提示（bg-red-50）
- 提供"Try again"和"Go back"按钮
- 不清除已填写的数据
- 提供清晰的错误原因和解决方案

#### 网络错误处理
**场景**：用户网络连接中断或超时
- **检测机制**：
  - API请求超时（> 10秒）
  - 网络错误（fetch failed）
  - 服务端错误（5xx status codes）

- **全局错误提示**：
  - 位置：页面顶部，sticky banner
  - 样式：bg-red-50, border-red-200, text-red-800
  - 图标：左侧显示error-icon
  - 文案："Network error. Please check your connection and try again."
  - 按钮："Dismiss"或"Retry"
  - 自动消失：不自动消失，等待用户操作

- **局部错误提示**：
  - 如果是特定组件（如Pricing Assistant）的错误，显示在组件内部
  - 使用组件级别的错误提示框
  - 不影响页面其他部分

#### 服务端错误处理
**场景**：后端返回错误响应（4xx或5xx）
- **400 Bad Request**：
  - 提示："Invalid request. Please check your inputs and try again."
  - 高亮显示无效字段
- **401 Unauthorized**：
  - 提示："You've been logged out. Please sign in again."
  - 提供"Sign in"按钮，跳转到登录页
- **403 Forbidden**：
  - 提示："You don't have permission to perform this action."
  - 提供联系支持的链接
- **404 Not Found**：
  - 提示："The requested resource was not found."
  - 提供"Go back"按钮
- **500 Internal Server Error**：
  - 提示："Something went wrong on our end. Please try again later."
  - 提供"Retry"按钮和"Contact support"链接
- **503 Service Unavailable**：
  - 提示："Service temporarily unavailable. Please try again in a few minutes."
  - 不提供重试按钮，建议用户稍后再试

#### 降级策略总结
1. **不阻塞主流程**：即使辅助功能失败，用户仍可完成核心任务
2. **保留用户数据**：错误状态下不清除已填写的数据
3. **提供明确指引**：告知用户发生了什么以及如何解决
4. **友好的错误文案**：避免技术术语，使用用户友好的语言
5. **提供重试机制**：大多数错误情况下提供"Try again"按钮

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
**目标受众**：AI Agent开发者、小团队创始人、API/开发者平台运营者

**语气原则**：
- **专业但不金融化**：避免过度专业的金融术语，使用开发者友好的语言
- **解释性而非指令性**：帮助用户理解"为什么"，而不仅仅是"怎么做"
- **诚实透明**：不承诺收益，避免"保证"、"必能"等绝对性用语
- **鼓励性**：在定价等不确定性高的场景下，提供正向引导
- **简洁清晰**：句子简短，避免冗长复杂的句子结构

**语气示例对比**：

❌ **避免的语气**：
- "This pricing strategy will maximize your revenue."（过度承诺）
- "You must set your price above $X to be profitable."（过于指令性）
- "Our AI guarantees optimal pricing."（绝对化用语）

✅ **推荐的语气**：
- "Based on similar products, this price range may work well for your target customers."
- "Consider your costs when setting your price. This helps ensure sustainable pricing."
- "Our AI provides personalized suggestions based on market data and your inputs."

### 7.2 关键文案规范

#### Products列表页

**空状态**：
- **标题**："Create your first product"
- **描述**："Products are what you sell. Create a product to start receiving payments."
- **按钮**："Add a Product"

**筛选标签**：
- All / Draft / Published / Archived

**表头**：
- Product / Revenue Model / Default Price / Status / Last 7d Payments

#### 创建商品向导（Wizard）

**Step 1标题**：
- "Add a Product" 或 "Create a new product"

**Stepper**：
- "Step 1 of 2: Product details" / "Step 2 of 2: Generate payment link"

**基础信息字段**：
- Product name:
  - Label: "Product name"
  - Placeholder: "E.g., Weekly Business Report"
  - 说明: "Give your product a clear, descriptive name"
- Deliverable Description:
  - Label: "What does your product deliver?"
  - Placeholder: "E.g., A weekly report summarizing your key business metrics and insights"
  - 说明: "Optional: Help your customers understand what they'll receive"

**Revenue Model选择**：
- One-time:
  - Title: "One-time payment"
  - Description: "Charge once for a single delivery or service"
  - Example: "Perfect for: One-off reports, consultations, single-use tools"
- Subscription:
  - Title: "Subscription"
  - Description: "Recurring payments for ongoing access or service"
  - Example: "Perfect for: Weekly reports, monthly analytics, ongoing support"
- Usage-based:
  - Title: "Usage-based"
  - Description: "Charge based on how much your customers use"
  - Example: "Perfect for: API calls, token consumption, per-run executions"

**价格配置字段**：
- One-time:
  - Label: "Price"
  - 说明: "USD"
- Subscription:
  - Label: "Price per period"
  - Billing Period选项: "Monthly" / "Yearly"
  - 说明: "USD"
- Usage-based:
  - Unit Name:
    - Label: "Unit name"
    - Placeholder: "E.g., API call, 1K tokens, run"
    - 说明: "Customers will be charged per unit"
  - Unit Price:
    - Label: "Price per unit"
    - 说明: "USD"

**自动保存提示**：
- "Draft saved at 2:35 PM"
- 失败时: "Failed to save draft"

**Step 2标题**：
- "Review and generate link" 或 "Almost done!"

**产品摘要**：
- 卡片标题: "Product Summary"
- Label文案: "Product name" / "Revenue model" / "Price"

**生成按钮**：
- 文案: "Generate payment link"
- 说明文字: "Your product will be published automatically if it's still a draft."

**成功反馈**：
- 标题: "Your product is live!" 或 "Payment link ready!"
- 引导文案: "Share this link to start receiving payments."
- Toast文案: "Payment link created successfully!"

**链接展示**：
- Copy按钮: "Copy link"
  - 点击后: "Copied!" 或 "Link copied!"
- Test按钮: "Test link" 或 "Open in new tab"

**"What's next"引导**：
- 标题: "What's next?"
- 步骤:
  1. "Copy the link and share it with your customers"
  2. "Test the link yourself"
  3. "View payments in Dashboard"
- 按钮: "Go to Dashboard"

**错误处理**：
- 生成链接失败:
  - 标题: "Unable to generate payment link"
  - 描述: "Something went wrong. Please try again."
  - 按钮: "Try again" / "Go back"
- 信息不完整:
  - 标题: "Incomplete product information"
  - 描述: "Please fill in all required fields before generating a link."
  - 按钮: "Go back to Step 1"
- 服务不可用:
  - 标题: "Payment service unavailable"
  - 描述: "We're unable to generate payment links right now. Please try again later."
  - 按钮: "Retry" / "Contact support"

#### 智能定价助手（Pricing Assistant）

**组件标题**：
- "Pricing Assistant" 或 "Need pricing help?"

**空状态引导**：
- 标题: "Not sure what to charge?"
- 描述: "Let our AI help you set the right price."
- 按钮: "Get pricing suggestion"（必填字段未完成时disabled）
- 可选提示: "Answer 2 quick questions to get personalized recommendations"

**分组标题**：
- "Tell us about your business"

**基础字段**：
- Target customer type:
  - Label: "Target customer type *"
  - 说明: "This helps us understand your pricing strategy"
  - 选项:
    - "Individual/Small team"
    - "Small Business (10-50 people)"
    - "Growth Enterprise (50+ people)"
- Use case category:
  - Label: "Use case category *"
  - Placeholder: "E.g., Weekly business analytics"
  - 说明: "Briefly describe what your product does"

**高级选项**：
- 按钮: "Advanced options"（默认）/ "Advanced options ▼"（展开后）
- Cost information子标题: "Cost information (optional)"
- Use my actual costs:
  - Label: "Use my actual costs"
  - 说明: "We'll use your workflow cost data to calculate profitable pricing"
- Trace成本展示:
  - "Average cost: $0.52 per delivery"
  - "Based on: 47 traces"
  - "Period: Last 30 days"
- 无数据时:
  - 标题: "No cost data yet"
  - 描述: "We don't have your workflow cost data. Tell us your estimated cost per delivery to get better recommendations."
- Manual cost input:
  - Label: "Or enter manual estimate"
  - 说明: "Estimated cost per delivery"
  - Placeholder: "$0.00"
  - 帮助文字: "Help us calculate pricing that covers your costs"
- Value type:
  - Label: "Value type (optional)"
  - 说明: "Select all that apply"
  - 选项: "Save time" / "Increase revenue" / "Reduce cost" / "Other"

**加载状态**：
- 文案: "Thinking about your price…"
- 次要文案: "This usually takes 3-5 seconds."
- 超时时: "Taking longer than expected…"

**成功状态**：
- 标题: "Pricing suggestion ready" 或 "Your personalized pricing"
- 置信度Badge: "High confidence" / "Medium confidence" / "Low confidence"
- 分组标题: "Recommended price range"
- Apply按钮: "Apply Min" / "Apply Typical" / "Apply Max"
- Assumptions标题: "Assumptions" 或 "See details"
- 重新生成按钮: "Regenerate suggestion"

**错误状态**：
- 标题: "Unable to generate suggestion"
- 描述: "Something went wrong. Please try again or set your price manually."
- 按钮: "Try again" / "Dismiss"
- 手动定价引导: "You can still set your price manually in the form on the left."

**无成本数据时**（在Assumptions中）：
- "No cost data provided"
- "Recommendations based on market benchmarks only"

**Out of date状态**：
- Badge: "Out of date" 或 "Inputs changed"
- 提示文案: "You've updated your inputs. Generate a new suggestion for updated pricing."
- 或: "Your inputs have changed. Regenerate to see updated recommendations."
- 主CTA: "Regenerate suggestion"

#### Product Detail页面

**页面Header**：
- 按钮: "Create payment link"
- 辅助菜单: "Edit product" / "Archive"

**Overview区域**：
- 区域标题: "Overview"
- Label: "Product name" / "Description" / "Revenue model" / "Price" / "Status" / "Last updated" / "Last 7 days"
- 编辑按钮: "Edit product"
- 空Description: "-" 或 "No description provided"
- 空支付数据: "No payments yet"

**Pricing Summary区域**：
- 区域标题: "Pricing Summary"
- Label: "Current price" / "Latest pricing recommendation"
- 日期格式: "Jan 13, 2026"
- 价格区间格式: "Min $79 - Typical $99 - Max $149"
- Applied状态: "Applied: Typical" / "Not applied"
- Applied时间: "Applied on Jan 13, 2026 at 2:35 PM"
- 手动修改提示: "Modified after applying" 或 "Price manually adjusted from $99 to $109"
- 查看历史链接: "View full recommendation history"
- 空状态:
  - 标题: "No pricing recommendations yet"
  - 描述: "Get personalized pricing suggestions for your product."
  - 按钮: "Get pricing suggestion"

**Links区域**：
- 区域标题: "Payment Links"
- 创建按钮: "Create payment link"
- Label: "URL" / "Status" / "Last 7 days"
- 表现数据格式: "X clicks, Y payments" 或 "$X in revenue"
- 操作按钮: "Copy" / "Test" / "Disable" / "Enable"
- 空状态:
  - 标题: "No payment links yet"
  - 描述: "Create your first link to start receiving payments."
  - 按钮: "Create payment link"

**页面底部**：
- 返回按钮: "← Back to Products"
- 创建链接按钮: "Create another link"

#### 状态与反馈

**Loading文案**：
- Pricing Assistant: "Thinking about your price…"
- Payment Link生成: "Generating link…"

**空状态文案**：
- Products列表: "Create your first product" / "Products are what you sell. Create a product to start receiving payments."
- Pricing Assistant: "Not sure what to charge? Let our AI help you set the right price."
- Pricing Summary: "No pricing recommendations yet" / "Get personalized pricing suggestions for your product."
- Payment Links: "No payment links yet" / "Create your first link to start receiving payments."

**错误文案**：
- 表单校验:
  - "Product name is required"
  - "Please select a revenue model"
  - "Please enter a valid price (0.01 - 1,000,000)"
  - "Price must be between $0.01 and $1,000,000"
  - "Product name must be 255 characters or less"
  - "Description must be 500 characters or less"
  - "Use case must be 200 characters or less"
  - "Unit name must be 50 characters or less"
  - "Price can have at most 2 decimal places"
- 错误汇总: "Please fix X error(s) before continuing"
- 草稿保存失败: "Failed to save draft"
- 网络错误: "Network error. Please check your connection and try again."
- 服务端错误:
  - "Invalid request. Please check your inputs and try again."
  - "You've been logged out. Please sign in again."
  - "You don't have permission to perform this action."
  - "The requested resource was not found."
  - "Something went wrong on our end. Please try again later."
  - "Service temporarily unavailable. Please try again in a few minutes."

**引导提示**：
- 自动保存说明: "Your work is saved automatically as you go"
- 严重保存失败: "Your changes may not be saved. Please copy your work before leaving."

### 7.3 文案一致性检查清单

**必须与PRD一致的文案**：
- ✅ "Not sure what to charge? Let our AI help you set the right price."（Pricing Assistant空状态）
- ✅ "Unable to generate suggestion. Please try again or set your price manually."（失败提示）
- ✅ "Your product is live!"（成功标题）
- ✅ "Share this link to start receiving payments."（引导文案）
- ✅ Revenue Model的三个选项和描述
- ✅ Target customer type的三个选项
- ✅ 所有Placeholder示例

**币种显示**：
- 所有价格相关字段必须显示"USD"或"$"前缀
- 不要求用户选择币种（一期固定USD）

**时间格式**：
- 统一使用12小时制："Jan 13, 2026 at 2:35 PM"
- 不显示秒数
- 相对时间："Last 7 days"、"Last 30 days"

**数字格式**：
- 价格使用小数点，最多2位：$99.99
- 数字使用千位分隔符：1,000
- 不使用货币符号以外的其他符号

**大小写规范**：
- 句子首字母大写
- 专有名词大写：Pricing Assistant、Product、Revenue Model
- Label使用Title Case：Product Name、Revenue Model
- 按钮文案使用Title Case：Add a Product、Generate Payment Link
- 描述文字使用sentence case：This helps us understand your pricing strategy

### 7.4 避免使用的文案

**过度承诺**：
- ❌ "Guaranteed revenue"
- ❌ "Maximize your profits"
- ❌ "Optimal pricing"
- ❌ "Best price for your product"

**绝对化用语**：
- ❌ "Must set price above $X"
- ❌ "Always use this strategy"
- ❌ "Never price below cost"

**技术术语**：
- ❌ "Unit economics optimization"
- ❌ "Price elasticity modeling"
- ❌ "Marginal cost analysis"（除非在Assumptions中详细解释）

**含糊不清**：
- ❌ "Some users"
- ❌ "A while ago"
- ❌ "Several options"

**替代为明确文案**：
- ✅ "Individual/Small team"（而非"Some users"）
- ✅ "Last 7 days"（而非"A while ago"）
- ✅ 具体的选项列表（而非"Several options"）

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
