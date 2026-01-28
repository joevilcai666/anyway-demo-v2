# Anyway 设计需求文档 (DRD)

## 1. 项目背景与设计理念

### 1.1 产品背景
**Anyway** 是面向 AI 初创公司和开发者的商业化基础设施。它解决了变动 AI 成本（例如 Token 用量）与传统固定费用计费工具之间的错配问题。
*   **核心价值**：集成 **成本计量 (Cost Metering)**、**计费策略 (Billing Strategies)** 和 **支付收款 (Payment Collection)**。
*   **目标用户**：开发者、AI 初创公司创始人。

### 1.2 设计目标
*   **心智模型清晰**：界面必须直观传达“这里管理什么对象”以及“我可以进行什么操作”。
*   **低认知负荷**：通过清晰的层级结构和信息架构 (IA)，帮助用户快速发现产品价值。
*   **开发者为中心的审美**：简洁、高效、精准。

---

## 2. 设计系统与视觉规范

所有设计必须严格遵守提供的设计资产。

*   **排版 (Typography)**：参考 `Anyway Typography.png`。确保层级与定义的比例一致。
*   **配色 (Color Palette)**：参考 `Anyway Color Guidance.png`。
    *   **品牌强调色**：使用定义的黄色（例如用于用户 Logo 背景）。
*   **组件 (Components)**：参考 `Anyway Button.png` 获取按钮圆角、内边距、阴影及各状态（默认、悬停、激活、禁用）的规范。

---

## 3. 全局布局与导航

### 3.1 结构
*   **布局**：左右分栏布局。左侧固定 **侧边栏 (Sidebar)** 用于导航，右侧 **内容区** 展示具体功能。

### 3.2 左侧侧边栏
*   **顶部 (Header)**：
    *   **品牌**：Anyway Logo。
    *   **切换开关**：收缩/展开按钮（位于 Logo 右侧或侧边栏右上角）。
        *   *收缩状态*：仅显示图标。
*   **主导航 (Main Navigation - 上部区域)**：
    *   列表顺序：
        1.  **Agent Traces**
        2.  **Products**
        3.  **Orders**
        4.  **Finance**
    *   *交互*：悬停状态必须清晰。激活状态需高亮当前选中的模块。
*   **次级导航 (Secondary Navigation - 下部区域)**：
    *   **Documentation**：点击后在新标签页打开。
*   **用户底部栏 (User Footer - 底部锚点)**：
    *   **账号组件 (Account Widget)**：
        *   **头像**：圆形，显示用户首字母。背景色：**统一黄色**。
        *   **信息**：用户名称，用户邮箱。
    *   *交互*：点击此区域触发 **账号面板 (Account Panel)**。

---

## 4. 账号面板 (Account Panel)
*   **触发方式**：点击侧边栏的账号组件。
*   **呈现形式**：在侧边栏右侧弹出的浮层或菜单（或吸附于组件）。
*   **内容**：
    1.  **个人信息区**：重复展示 Logo、名称、邮箱。
    2.  **菜单项**：
        *   **Developers** (原 API Keys 改名)。
        *   **Sign Out**。

---

## 5. 功能页面：开发者 (Developers / API Management)

### 5.1 概述
*   **路径**：账号面板 -> Developers。
*   **用途**：管理用于 SDK 集成和支付数据访问的 API Key。

### 5.2 页面头部
*   **标题**："Developers"
*   **描述**：简短说明用途的文本。
*   **主要操作**："Create API key" 按钮。

### 5.3 内容区域 (Key 管理)
页面包含两个独立的区块/表格：

#### 区块 A：SDK API Keys
*   **用途**：用于追踪 Agent 数据。
*   **空状态**："Create an API key to connect your SDK"。

#### 区块 B：Payment API Keys
*   **用途**：用于查询支付数据/验证状态。
*   **空状态**："Create an API key to connect your payment data"。

#### 表格规范 (两者通用)
*   **列定义**：
    1.  **Name**：支持行内编辑 (Inline edit)。
    2.  **Tokens**：掩码显示，点击可复制。
    3.  **Status**：状态徽章 "Active" / "Inactive"。
    4.  **Created**：日期格式 (月 日)。
    5.  **Last used**：日期格式 (月 日)。
    6.  **Actions**："..." (肉丸菜单) 包含 Edit/Revoke/Delete。

### 5.4 交互流程：创建 API Key
*   **触发入口**：页面头部的 "Create API key" 按钮或内部的 "Connect SDK" 入口。
*   **步骤 1：配置表单**
    *   **类型选择 (Type Selector)**：在 "SDK API Key" 与 "Payment API Key" 之间进行可视化选择（需清晰说明区别）。
    *   **名称 (Name)**：输入框（手动填写或自动生成）。
    *   *隐藏/未来项*：过期时间、权限（MVP 阶段不做，或仅预留 UI）。
*   **步骤 2：成功弹窗 (揭示 Key)**
    *   **标题**："Your New API Key"。
    *   **安全提示**："Keep your key safe... You won't be able to see it again."
    *   **Key 展示**：大号、清晰的文本区域显示完整的 Secret Key。
    *   **操作**：
        *   按钮："Copy key"。
        *   链接/按钮："Download as .env snippet"。
        *   主要按钮："Done"（关闭弹窗，刷新列表）。
*   **错误状态**：处理创建失败的情况，显示错误码并提供重试选项。
