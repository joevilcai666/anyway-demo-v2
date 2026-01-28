# Anyway 设计系统与视觉规范 (Design System & Visual Guidelines)

## 1. 设计哲学 (Design Philosophy)

Anyway 的设计服务于开发者和 AI 初创公司创始人。我们的美学核心是 **"Engineering Precision" (工程精准)**。

*   **功能至上 (Function First)**: 每一个像素都应服务于信息的传达。去除不必要的装饰，让数据和操作成为主角。
*   **高信噪比 (High Signal-to-Noise)**: 界面应保持克制与冷静，避免过度干扰，确保用户能迅速聚焦于 Cost, Trace 和 Status 等核心指标。
*   **确定性 (Determinism)**: 交互反馈应当即时、明确且可预测，如同代码执行的结果一样。

---

## 2. 基础系统 (Foundations)

### 2.1 色彩系统 (Color System)

色彩的使用应极其克制，主要用于区分层级、状态和引导行动。

#### 品牌色 (Brand Colors)
*   **Anyway Yellow (主品牌色)**: 用于高亮关键标识（如 Logo、用户头像背景）、选中状态的强调。
    *   *特征*: 充满活力但不刺眼，在深色和浅色背景下均保持高辨识度。
*   **Accent Black**: 用于主要文字、强按钮背景。

#### 语义色 (Semantic Colors)
用于表达系统状态，需符合开发者通识认知。
*   **Success Green**: 任务成功 (Success)，正向增长。
*   **Error Red**: 任务失败 (Failed)，危险操作，错误提示。
*   **Running Blue**: 进行中 (Running)，链接，信息提示。
*   **Warning Orange**: 警告，非阻塞性问题。

#### 中性色 (Neutrals)
构建界面的骨架。
*   **Surface**: 纯白 (White) 或极浅灰 (Off-white) 用于卡片和背景。
*   **Border**: 浅灰，用于分割线和边框，保持低对比度以减少视觉切割感。
*   **Text Primary**: 接近纯黑，用于标题、正文。
*   **Text Secondary**: 深灰，用于次要信息、标签。
*   **Text Tertiary**: 浅灰，用于占位符、禁用态。

### 2.2 排版 (Typography)

#### 字体栈 (Font Stack)
*   **UI Font**: 系统默认无衬线字体 (Inter, San Francisco, Segoe UI)。用于标题、导航、正文，确保在各平台的原生体验。
*   **Monospace Font (关键)**: JetBrains Mono, Roboto Mono 或系统等宽字体。
    *   *应用场景*: **所有**数值 (Cost, Tokens)、ID (Delivery ID, Trace ID)、代码片段、API Key、JSON 输出。
    *   *理由*: 等宽字体能确保数字对齐，便于比对，且符合目标用户（开发者）的阅读习惯。

#### 字号阶梯 (Type Scale)
*   **Heading 1**: 页面大标题 (Page Title)。
*   **Heading 2**: 模块/区块标题 (Section Header)。
*   **Body Regular**: 默认正文 (14px/16px)，用于大部分阅读内容。
*   **Body Small**: 辅助信息 (12px/13px)，用于表格次要信息、注释。
*   **Caption**: 极小字号 (10px/11px)，用于 Badge 或超细微标签。

### 2.3 间距与网格 (Spacing & Grid)
*   **8px Grid System**: 所有间距、尺寸、行高应为 4px 或 8px 的倍数。
*   **Compact Density**: 考虑到 Dashboard 需要展示大量数据，采用紧凑的密度。表格行高应控制在舒适范围内，避免过度留白导致一屏信息量过低。

---

## 3. 组件规范 (Component Specifications)

### 3.1 按钮 (Buttons)
参考 `Anyway Button.png`。
*   **Primary Button**:
    *   背景：黑色 / 深色。
    *   文字：白色 / 反色。
    *   圆角：小圆角 (4px - 6px)，传递稳重与精确感。
    *   交互：Hover 时轻微变亮或增加阴影；Active 时下沉。
*   **Secondary / Outline Button**:
    *   背景：透明。
    *   边框：1px 中性灰。
    *   文字：深色。
*   **Ghost / Text Button**:
    *   仅文字，Hover 时出现浅灰背景。用于表格内的操作 (如 "Trace", "Edit")。

### 3.2 徽章与标签 (Badges & Tags)
用于展示 Status (Success, Failed) 或 Type (SDK, Payment)。
*   **样式**: 采用 "Subtle" 风格——浅色背景 + 深色文字 (Soft Background)。
*   **形状**: 全圆角 (Pill shape) 或 小圆角 (Rounded rect)。
*   **示例**:
    *   Success: 浅绿背景 + 深绿文字。
    *   Failed: 浅红背景 + 深红文字。

### 3.3 表格 (Data Tables)
Dashboard 的核心组件。
*   **表头 (Header)**: 字体略小，全大写或加粗，颜色为 Secondary Text。
*   **行 (Row)**:
    *   **Hover**: 鼠标悬停时必须有明显的背景色变化 (Highlight)，辅助视线对齐。
    *   **分割线**: 极细的浅灰分割线，或者仅使用留白分割。
*   **单元格 (Cell)**:
    *   **数值列**: 右对齐，使用等宽字体。
    *   **文本列**: 左对齐。
    *   **操作列**: 右对齐或固定宽度。

### 3.4 侧边栏与导航 (Sidebar & Navigation)
*   **层级**: 固定在左侧，深色或浅色背景（需与内容区形成对比）。
*   **选中态**: 高亮背景块 + 品牌色文字/图标，或左侧/右侧出现品牌色竖条指示器。
*   **Account Widget**: 位于底部，作为锚点。用户头像背景使用 **Unified Yellow**，形成视觉焦点。

### 3.5 弹窗与抽屉 (Modals & Slide-overs)
*   **Slide-over (侧滑面板)**: 用于查看详情 (Trace Details)。
    *   从屏幕右侧滑出，覆盖约 40%-60% 宽度。
    *   背景需有遮罩 (Overlay)，让用户聚焦于详情。
    *   支持点击遮罩关闭或 ESC 关闭。
*   **Modal (模态弹窗)**: 用于简短的决策或输入 (Create API Key)。
    *   居中显示，包含清晰的 Header, Body, Footer。

---

## 4. 交互动效 (Interaction & Motion)

*   **原则**: **Snappy (干脆)**。
*   **时长**: 动画时长应控制在 100ms - 200ms 之间。
*   **场景**:
    *   Hover 状态切换：立即响应。
    *   Slide-over 滑出：快速平滑，无回弹。
    *   Loading：使用骨架屏 (Skeleton) 或 极简的 Spinner，避免全屏 Loading。

---

## 5. 资源文件引用 (Assets)

在具体设计执行中，请直接吸取以下源文件的样式参数：
*   **字体细节**: [Anyway Typography.png](file:///Users/jichuncai/Library/Mobile%20Documents/com~apple~CloudDocs/Anyway/Prototype%20V4/Anyway%20Typography.png)
*   **颜色色值**: [Anyway Color Guidance.png](file:///Users/jichuncai/Library/Mobile%20Documents/com~apple~CloudDocs/Anyway/Prototype%20V4/Anyway%20Color Guidance.png)
*   **按钮参数**: [Anyway Button.png](file:///Users/jichuncai/Library/Mobile%20Documents/com~apple~CloudDocs/Anyway/Prototype%20V4/Anyway%20Button.png)
