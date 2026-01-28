# Onboarding 登录与邀请码系统 - 设计需求文档 (DRD)

| 文档信息 | 详情 |
| :--- | :--- |
| **项目** | Anyway - AI 商业化基础设施 |
| **模块** | 用户引导与访问控制 (Onboarding & Access Control) |
| **版本** | v1.0 (MVP) |
| **状态** | 草案 (Draft) |
| **设计师** | UI/UX Designer |
| **更新日期** | 2025-01-19 |

---

## 变更历史 (Changelog)

| 版本 | 日期 | 变更内容 | 设计师 |
| :--- | :--- | :--- | :--- |
| v1.0 | 2025-01-19 | 初始版本，定义 MVP 内测阶段登录与邀请码系统的完整设计规范 | UI/UX Designer |

---

## 目录 (Table of Contents)

1. [设计原则与背景](#1-设计原则与背景)
2. [用户体验旅程](#2-用户体验旅程)
3. [页面设计规范](#3-页面设计规范)
4. [组件设计规范](#4-组件设计规范)
5. [视觉设计规范](#5-视觉设计规范)
6. [交互设计规范](#6-交互设计规范)
7. [响应式设计](#7-响应式设计)
8. [边界情况处理](#8-边界情况处理)
9. [可访问性规范](#9-可访问性规范)
10. [设计交付物](#10-设计交付物)

---

## 1. 设计原则与背景

### 1.1 设计哲学

Anyway 的设计服务于 **AI Agent 开发者** 和 **AI 初创公司创始人**。我们的美学核心是 **"Engineering Precision" (工程精准)**。

#### 核心设计原则

**功能至上 (Function First)**
- 每一个像素都应服务于信息的传达
- 去除不必要的装饰，让数据和操作成为主角
- 登录页面应聚焦于核心任务：邮箱验证 → 身份确认 → 进入产品

**高信噪比 (High Signal-to-Noise)**
- 界面保持克制与冷静，避免过度干扰
- 确保用户能迅速聚焦于邮箱输入、邀请码输入等关键操作
- 使用清晰的视觉层次引导用户视线

**确定性 (Determinism)**
- 交互反馈应当即时、明确且可预测
- 每个操作状态都应有明确的视觉反馈
- 错误提示应清晰、具体、可操作

### 1.2 目标用户

| 用户类型 | 特征 | 设计考量 |
| :--- | :--- | :--- |
| **个人开发者/独立开发者** | 对价格敏感，需要快速上手，技术背景强 | • 简洁直观的表单<br>• 清晰的操作指引<br>• 快速的验证流程 |
| **早期 AI 创业公司** | 有明确的商业化需求，注重效率，团队协作 | • 专业的界面呈现<br>• 明确的价值传达<br>• 高效的审核流程 |

### 1.3 品牌调性

**关键词：**
- **精准 (Precision)**：工程化的精确感
- **克制 (Restraint)**：不炫耀、不花哨
- **高效 (Efficiency)**：快速、直接、无阻碍
- **专业 (Professional)**：值得信赖的商业化基础设施

**视觉氛围：**
- 简洁现代，但不失温度
- 技术感强，但不过度极客
- 商业化定位，但保持开发友好

---

## 2. 用户体验旅程

### 2.1 旅程 A：有邀请码的用户（直接注册）

**流程图：**

```
首页 anyway.sh
    ↓
点击 "Get Started" 按钮
    ↓
登录页面
    ↓
输入邮箱地址
    ↓
点击 "Continue"
    ↓
选择 "I have an invitation code"
    ↓
输入 5 位数字邀请码
    ↓
点击 "Submit"
    ↓
收到 Magic Link 邮件
    ↓
点击邮件中的链接
    ↓
验证成功，进入 Dashboard
```

**设计要点：**
- 每个步骤都有清晰的视觉反馈
- 进度可感知（可通过步骤指示器或面包屑）
- 错误阻断但友好，提供解决方案
- 成功状态明确，引导下一步操作

### 2.2 旅程 B：无邀请码的用户（申请访问）

**流程图：**

```
首页 anyway.sh
    ↓
点击 "Get Started" 按钮
    ↓
登录页面
    ↓
输入邮箱地址
    ↓
点击 "Continue"
    ↓
选择 "Request Access"
    ↓
填写申请表单
    ↓
点击 "Submit Request"
    ↓
收到申请确认提示
    ↓
等待运营审核
    ↓
收到邀请码邮件
    ↓
回到旅程 A 的步骤 6
```

**设计要点：**
- 申请表单简洁，只收集必要信息
- 提交后明确告知下一步（审核时间、联系方式）
- 保持期待感，传达"我们会尽快回复"的态度

---

## 3. 页面设计规范

### 3.1 首页入口设计

#### 3.1.1 导航栏按钮

**位置：** 首页右上角导航栏

**文案：** "Get Started"（替代原有的 "Request Demo"）

**样式：** Primary Button
- **背景色：** Accent Black（`#1A1A1A` 或更深的黑色）
- **文字色：** White / Off-white（`#FFFFFF` 或 `#FAFAFA`）
- **圆角：** 4px - 6px（传递稳重与精确感）
- **内边距：** 12px 24px（垂直 12px，水平 24px）
- **字号：** 14px（Body Regular）
- **字重：** 500 或 600（Medium 或 Semi-bold）
- **字间距：** 0.02em（略微增加字母间距，提升精致感）

**交互状态：**
- **Default:**
  - 背景：`#1A1A1A`
  - 文字：`#FFFFFF`
  - 阴影：None
  - 过渡：All 150ms ease-out

- **Hover:**
  - 背景：`#2A2A2A` 或 `#333333`（轻微变亮）
  - 文字：`#FFFFFF`
  - 阴影：`0 2px 8px rgba(0, 0, 0, 0.15)`
  - 光标：Pointer
  - 过渡：All 150ms ease-out

- **Active:**
  - 背景：`#0A0A0A`（轻微变暗）
  - 文字：`#FFFFFF`
  - 位移：`translateY(1px)`（轻微下沉）
  - 过渡：All 100ms ease-out

- **Focus (键盘导航):**
  - 背景：`#1A1A1A`
  - 文字：`#FFFFFF`
  - 边框：`2px solid Anyway Yellow`（品牌色）
  - 边框偏移：-2px（内边框）
  - 过渡：All 150ms ease-out

- **Disabled:**
  - 背景：`#E5E5E5` 或 `#D1D1D1`
  - 文字：`#A0A0A0`
  - 光标：Not-allowed
  - 过渡：None

**尺寸规范：**
- **高度：** 40px - 44px（符合触控目标最小尺寸）
- **最小宽度：** 120px（确保文字不被压缩）

**与其他导航元素的对齐：**
- 垂直居中于导航栏
- 与其他导航项（如 "Product", "Pricing", "Docs"）保持一致的垂直对齐
- 右侧留有适当边距（通常 24px - 32px）

---

### 3.2 登录/注册页面设计

#### 3.2.1 页面布局结构

**整体布局：**
- **布局模式：** 居中式单栏布局（Centered Single Column）
- **最大宽度：** 440px - 480px
- **内边距：** 40px（左右各 40px）
- **外边距：** 0 auto（水平居中）

**垂直间距系统（8px Grid）：**
- 页面标题与副标题之间：16px（2 × 8px）
- 副标题与第一个输入框之间：24px（3 × 8px）
- 输入框之间：16px（2 × 8px）
- 输入框与按钮之间：24px（3 × 8px）
- 按钮与底部说明之间：32px（4 × 8px）

#### 3.2.2 页面元素设计

**1. 页面标题 (Page Title)**

**文案：** "Get Started with Anyway"

**样式：**
- **字体：** Inter, San Francisco, Segoe UI（系统默认无衬线字体）
- **字号：** 28px - 32px（Heading 1）
- **字重：** 600 或 700（Semi-bold 或 Bold）
- **行高：** 1.2（1.2 倍字号）
- **颜色：** Text Primary（`#1A1A1A` 或接近纯黑）
- **对齐：** Left（左对齐）
- **边距：** 0（与页面布局容器对齐）

**位置：** 页面顶部，第一个元素

**2. 页面副标题 (Page Subtitle)**

**文案：** "Manage API costs, billing, and payments in one place"

**样式：**
- **字体：** Inter, San Francisco, Segoe UI（系统默认无衬线字体）
- **字号：** 14px - 16px（Body Regular）
- **字重：** 400 或 500（Regular 或 Medium）
- **行高：** 1.5（1.5 倍字号）
- **颜色：** Text Secondary（`#666666` 或深灰）
- **对齐：** Left（左对齐）

**位置：** 标题下方 16px 处

**3. 邮箱输入框 (Email Input Field)**

**组件结构：**
```
┌────────────────────────────────────┐
│ Label (optional)                   │
│ ┌────────────────────────────────┐ │
│ │ Placeholder text               │ │
│ └────────────────────────────────┘ │
│ Helper text / Error message        │
└────────────────────────────────────┘
```

**Label 文案：** 可选（如果使用，文案为 "Email address"）

**Placeholder 文案：** "Enter your email"

**样式 - 容器：**
- **宽度：** 100%（填满父容器）
- **高度：** 44px - 48px
- **边框：** 1px solid Border Color
  - Default: `#D1D1D1` 或 `#E0E0E0`
  - Focus: Anyway Yellow（品牌色）
  - Error: Error Red（`#DC2626` 或类似）
- **圆角：** 4px - 6px
- **背景色：** Surface（`#FFFFFF` 或纯白）
- **内边距：** 12px 16px（垂直 12px，水平 16px）

**样式 - 输入文字：**
- **字体：** Inter, San Francisco, Segoe UI
- **字号：** 14px - 16px（Body Regular）
- **字重：** 400（Regular）
- **颜色：** Text Primary（`#1A1A1A`）
- **占位符颜色：** Text Tertiary（`#A0A0A0` 或浅灰）

**交互状态：**
- **Default:**
  - 边框：`#E0E0E0`
  - 背景：`#FFFFFF`
  - 阴影：None

- **Focus:**
  - 边框：Anyway Yellow（2px - 3px）
  - 边框偏移：-1px 或 -2px（内边框）
  - 背景：`#FFFFFF`
  - 阴影：`0 0 0 3px rgba(Anyway Yellow, 0.1)`（外发光）
  - 过渡：All 150ms ease-out

- **Error:**
  - 边框：Error Red（`#DC2626`）
  - 背景：`#FEF2F2`（极浅红背景）
  - 错误提示文字：Error Red
  - 图标：✕ 或 ⚠️（可选，右侧显示）

- **Success:**
  - 边框：Success Green（`#16A34A`）
  - 背景：`#F0FDF4`（极浅绿背景）
  - 图标：✓（可选，右侧显示）

**实时验证：**
- **触发时机：** 用户输入完成后（Blur 事件）或输入中（Input 事件 + 延迟 500ms）
- **验证规则：**
  - 必填（不能为空）
  - 邮箱格式（正则表达式：`^[^\s@]+@[^\s@]+\.[^\s@]+$`）
- **错误提示文案：** "Please enter a valid email address"

**4. "Continue" 按钮**

**样式：** Primary Button（参见 3.1.1 节）

**文案：** "Continue"

**位置：** 邮箱输入框下方 24px 处，全宽

**尺寸：**
- **宽度：** 100%（填满父容器）
- **高度：** 44px - 48px

**加载状态：**
- **按钮文案：** "Sending..." 或显示 Spinner
- **按钮状态：** Disabled（禁用）
- **Spinner 样式：**
  - 颜色：White（`#FFFFFF`）
  - 尺寸：16px × 16px
  - 位置：按钮中心，替换文字或显示在文字左侧
  - 动画：旋转动画（360°，无限循环，1s 一圈）

**5. 两个选项卡片**

**显示时机：** 用户点击 "Continue" 并验证邮箱后，延迟 1-2 秒显示（模拟服务器响应）

**布局：** 垂直堆叠，两个卡片之间间距 16px

**卡片 A："I have an invitation code"**

**文案：**
- **标题：** "I have an invitation code"
- **描述（可选）：** "Enter your 5-digit code to get started"

**样式 - 容器：**
- **宽度：** 100%
- **最小高度：** 64px - 72px
- **边框：** 1px solid `#E0E0E0`
- **圆角：** 6px - 8px
- **背景色：** `#FFFFFF`
- **内边距：** 16px
- **阴影：** `0 1px 3px rgba(0, 0, 0, 0.05)`
- **光标：** Pointer

**样式 - 文字：**
- **标题：**
  - 字号：14px - 16px（Body Regular）
  - 字重：500 或 600（Medium 或 Semi-bold）
  - 颜色：Text Primary（`#1A1A1A`）

- **描述（如果有）：**
  - 字号：12px - 13px（Body Small）
  - 字重：400（Regular）
  - 颜色：Text Secondary（`#666666`）
  - 边距：标题下方 4px 处

**交互状态：**
- **Default:**
  - 边框：`#E0E0E0`
  - 背景：`#FFFFFF`
  - 阴影：`0 1px 3px rgba(0, 0, 0, 0.05)`

- **Hover:**
  - 边框：Anyway Yellow 或 `#D1D1D1`
  - 背景：`#FAFAFA`（极浅灰）
  - 阴影：`0 2px 6px rgba(0, 0, 0, 0.1)`
  - 过渡：All 150ms ease-out

- **Selected:**
  - 边框：Anyway Yellow（2px - 3px）
  - 背景：`#FEFCE8` 或 `#FFF9E6`（极浅黄背景）
  - 阴影：`0 0 0 3px rgba(Anyway Yellow, 0.1)`
  - 选中指示器：左侧或右侧显示 Anyway Yellow 竖条（可选）

- **Focus (键盘导航):**
  - 边框：Anyway Yellow（2px - 3px）
  - 阴影：`0 0 0 3px rgba(Anyway Yellow, 0.1)`

**卡片 B："Request Access"**

**样式：** 与卡片 A 相同

**文案：**
- **标题：** "Request Access"
- **描述（可选）：** "Apply for early access to Anyway"

**6. 邀请码输入框**

**显示时机：** 用户选择 "I have an invitation code" 后，从卡片下方滑入或淡入

**组件结构：** 类似邮箱输入框，但有以下特殊要求

**Label 文案：** "Invitation code"

**Placeholder 文案：** "Enter 5-digit code"

**输入限制：**
- **字符类型：** 仅数字（0-9）
- **最大长度：** 5 个字符
- **自动格式化：**
  - 用户输入时自动添加分隔符（可选）
  - 示例：`12345` 或 `12 345`（每 2 或 3 位加空格）
  - 如果使用分隔符，提交前自动移除

**样式：** 基础样式与邮箱输入框相同

**特殊交互：**
- **自动聚焦：** 显示后自动聚焦到输入框
- **自动选中：** 全选输入框内容，方便用户直接输入
- **输入验证：**
  - 实时验证：必须是 5 位数字
  - 错误提示："Invalid invitation code. Please contact support."
  - **重要：** 不区分具体错误原因（已使用、不存在、过期等），统一返回此提示

**7. "Submit" 按钮**

**样式：** Primary Button（参见 3.1.1 节）

**文案：** "Submit"

**位置：** 邀请码输入框下方 24px 处，全宽

**8. "Request Access" 表单**

**显示时机：** 用户选择 "Request Access" 后，从卡片下方滑入或淡入

**表单字段：**

**a. Full Name（姓名）- 必填**

**Label 文案：** "Full Name"

**Placeholder 文案：** "Enter your full name"

**样式：** 标准文本输入框（与邮箱输入框样式相同）

**验证规则：**
- 必填（不能为空）
- 最小长度：2 个字符
- 最大长度：100 个字符
- 仅允许字母、空格、连字符、撇号

**错误提示：** "Please enter your full name"

**b. Email（邮箱）- 必填，预填**

**Label 文案：** "Email Address"

**Placeholder 文案：** "Enter your email"

**特殊处理：**
- **预填值：** 自动填入用户在步骤 1 输入的邮箱
- **可编辑：** 允许用户修改
- **样式：** 与邮箱输入框相同

**验证规则：** 与步骤 1 邮箱验证相同

**c. Company Name（公司名称）- 必填**

**Label 文案：** "Company Name"

**Placeholder 文案：** "Enter your company name"

**样式：** 标准文本输入框

**验证规则：**
- 必填（不能为空）
- 最小长度：2 个字符
- 最大长度：255 个字符

**错误提示：** "Please enter your company name"

**d. Use Case（使用场景）- 必填，文本框**

**Label 文案：** "Use Case"

**Placeholder 文案：** "Tell us about your use case and how you plan to use Anyway"

**样式：** 多行文本框（Textarea）
- **宽度：** 100%
- **最小高度：** 120px - 160px
- **最大高度：** 240px（超出后滚动）
- **边框：** 1px solid `#E0E0E0`（与输入框相同）
- **圆角：** 4px - 6px
- **背景色：** `#FFFFFF`
- **内边距：** 12px 16px
- **字体：** Inter, San Francisco, Segoe UI
- **字号：** 14px - 16px（Body Regular）
- **行高：** 1.5
- **颜色：** Text Primary（`#1A1A1A`）

**验证规则：**
- 必填（不能为空）
- 最小长度：20 个字符
- 最大长度：500 个字符
- **字符计数：** 右下角实时显示 "X / 500"

**错误提示：**
- 为空："Please describe your use case"
- 过短："Use case must be at least 20 characters"
- 过长："Use case must be less than 500 characters"

**e. How did you hear about us?（了解渠道）- 选填，下拉选择**

**Label 文案：** "How did you hear about us?"

**样式：** 下拉选择器（Select Dropdown）
- **宽度：** 100%
- **高度：** 44px - 48px
- **边框：** 1px solid `#E0E0E0`
- **圆角：** 4px - 6px
- **背景色：** `#FFFFFF`
- **内边距：** 12px 16px
- **右侧图标：** ▼ 或 ↓（Chevron Down，表示可展开）

**选项：**
1. "Direct"（直接访问）
2. "Twitter"（推特）
3. "LinkedIn"（领英）
4. "Friend"（朋友推荐）
5. "Other"（其他）

**默认值：** 空或显示 placeholder "Select an option"

**9. "Submit Request" 按钮**

**样式：** Primary Button

**文案：** "Submit Request"

**位置：** 表单最后一个字段下方 24px 处，全宽

**10. 底部说明（Terms & Privacy）**

**文案：** "By continuing, you agree to our [Terms of Service](/terms) and [Privacy Policy](/privacy)"

**样式：**
- **字体：** Inter, San Francisco, Segoe UI
- **字号：** 12px（Body Small 或 Caption）
- **字重：** 400（Regular）
- **颜色：** Text Tertiary（`#A0A0A0` 或浅灰）
- **对齐：** Center（居中）
- **位置：** 按钮下方 32px - 40px 处

**链接样式：**
- **颜色：** Running Blue（`#2563EB` 或类似）
- **下划线：** 无或仅在 Hover 时显示
- **Hover 状态：**
  - 颜色：加深 10%
  - 下划线：显示
  - 光标：Pointer
  - 过渡：All 150ms ease-out

---

### 3.3 成功/错误提示设计

#### 3.3.1 Toast 通知规范

**Toast 通知是一种临时性的消息提示，用于显示操作结果（成功、错误、警告）。**

**位置：** 页面顶部中央（Top Center），距离顶部边缘 16px - 24px

**尺寸：**
- **宽度：** 自动（根据内容），最大宽度 480px - 560px
- **最小高度：** 48px
- **内边距：** 12px 16px

**样式 - 容器：**
- **圆角：** 6px - 8px
- **阴影：** `0 4px 12px rgba(0, 0, 0, 0.15)`
- **z-index：** 1000（确保在其他内容之上）
- **布局：** Flexbox，水平排列（图标 + 文字 + 关闭按钮）

**成功 Toast（Success）：**
- **背景色：** Success Green（`#16A34A` 或类似）
- **文字颜色：** White（`#FFFFFF`）
- **图标：** ✓（Checkmark），左侧显示
- **显示时长：** 5 秒（自动消失）

**错误 Toast（Error）：**
- **背景色：** Error Red（`#DC2626` 或类似）
- **文字颜色：** White（`#FFFFFF`）
- **图标：** ✕（Close），左侧显示
- **显示时长：** 10 秒（可手动关闭）
- **关闭按钮：** 右侧显示，× 图标，可点击

**动画：**
- **进入动画：** 从顶部滑入（Slide down）+ 淡入（Fade in）
  - 持续时间：200ms - 300ms
  - 缓动函数：ease-out
- **退出动画：** 向上滑出（Slide up）+ 淡出（Fade out）
  - 持续时间：200ms
  - 缓动函数：ease-in

**关闭方式：**
- **自动关闭：** 超时后自动消失
- **手动关闭：** 点击关闭按钮（×）
- **点击 Toast：** 可选，点击 Toast 本体也可关闭

#### 3.3.2 成功提示场景

**场景 A：Magic Link 发送成功**

**提示文案：** "Check your email for a magic link to log in"

**Toast 类型：** Success Toast

**可选：页面内补充提示**

**位置：** 表单下方，替代输入框和选项卡片

**内容：**
```
✓ Check your email for a magic link to log in

The link will expire in 15 minutes.
Didn't receive it? Check your spam folder or [Resend email].
```

**样式：**
- **对齐：** Left 或 Center
- **标题（"Check your email..."）：**
  - 字号：16px - 18px
  - 字重：600（Semi-bold）
  - 颜色：Text Primary
- **补充说明（"The link will expire..."）：**
  - 字号：14px（Body Regular）
  - 字重：400（Regular）
  - 颜色：Text Secondary
  - 边距：标题下方 8px 处
- **"Resend email" 链接：**
  - 颜色：Running Blue
  - Hover：下划线 + 加深

**场景 B：申请提交成功**

**提示文案：** "Thank you for your interest!"

**Toast 类型：** Success Toast

**可选：页面内补充提示**

**内容：**
```
✓ Thank you for your interest!

We've received your application and will review it shortly.
We'll get back to you within [X] business days.
```

**样式：** 与场景 A 相同

#### 3.3.3 错误提示场景

**场景 A：邮箱格式错误**

**提示位置：** 输入框下方（Helper text 位置）

**提示文案：** "Please enter a valid email address"

**样式：**
- **字号：** 12px - 13px（Body Small）
- **字重：** 400（Regular）
- **颜色：** Error Red（`#DC2626`）
- **图标：** ✕ 或 ⚠️（可选，左侧显示）
- **边距：** 输入框下方 4px - 8px 处

**同时输入框样式变化：**
- 边框：Error Red（`#DC2626`）
- 背景：`#FEF2F2`（极浅红背景）

**场景 B：邀请码无效**

**提示位置：** Toast 通知 + 输入框下方 Helper text

**提示文案：** "Invalid invitation code. Please contact support."

**Toast 类型：** Error Toast

**输入框下方 Helper text：**
- **样式：** 与场景 A 相同
- **文案：** "Invalid invitation code. Please contact support."

**场景 C：必填字段为空**

**提示位置：** 输入框下方 Helper text

**提示文案：** "Please fill in all required fields."（通用）或字段特定提示

**样式：** 与场景 A 相同

**场景 D：使用场景过长**

**提示位置：** 文本框下方 Helper text

**提示文案：** "Use case must be less than 500 characters."

**样式：** 与场景 A 相同

**字符计数：** 右下角显示 "500 / 500"（红色，表示超出）

---

### 3.4 Magic Link 验证页面

#### 3.4.1 页面布局

**显示时机：** 用户点击邮件中的 Magic Link 后

**页面标题：** "Logging you in..."

**页面内容：** 加载动画 + 提示文字

**样式：**
- **布局：** 居中式单栏布局
- **最大宽度：** 400px - 440px
- **对齐：** Center

**加载动画（Spinner）：**
- **类型：** 圆形旋转 Spinner
- **尺寸：** 32px - 40px
- **颜色：** Anyway Yellow 或 Accent Black
- **位置：** 页面中心
- **动画：** 旋转 360°，无限循环，1s 一圈

**提示文字：**
- **文案：** "Logging you in..." 或 "Verifying your email..."
- **样式：**
  - 字号：14px - 16px（Body Regular）
  - 字重：400（Regular）
  - 颜色：Text Secondary
  - 边距：Spinner 下方 16px - 24px 处

**验证成功后：**
- **重定向：** 自动跳转到 Dashboard
- **延迟：** 1-2 秒（让用户看到成功状态）

**验证失败后：**
- **错误提示：** 显示错误信息
- **操作选项：** "Try again" 或 "Request a new link"

---

## 4. 组件设计规范

### 4.1 输入框组件（Input Field）

#### 4.1.1 组件结构

```
┌────────────────────────────────────┐
│ Label (optional)                   │ ← Label
│ ┌────────────────────────────────┐ │
│ │ [Icon] Placeholder            │ │ │ ← Input Container
│ │             [Validation Icon] │ │ │
│ └────────────────────────────────┘ │
│ [Icon] Helper text / Error message │ ← Helper Text
└────────────────────────────────────┘
```

#### 4.1.2 状态矩阵

| 状态 | 边框 | 背景 | 文字颜色 | 图标 | 阴影 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Default** | `#E0E0E0` (1px) | `#FFFFFF` | Text Primary | None | None |
| **Focus** | Anyway Yellow (2px) | `#FFFFFF` | Text Primary | None | `0 0 0 3px rgba(Yellow, 0.1)` |
| **Error** | Error Red (1px) | `#FEF2F2` | Text Primary | ✕ 或 ⚠️ | None |
| **Success** | Success Green (1px) | `#F0FDF4` | Text Primary | ✓ | None |
| **Disabled** | `#E5E5E5` (1px) | `#F5F5F5` | Text Tertiary | None | None |

#### 4.1.3 尺寸变体

| 变体 | 高度 | 内边距 | 字号 | 使用场景 |
| :--- | :--- | :--- | :--- | :--- |
| **Small** | 36px - 40px | 8px 12px | 13px - 14px | 紧凑表单 |
| **Default** | 44px - 48px | 12px 16px | 14px - 16px | 大部分场景 |
| **Large** | 52px - 56px | 16px 20px | 16px - 18px | 强调输入 |

#### 4.1.4 交互细节

**聚焦行为：**
- **触发方式：** 点击输入框、Tab 键导航
- **视觉效果：**
  - 边框颜色变化（Default → Focus）
  - 边框宽度增加（1px → 2px 或 3px）
  - 外发光效果（Box shadow）
  - 过渡动画：150ms ease-out

**输入验证：**
- **验证时机：**
  - **Blur 验证：** 用户离开输入框时（推荐）
  - **Input 验证：** 用户输入中 + 延迟 500ms（可选，增强体验）
- **错误显示：**
  - 输入框边框变红
  - 背景变为极浅红
  - 下方显示错误提示文字
  - 左侧或右侧显示错误图标
- **成功显示：**
  - 输入框边框变绿
  - 背景变为极浅绿
  - 右侧显示成功图标（✓）

**字符限制（适用于 Use Case 文本框）：**
- **实时计数：** 右下角显示 "X / 500"
- **颜色变化：**
  - 正常：Text Secondary（`#666666`）
  - 接近上限（> 400）：Warning Orange（`#F97316`）
  - 超出上限：Error Red（`#DC2626`）

---

### 4.2 按钮组件（Button）

#### 4.2.1 按钮类型

**Primary Button（主按钮）**
- **用途：** 主要操作，如 "Continue"、"Submit"、"Submit Request"
- **样式：** 参见 3.1.1 节
- **尺寸：** 参见 3.2.2 节

**Secondary Button（次要按钮）**
- **用途：** 次要操作，如 "Cancel"、"Go back"
- **样式：**
  - 背景：透明
  - 边框：1px solid `#D1D1D1`
  - 文字：Text Primary（`#1A1A1A`）
  - 圆角：4px - 6px
  - 内边距：12px 24px
  - Hover：背景 `#FAFAFA` + 边框 `#A0A0A0`

**Ghost Button（幽灵按钮）**
- **用途：** 辅助操作，如 "Resend email"、"Try again"
- **样式：**
  - 背景：透明
  - 边框：None
  - 文字：Running Blue（`#2563EB`）
  - Hover：背景 `#EFF6FF`（极浅蓝）

**Text Link（文本链接）**
- **用途：** 导航链接，如 "Terms of Service"、"Privacy Policy"
- **样式：**
  - 背景：None
  - 边框：None
  - 文字：Running Blue（`#2563EB`）
  - 下划线：None（Hover 时显示）
  - Hover：颜色加深 + 下划线

#### 4.2.2 按钮状态

| 状态 | 背景 | 文字 | 边框 | 阴影 | 光标 | 透明度 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Default** | `#1A1A1A` | `#FFFFFF` | None | None | Pointer | 100% |
| **Hover** | `#2A2A2A` | `#FFFFFF` | None | `0 2px 8px rgba(0,0,0,0.15)` | Pointer | 100% |
| **Active** | `#0A0A0A` | `#FFFFFF` | None | None | Pointer | 100% |
| **Focus** | `#1A1A1A` | `#FFFFFF` | Anyway Yellow (2px) | `0 0 0 3px rgba(Yellow,0.1)` | Pointer | 100% |
| **Disabled** | `#E5E5E5` | `#A0A0A0` | None | None | Not-allowed | 60% - 80% |
| **Loading** | `#1A1A1A` | Spinner | None | None | Wait | 100% |

#### 4.2.3 按钮尺寸

| 尺寸 | 高度 | 内边距 | 字号 | 圆角 | 使用场景 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Small** | 32px - 36px | 8px 16px | 13px - 14px | 4px | 紧凑表单 |
| **Default** | 40px - 44px | 12px 24px | 14px - 16px | 4px - 6px | 大部分场景 |
| **Large** | 48px - 56px | 16px 32px | 16px - 18px | 6px - 8px | 强调操作 |

---

### 4.3 选项卡片组件（Option Card）

#### 4.3.1 组件结构

```
┌────────────────────────────────────┐
│ [Icon] Title                       │ ← Title
│       Description                  │ ← Description (optional)
└────────────────────────────────────┘
```

#### 4.3.2 状态矩阵

| 状态 | 边框 | 背景 | 标题颜色 | 阴影 | 选中指示器 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Default** | `#E0E0E0` (1px) | `#FFFFFF` | Text Primary | `0 1px 3px rgba(0,0,0,0.05)` | None |
| **Hover** | Anyway Yellow (1px) | `#FAFAFA` | Text Primary | `0 2px 6px rgba(0,0,0,0.1)` | None |
| **Selected** | Anyway Yellow (2px) | `#FEFCE8` | Anyway Yellow 或 Text Primary | `0 0 0 3px rgba(Yellow,0.1)` | 左侧竖条 |
| **Focus** | Anyway Yellow (2px) | `#FFFFFF` | Text Primary | `0 0 0 3px rgba(Yellow,0.1)` | None |
| **Disabled** | `#E5E5E5` (1px) | `#F5F5F5` | Text Tertiary | None | None |

#### 4.3.3 交互细节

**点击行为：**
- **触发方式：** 点击卡片任意位置
- **选中效果：**
  - 边框颜色变为主题色
  - 边框宽度增加（1px → 2px）
  - 背景变为极浅黄
  - 左侧或右侧显示 Anyway Yellow 竖条（2px - 3px 宽）
  - 外发光效果（Box shadow）
  - 过渡动画：150ms ease-out

**键盘导航：**
- **Tab 键：** 聚焦到卡片
- **Enter/Space 键：** 选中卡片
- **焦点样式：** 与选中样式类似，但没有竖条指示器

---

### 4.4 Toast 通知组件（Toast Notification）

#### 4.4.1 组件结构

```
┌────────────────────────────────────┐
│ [Icon] Message text            [×] │
└────────────────────────────────────┘
  Icon    Message          Close Btn
```

#### 4.4.2 类型矩阵

| 类型 | 背景色 | 文字颜色 | 图标 | 显示时长 | 可关闭 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Success** | Success Green (`#16A34A`) | White (`#FFFFFF`) | ✓ | 5s | 可选 |
| **Error** | Error Red (`#DC2626`) | White (`#FFFFFF`) | ✕ | 10s | 必需 |
| **Warning** | Warning Orange (`#F97316`) | White (`#FFFFFF`) | ⚠️ | 7s | 可选 |
| **Info** | Running Blue (`#2563EB`) | White (`#FFFFFF`) | ⓘ | 5s | 可选 |

#### 4.4.3 动画规范

**进入动画：**
- **类型：** Slide down + Fade in
- **持续时间：** 200ms - 300ms
- **缓动函数：** ease-out
- **关键帧：**
  ```css
  @keyframes toast-enter {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  ```

**退出动画：**
- **类型：** Slide up + Fade out
- **持续时间：** 200ms
- **缓动函数：** ease-in
- **关键帧：**
  ```css
  @keyframes toast-exit {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-100%);
      opacity: 0;
    }
  }
  ```

---

## 5. 视觉设计规范

### 5.1 色彩系统（Color System）

#### 5.1.1 品牌色（Brand Colors）

**Anyway Yellow（主品牌色）**
- **用途：** Logo、用户头像背景、选中状态强调、高亮关键标识
- **特征：** 充满活力但不刺眼，在深色和浅色背景下均保持高辨识度
- **色值：** 参考 `Anyway Color Guidance.png`
- **应用场景：**
  - Primary Button 的 Focus 状态边框
  - 选项卡片的 Selected 状态
  - 链接的 Hover 状态
  - 进度指示器的当前步骤

**Accent Black（强调黑）**
- **用途：** Primary Button 背景、主要文字
- **色值：** `#1A1A1A` 或更深的黑色
- **应用场景：**
  - Primary Button 背景
  - 标题文字
  - 正文文字

#### 5.1.2 语义色（Semantic Colors）

**Success Green（成功绿）**
- **用途：** 任务成功、正向增长、表单验证成功
- **色值：** `#16A34A` 或类似
- **应用场景：**
  - Success Toast 背景
  - 输入框验证成功状态
  - 成功提示文字

**Error Red（错误红）**
- **用途：** 任务失败、危险操作、错误提示
- **色值：** `#DC2626` 或类似
- **应用场景：**
  - Error Toast 背景
  - 输入框验证失败状态
  - 错误提示文字

**Running Blue（进行中蓝）**
- **用途：** 进行中状态、链接、信息提示
- **色值：** `#2563EB` 或类似
- **应用场景：**
  - 链接文字
  - Info Toast 背景
  - 进行中状态指示

**Warning Orange（警告橙）**
- **用途：** 警告、非阻塞性问题、字符接近上限
- **色值：** `#F97316` 或类似
- **应用场景：**
  - Warning Toast 背景
  - 字符计数警告（> 400 字符）

#### 5.1.3 中性色（Neutrals）

**Surface（表面色）**
- **用途：** 卡片和背景
- **色值：**
  - 纯白：`#FFFFFF`
  - 极浅灰：`#FAFAFA` 或 `#F9FAFB`
- **应用场景：**
  - 输入框背景
  - 选项卡片背景
  - 页面背景

**Border（边框色）**
- **用途：** 分割线和边框，保持低对比度以减少视觉切割感
- **色值：** `#E0E0E0` 或 `#D1D1D1`
- **应用场景：**
  - 输入框边框
  - 选项卡片边框
  - 表格分割线

**Text Primary（主要文字色）**
- **用途：** 标题、正文
- **色值：** `#1A1A1A` 或接近纯黑
- **应用场景：**
  - 页面标题
  - 输入框文字
  - 选项卡片标题

**Text Secondary（次要文字色）**
- **用途：** 次要信息、标签
- **色值：** `#666666` 或深灰
- **应用场景：**
  - 页面副标题
  - Helper Text
  - 选项卡片描述

**Text Tertiary（第三级文字色）**
- **用途：** 占位符、禁用态
- **色值：** `#A0A0A0` 或浅灰
- **应用场景：**
  - 输入框 Placeholder
  - 禁用按钮文字
  - 底部说明文字

---

### 5.2 字体系统（Typography）

#### 5.2.1 字体栈（Font Stack）

**UI Font（UI 字体）**
- **字体栈：** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **用途：** 标题、导航、正文、按钮文字
- **理由：** 确保在各平台的原生体验

**Monospace Font（等宽字体）**
- **字体栈：** `"JetBrains Mono", "Roboto Mono", "SFMono-Regular", Consolas, monospace`
- **用途：** 邀请码数字（可选）、字符计数
- **理由：** 等宽字体能确保数字对齐，便于比对

#### 5.2.2 字号阶梯（Type Scale）

| 级别 | 字号 | 行高 | 字重 | 使用场景 |
| :--- | :--- | :--- | :--- | :--- |
| **Heading 1** | 28px - 32px | 1.2 | 600 - 700 | 页面大标题 |
| **Heading 2** | 20px - 24px | 1.3 | 600 | 模块/区块标题 |
| **Body Regular** | 14px - 16px | 1.5 | 400 - 500 | 正文、输入框文字 |
| **Body Small** | 12px - 13px | 1.5 | 400 | 辅助信息、表格次要信息 |
| **Caption** | 10px - 11px | 1.4 | 400 - 500 | 极小标签、字符计数 |

#### 5.2.3 字重（Font Weight）

| 字重 | 值 | 使用场景 |
| :--- | :--- | :--- |
| **Regular** | 400 | 正文、描述 |
| **Medium** | 500 | 强调文字、按钮 |
| **Semi-bold** | 600 | 小标题、重要文字 |
| **Bold** | 700 | 大标题 |

---

### 5.3 间距与网格（Spacing & Grid）

#### 5.3.1 8px Grid System

**原则：** 所有间距、尺寸、行高应为 4px 或 8px 的倍数

**间距阶梯：**
- **4px：** 最小间距，用于紧密关联的元素（如图标和文字）
- **8px：** 小间距，用于同一组内的元素
- **16px：** 中等间距，用于相关元素之间（如输入框之间）
- **24px：** 大间距，用于不同组之间（如输入框和按钮）
- **32px：** 超大间距，用于页面级区块之间
- **40px：** 页面外边距
- **48px、64px：** 特殊大间距，用于强调分隔

#### 5.3.2 Compact Density（紧凑密度）

**原则：** 考虑到表单需要展示多个字段，采用紧凑的密度，避免过度留白

**实现：**
- 输入框高度：44px - 48px（不过高）
- 字体大小：14px - 16px（适中）
- 间距：16px（输入框之间）、24px（输入框和按钮）
- 行高：1.5（正文）、1.2（标题）

---

## 6. 交互设计规范

### 6.1 动画原则（Animation Principles）

#### 6.1.1 Snappy（干脆）

**原则：** 动画时长应控制在 100ms - 200ms 之间，快速响应，无拖泥带水

**时长建议：**
- **Hover 状态切换：** 100ms - 150ms（立即响应）
- **Focus 状态切换：** 150ms - 200ms
- **页面元素显示/隐藏：** 200ms - 300ms（如选项卡片滑入）
- **Toast 进入/退出：** 200ms - 300ms
- **Loading 动画：** 持续旋转，1s 一圈

**缓动函数：**
- **进入动画：** ease-out（快速开始，缓慢结束）
- **退出动画：** ease-in（缓慢开始，快速结束）
- **Hover/Focus：** ease-out（即时响应）

#### 6.1.2 动画场景

**Hover 状态切换：**
- **元素：** 按钮、选项卡片、链接
- **效果：** 背景色变化、边框颜色变化、阴影出现
- **时长：** 100ms - 150ms
- **缓动：** ease-out
- **触发：** 鼠标悬停（`:hover`）

**选项卡片显示：**
- **元素：** "I have an invitation code"、"Request Access" 卡片
- **效果：** 从卡片下方滑入（Slide down）+ 淡入（Fade in）
- **时长：** 200ms - 300ms
- **缓动：** ease-out
- **触发：** 用户点击 "Continue" 并验证邮箱后，延迟 1-2 秒

**邀请码输入框显示：**
- **元素：** 邀请码输入框、"Submit" 按钮
- **效果：** 从选项卡片下方滑入 + 淡入
- **时长：** 200ms - 300ms
- **缓动：** ease-out
- **触发：** 用户选择 "I have an invitation code"

**Request Access 表单显示：**
- **元素：** 申请表单（所有字段）
- **效果：** 从选项卡片下方滑入 + 淡入
- **时长：** 200ms - 300ms
- **缓动：** ease-out
- **触发：** 用户选择 "Request Access"

**Toast 通知显示/隐藏：**
- **效果：** 从顶部滑入 + 淡入（进入）；向上滑出 + 淡出（退出）
- **时长：** 200ms - 300ms
- **缓动：** ease-out（进入）、ease-in（退出）

---

### 6.2 加载状态（Loading States）

#### 6.2.1 Spinner（旋转加载器）

**用途：** 按钮加载、页面加载

**样式：**
- **类型：** 圆形旋转 Spinner
- **颜色：** White（在按钮中）、Anyway Yellow 或 Accent Black（在页面中）
- **尺寸：**
  - 按钮：16px × 16px
  - 页面：32px × 40px
- **线宽：** 2px - 3px
- **动画：** 旋转 360°，无限循环，1s 一圈
- **CSS 关键帧：**
  ```css
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  ```

**按钮中的 Spinner：**
- **位置：** 替换按钮文字或显示在文字左侧
- **按钮文案：** "Sending..."、"Submitting..."
- **按钮状态：** Disabled（禁用）

#### 6.2.2 Skeleton（骨架屏）

**用途：** 页面加载时的占位（可选）

**样式：**
- **背景：** 浅灰（`#E5E5E5` 或 `#F0F0F0`）
- **动画：** 闪烁效果（Shimmer）
- **时长：** 1.5s - 2s（无限循环）
- **缓动：** ease-in-out
- **CSS 关键帧：**
  ```css
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  ```

**应用场景：** 表单字段加载（如果未来需要动态加载字段）

---

### 6.3 表单验证交互（Form Validation）

#### 6.3.1 验证时机

**Blur 验证（推荐）：**
- **触发时机：** 用户离开输入框时（Blur 事件）
- **优点：** 不打扰用户输入过程
- **缺点：** 用户可能不知道已出错，直到离开输入框
- **适用场景：** 大部分表单字段

**Input 验证 + 延迟（可选）：**
- **触发时机：** 用户输入中（Input 事件）+ 延迟 500ms
- **优点：** 即时反馈，更现代的体验
- **缺点：** 实现复杂度稍高
- **适用场景：** 邮箱格式、邀请码格式

**Submit 验证：**
- **触发时机：** 用户点击提交按钮时
- **优点：** 最后的防线，确保所有字段有效
- **缺点：** 用户可能需要返回修改多个字段
- **适用场景：** 所有表单（必须）

#### 6.3.2 错误显示

**输入框错误样式：**
- **边框：** Error Red（`#DC2626`）
- **背景：** `#FEF2F2`（极浅红背景）
- **图标：** ✕ 或 ⚠️（右侧显示）
- **Helper Text：** 输入框下方显示错误提示文字

**错误提示文字：**
- **颜色：** Error Red（`#DC2626`）
- **字号：** 12px - 13px（Body Small）
- **字重：** 400（Regular）
- **图标：** ✕ 或 ⚠️（左侧显示，可选）

**Toast 通知：**
- **对于严重错误：** 如邀请码无效，同时显示 Toast 通知
- **样式：** Error Toast（参见 4.4.2 节）

#### 6.3.3 成功显示

**输入框成功样式（可选）：**
- **边框：** Success Green（`#16A34A`）
- **背景：** `#F0FDF4`（极浅绿背景）
- **图标：** ✓（右侧显示）

**注意：** 不是所有输入框都需要显示成功状态，仅适用于明确需要验证的字段（如邮箱格式、邀请码）

---

## 7. 响应式设计

### 7.1 断点（Breakpoints）

**设备分类：**
- **Mobile（移动端）：** < 640px
- **Tablet（平板）：** 640px - 1024px
- **Desktop（桌面端）：** > 1024px

**常用断点：**
- **Small Mobile（小手机）：** 375px - 414px
- **Large Mobile（大手机）：** 414px - 640px
- **Tablet（平板）：** 640px - 1024px
- **Desktop（桌面）：** 1024px - 1440px
- **Large Desktop（大屏）：** > 1440px

### 7.2 响应式策略

#### 7.2.1 Mobile First（移动优先）

**原则：** 先设计移动端布局，再逐步增强到桌面端

**移动端布局：**
- **单栏布局：** 所有元素垂直堆叠
- **全宽输入框：** 输入框宽度 100%
- **全宽按钮：** 按钮宽度 100%
- **简化内容：** 隐藏次要信息（如选项卡片描述）

**平板布局：**
- **保持单栏布局**
- **增加内边距：** 40px（左右各 40px）
- **最大宽度：** 600px - 640px

**桌面布局：**
- **居中单栏：** 最大宽度 440px - 480px
- **居中对齐：** 水平居中
- **增加间距：** 利用更大的屏幕空间

#### 7.2.2 字体响应式

**移动端：**
- **标题（Heading 1）：** 24px - 28px
- **正文（Body Regular）：** 14px - 15px
- **小字（Body Small）：** 12px

**桌面端：**
- **标题（Heading 1）：** 28px - 32px
- **正文（Body Regular）：** 15px - 16px
- **小字（Body Small）：** 12px - 13px

#### 7.2.3 触控目标（Touch Targets）

**最小尺寸：** 44px × 44px（Apple HIG）、48px × 48px（Material Design）

**应用：**
- **按钮：** 最小高度 44px - 48px
- **选项卡片：** 最小高度 48px - 56px
- **链接：** 如果是独立链接，增加 padding 至少 44px × 44px

---

## 8. 边界情况处理

### 8.1 输入验证错误

**场景 A：邮箱格式错误**
- **错误提示：** "Please enter a valid email address"
- **视觉反馈：**
  - 输入框边框变红
  - 背景变为极浅红
  - 下方显示错误提示文字
  - Toast 通知（可选，更严重的错误）

**场景 B：邀请码无效**
- **错误提示：** "Invalid invitation code. Please contact support."
- **视觉反馈：**
  - 输入框边框变红
  - 背景变为极浅红
  - 下方显示错误提示文字
  - Toast 通知（Error Toast）
- **重要：** 不区分具体错误原因（已使用、不存在、过期、格式错误），统一返回此提示

**场景 C：必填字段为空**
- **错误提示：**
  - 通用："Please fill in all required fields."
  - 字段特定："Please enter your email"
- **视觉反馈：**
  - 输入框边框变红
  - 背景变为极浅红
  - 下方显示错误提示文字
  - 空字段滚动到视图中心

**场景 D：使用场景过长**
- **错误提示：** "Use case must be less than 500 characters."
- **视觉反馈：**
  - 文本框边框变红
  - 背景变为极浅红
  - 下方显示错误提示文字
  - 字符计数显示 "500 / 500"（红色）

**场景 E：邮箱已提交过申请**
- **错误提示：** "You already have a pending application. We'll review it shortly."
- **视觉反馈：**
  - Toast 通知（Info Toast 或 Warning Toast）
  - 页面内显示友好提示

---

### 8.2 网络请求错误

**场景 A：邮件发送失败**
- **错误提示：** "Unable to send email. Please try again later."
- **视觉反馈：**
  - Toast 通知（Error Toast）
  - 按钮恢复为可点击状态
- **操作选项：** "Try again" 按钮

**场景 B：服务器错误**
- **错误提示：** "Something went wrong. Please try again later."
- **视觉反馈：**
  - Toast 通知（Error Toast）
  - 页面内显示友好提示（可选）
- **操作选项：** "Try again" 按钮、"Contact support" 链接

**场景 C：网络连接失败**
- **错误提示：** "Network connection failed. Please check your internet connection."
- **视觉反馈：**
  - Toast 通知（Error Toast）
  - 页面内显示友好提示（可选）
- **操作选项：** "Retry" 按钮

---

### 8.3 Magic Link 相关错误

**场景 A：Magic Link 已使用**
- **错误提示：** "This link has already been used. Please request a new one."
- **视觉反馈：**
  - Toast 通知（Error Toast）
  - 页面内显示友好提示
- **操作选项：** "Request a new link" 按钮

**场景 B：Magic Link 已过期**
- **错误提示：** "This link has expired. Please request a new one."
- **视觉反馈：**
  - Toast 通知（Error Toast）
  - 页面内显示友好提示
- **操作选项：** "Request a new link" 按钮

**场景 C：Magic Link 无效**
- **错误提示：** "Invalid link. Please request a new one."
- **视觉反馈：**
  - Toast 通知（Error Toast）
  - 页面内显示友好提示
- **操作选项：** "Request a new link" 按钮

---

### 8.4 表单字段限制

**场景 A：输入过长**
- **错误提示：** "[Field name] must be less than [X] characters."
- **视觉反馈：**
  - 输入框边框变红
  - 背景变为极浅红
  - 下方显示错误提示文字
  - 字符计数显示 "[X] / [Limit]"（红色）

**场景 B：输入过短**
- **错误提示：** "[Field name] must be at least [X] characters."
- **视觉反馈：**
  - 输入框边框变红
  - 背景变为极浅红
  - 下方显示错误提示文字

**场景 C：非法字符**
- **错误提示：** "[Field name] contains invalid characters."
- **视觉反馈：**
  - 输入框边框变红
  - 背景变为极浅红
  - 下方显示错误提示文字

---

## 9. 可访问性规范（Accessibility）

### 9.1 键盘导航（Keyboard Navigation）

#### 9.1.1 Tab 顺序

**原则：** 符合逻辑的 Tab 顺序，从上到下、从左到右

**登录页面 Tab 顺序：**
1. 邮箱输入框
2. "Continue" 按钮
3. "I have an invitation code" 选项卡片
4. "Request Access" 选项卡片
5. 底部链接（Terms of Service、Privacy Policy）

**邀请码路径 Tab 顺序：**
1. 邀请码输入框（自动聚焦）
2. "Submit" 按钮
3. 底部链接

**Request Access 路径 Tab 顺序：**
1. Full Name 输入框
2. Email 输入框（预填）
3. Company Name 输入框
4. Use Case 文本框
5. How did you hear about us? 下拉选择
6. "Submit Request" 按钮
7. 底部链接

#### 9.1.2 焦点样式（Focus Styles）

**原则：** 清晰的焦点指示器，使用 Anyway Yellow 作为焦点色

**输入框焦点样式：**
- **边框：** Anyway Yellow（2px - 3px）
- **边框偏移：** -1px 或 -2px（内边框）
- **外发光：** `0 0 0 3px rgba(Anyway Yellow, 0.1)`

**按钮焦点样式：**
- **边框：** Anyway Yellow（2px）
- **边框偏移：** -2px（内边框）
- **外发光：** `0 0 0 3px rgba(Anyway Yellow, 0.1)`

**选项卡片焦点样式：**
- **边框：** Anyway Yellow（2px - 3px）
- **外发光：** `0 0 0 3px rgba(Anyway Yellow, 0.1)`

#### 9.1.3 快捷键（Keyboard Shortcuts）

**快捷键列表：**
- **Tab：** 下一个可聚焦元素
- **Shift + Tab：** 上一个可聚焦元素
- **Enter：** 提交表单、选中选项卡片
- **Space：** 选中选项卡片（仅卡片）
- **Escape：** 关闭 Toast 通知、关闭 Modal（如有）

---

### 9.2 屏幕阅读器支持（Screen Reader Support）

#### 9.2.1 ARIA 标签

**输入框：**
- **`aria-label`：** 输入框的标签（如果没有 `<label>` 元素）
- **`aria-describedby`：** 关联 Helper Text 或错误提示
- **`aria-invalid`：** "true"（输入无效时）或 "false"
- **`aria-required`：** "true"（必填字段）或 "false"

**示例：**
```html
<input
  type="email"
  id="email"
  aria-label="Email address"
  aria-describedby="email-helper"
  aria-invalid="false"
  aria-required="true"
/>
<p id="email-helper" class="helper-text">Enter your email</p>
```

**按钮：**
- **`aria-label`：** 按钮的标签（如果按钮文字不明确）
- **`aria-disabled`：** "true"（禁用状态）或 "false"

**选项卡片：**
- **`role="radio"`：** 单选角色
- **`aria-checked`：** "true"（选中）或 "false"（未选中）
- **`aria-labelledby`：** 关联标题元素

**Toast 通知：**
- **`role="alert"`：** 警告角色（错误 Toast）
- **`role="status"`：** 状态角色（成功 Toast）
- **`aria-live="polite"`：** 礼貌模式（不立即打断用户）
- **`aria-live="assertive"`：** 强制模式（立即打断用户，用于严重错误）

#### 9.2.2 语义化 HTML

**原则：** 使用正确的 HTML 标签，确保良好的语义结构

**示例：**
```html
<main>
  <h1>Get Started with Anyway</h1>
  <p>Manage API costs, billing, and payments in one place</p>

  <form>
    <label for="email">Email Address</label>
    <input type="email" id="email" name="email" required />
    <p id="email-error" class="error-message" role="alert"></p>

    <button type="submit">Continue</button>
  </form>

  <footer>
    <p>By continuing, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></p>
  </footer>
</main>
```

---

### 9.3 对比度（Color Contrast）

#### 9.3.1 WCAG 标准

**WCAG 2.1 AA 级别要求：**
- **正文文字（< 18px）：** 最小对比度 4.5:1
- **大文字（≥ 18px 或 ≥ 14px 粗体）：** 最小对比度 3:1
- **UI 组件和图形对象：** 最小对比度 3:1

**WCAG 2.1 AAA 级别要求：**
- **正文文字（< 18px）：** 最小对比度 7:1
- **大文字（≥ 18px 或 ≥ 14px 粗体）：** 最小对比度 4.5:1

#### 9.3.2 建议

**Anyway 建议遵循 WCAG 2.1 AA 级别：**

**文字对比度：**
- **Text Primary（`#1A1A1A`）on Surface（`#FFFFFF`）：** 16.1:1 ✅（远超 AAA）
- **Text Secondary（`#666666`）on Surface（`#FFFFFF`）：** 5.7:1 ✅（满足 AAA）
- **Text Tertiary（`#A0A0A0`）on Surface（`#FFFFFF`）：** 3.1:1 ✅（满足 AA）

**按钮对比度：**
- **White（`#FFFFFF`）on Accent Black（`#1A1A1A`）：** 16.1:1 ✅（远超 AAA）
- **Running Blue（`#2563EB`）on Surface（`#FFFFFF`）：** 6.3:1 ✅（满足 AAA）

**Toast 对比度：**
- **White（`#FFFFFF`）on Success Green（`#16A34A`）：** 4.6:1 ✅（满足 AAA）
- **White（`#FFFFFF`）on Error Red（`#DC2626`）：** 4.0:1 ✅（满足 AA）

---

## 10. 设计交付物

### 10.1 设计文件（Design Files）

#### 10.1.1 Figma 设计稿

**文件结构：**
```
Anyway Onboarding System
├── 01. Home Page
│   ├── Desktop (1440px)
│   ├── Tablet (768px)
│   └── Mobile (375px)
├── 02. Login Page
│   ├── Desktop (1440px)
│   ├── Tablet (768px)
│   └── Mobile (375px)
├── 03. Login Page - Invitation Code Path
│   ├── Desktop (1440px)
│   ├── Tablet (768px)
│   └── Mobile (375px)
├── 04. Login Page - Request Access Path
│   ├── Desktop (1440px)
│   ├── Tablet (768px)
│   └── Mobile (375px)
├── 05. Success States
│   ├── Magic Link Sent
│   ├── Application Submitted
│   └── Logging In...
├── 06. Error States
│   ├── Invalid Email
│   ├── Invalid Invitation Code
│   ├── Required Fields Empty
│   ├── Use Case Too Long
│   └── Network Errors
├── 07. Components
│   ├── Buttons
│   ├── Input Fields
│   ├── Option Cards
│   ├── Toast Notifications
│   └── Typography
└── 08. Responsive Breakpoints
    ├── Mobile (< 640px)
    ├── Tablet (640px - 1024px)
    └── Desktop (> 1024px)
```

**页面要求：**
- **所有状态：** Default、Hover、Focus、Active、Disabled、Error、Success
- **所有断点：** Mobile (375px)、Tablet (768px)、Desktop (1440px)
- **交互原型：** 关键交互流程（点击 "Continue"、选择选项卡片、提交表单）

#### 10.1.2 组件库（Component Library）

**组件清单：**
1. **Buttons**
   - Primary Button（所有状态）
   - Secondary Button（所有状态）
   - Ghost Button（所有状态）
   - Text Link（所有状态）

2. **Input Fields**
   - Text Input（所有状态）
   - Textarea（所有状态）
   - Select Dropdown（所有状态）

3. **Option Cards**
   - Default（所有状态）
   - With Description（所有状态）

4. **Toast Notifications**
   - Success Toast
   - Error Toast
   - Warning Toast
   - Info Toast

5. **Typography**
   - Heading 1
   - Heading 2
   - Body Regular
   - Body Small
   - Caption

6. **Icons**
   - Checkmark（✓）
   - Close（✕）
   - Warning（⚠️）
   - Info（ⓘ）
   - Chevron Down（▼）

#### 10.1.3 设计规范文档（Design Specs）

**内容清单：**
1. **色彩规范：** 色值、使用场景、对比度
2. **字体规范：** 字体栈、字号阶梯、字重
3. **间距规范：** 8px Grid System、间距阶梯
4. **组件规范：** 尺寸、内边距、圆角、阴影
5. **交互规范：** 动画时长、缓动函数、触发方式
6. **响应式规范：** 断点、布局策略

---

### 10.2 原型（Prototype）

#### 10.2.1 交互原型

**关键流程：**

**流程 A：有邀请码的用户**
1. 点击 "Get Started" 按钮
2. 输入邮箱地址
3. 点击 "Continue" 按钮
4. 选择 "I have an invitation code" 卡片
5. 输入邀请码
6. 点击 "Submit" 按钮
7. 显示成功提示

**流程 B：无邀请码的用户**
1. 点击 "Get Started" 按钮
2. 输入邮箱地址
3. 点击 "Continue" 按钮
4. 选择 "Request Access" 卡片
5. 填写申请表单
6. 点击 "Submit Request" 按钮
7. 显示成功提示

**错误流程：**
1. 输入无效邮箱 → 显示错误提示
2. 输入无效邀请码 → 显示错误提示
3. 提交空表单 → 显示错误提示

#### 10.2.2 原型工具

**推荐工具：**
- **Figma Prototype：** 基础交互原型（推荐）
- **Framer：** 高保真交互原型（可选）
- **Principle：** 复杂动画原型（可选）

---

### 10.3 开发交付（Developer Handoff）

#### 10.3.1 设计标注（Design Annotations）

**标注内容：**
- **尺寸：** 宽度、高度、内边距、外边距
- **颜色：** 背景色、文字颜色、边框颜色
- **字体：** 字号、字重、行高、字间距
- **圆角：** 圆角半径
- **阴影：** 阴影参数（X、Y、Blur、Spread、Color）
- **动画：** 时长、缓动函数、延迟

#### 10.3.2 CSS 输出（可选）

**CSS 变量示例：**
```css
/* Brand Colors */
--color-anyway-yellow: #F59E0B;
--color-accent-black: #1A1A1A;

/* Semantic Colors */
--color-success: #16A34A;
--color-error: #DC2626;
--color-running: #2563EB;
--color-warning: #F97316;

/* Neutral Colors */
--color-surface: #FFFFFF;
--color-border: #E0E0E0;
--color-text-primary: #1A1A1A;
--color-text-secondary: #666666;
--color-text-tertiary: #A0A0A0;

/* Typography */
--font-ui: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-mono: 'JetBrains Mono', 'Roboto Mono', monospace;

/* Type Scale */
--font-size-h1: 28px;
--font-size-h2: 20px;
--font-size-body: 15px;
--font-size-small: 12px;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 40px;

/* Border Radius */
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;

/* Shadows */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
--shadow-md: 0 2px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.15);
```

#### 10.3.3 开发沟通会议

**会议议程：**
1. **设计讲解：** 过一遍设计稿，解释关键设计决策
2. **交互演示：** 演示交互原型，确保理解一致
3. **问题讨论：** 回答开发团队的问题
4. **技术评估：** 评估实现难度和时间
5. **行动计划：** 明确下一步行动和责任人

---

## 11. 附录（Appendix）

### 11.1 术语表（Glossary）

| 术语 | 定义 |
| :--- | :--- |
| **Magic Link** | 一种无密码登录方式，用户点击邮件中的链接即可完成登录 |
| **Invitation Code** | 5 位数字邀请码，用于注册验证 |
| **Request Access** | 申请访问流程，用户填写表单等待运营审核 |
| **Toast Notification** | 临时性的消息提示，显示在页面顶部 |
| **Helper Text** | 输入框下方的辅助说明文字 |
| **Blur Event** | 用户离开输入框时触发的事件 |
| **Focus State** | 元素获得键盘焦点时的样式 |
| **Hover State** | 鼠标悬停在元素上时的样式 |
| **Active State** | 元素被点击时的样式 |
| **Disabled State** | 元素禁用时的样式 |
| **8px Grid System** | 所有间距、尺寸为 8px 倍数的设计系统 |
| **Compact Density** | 紧凑的密度，适合展示大量数据 |
| **WCAG** | Web Content Accessibility Guidelines（Web 内容无障碍指南） |
| **ARIA** | Accessible Rich Internet Applications（无障碍富互联网应用） |

---

### 11.2 参考资源（References）

**内部文档：**
- [Anyway Product Background](../Anyway%20Product%20Background)
- [Anyway Design System](../Anyway_Design_System.md)
- [Onboarding Invitation System PRD](./onboarding-invitation-system-PRD.md)

**设计资源：**
- [Anyway Button.png](../Prototype%20V4/Anyway%20Button.png)
- [Anyway Color Guidance.png](../Prototype%20V4/Anyway%20Color%20Guidance.png)
- [Anyway Typography.png](../Prototype%20V4/Anyway%20Typography.png)

**外部参考：**
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design - Buttons](https://material.io/components/buttons)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

### 11.3 设计检查清单（Design Checklist）

**页面布局：**
- [ ] 所有元素对齐（8px Grid System）
- [ ] 间距符合规范（8px 倍数）
- [ ] 响应式断点正确（Mobile、Tablet、Desktop）
- [ ] 触控目标最小尺寸（44px × 44px）

**视觉设计：**
- [ ] 字体使用正确（UI Font、Monospace Font）
- [ ] 字号阶梯正确（Heading 1、Body Regular、Body Small）
- [ ] 颜色使用正确（Brand Colors、Semantic Colors、Neutrals）
- [ ] 对比度符合 WCAG AA 标准（最小 4.5:1）

**交互设计：**
- [ ] Hover 状态定义清晰
- [ ] Focus 状态定义清晰（键盘导航）
- [ ] Active 状态定义清晰
- [ ] Disabled 状态定义清晰
- [ ] Error 状态定义清晰
- [ ] Success 状态定义清晰（如适用）
- [ ] 动画时长符合规范（100ms - 200ms）
- [ ] 动画缓动函数正确（ease-out、ease-in）

**表单验证：**
- [ ] 实时验证（Blur 或 Input + 延迟）
- [ ] 错误提示清晰、具体、可操作
- [ ] 必填字段标记清晰
- [ ] 字符限制显示（Use Case 字段）

**可访问性：**
- [ ] Tab 顺序符合逻辑
- [ ] 焦点样式清晰（Anyway Yellow 边框）
- [ ] ARIA 标签正确（aria-label、aria-describedby、aria-invalid）
- [ ] 语义化 HTML（label、input、button）
- [ ] 键盘快捷键支持（Tab、Enter、Space、Escape）

**组件规范：**
- [ ] 按钮（Primary、Secondary、Ghost、Link）
- [ ] 输入框（所有状态）
- [ ] 选项卡片（所有状态）
- [ ] Toast 通知（Success、Error、Warning、Info）
- [ ] 字体（Heading 1、Body Regular、Body Small）

**原型：**
- [ ] 关键流程完整（有邀请码、无邀请码、错误流程）
- [ ] 交互逻辑正确（点击、输入、验证）
- [ ] 过渡动画流畅（200ms - 300ms）
- [ ] 错误场景覆盖（所有错误类型）

---

**文档结束**

---

**设计师签名：** _______________

**日期：** 2025-01-19

**版本：** v1.0 (MVP)

**状态：** 草案（Draft）
