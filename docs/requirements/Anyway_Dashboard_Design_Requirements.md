# Anyway Dashboard 设计需求文档 (DRD) - Agent 行为追踪模块

## 1. 模块背景与目标

### 1.1 背景
本模块是 MVP 版本的核心，旨在通过追踪 Agent 的执行轨迹 (Trace) 来准确计算交付成本。
*   **核心价值**：帮助 Merchant 连接成本、计费与收付款。让 Merchant 清楚知道每一单 Delivery 的真实成本与毛利，并为最终用户提供可解释的账单。
*   **目标用户**：个人开发者、AI Agency、小型 SaaS 团队。

### 1.2 核心体验目标
*   **零摩擦接入**：通过 Sample Data 和清晰的引导流程，降低 SDK 接入心理门槛。
*   **数据可解释性**：在 Dashboard 和详情页中，清晰展示 Cost, Steps, Duration 等关键指标，让“黑盒”的 Agent 运行过程变得透明。

---

## 2. 交互与界面规范
*   **继承规范**：排版、配色、组件样式严格遵循全局设计规范（参考 `Anyway_Design_Requirements.md` 及相关设计资源）。
*   **布局**：嵌入在全局布局的 **Dashboard** 导航项下。

---

## 3. 新手引导与 SDK 接入流程 (Onboarding)

### 3.1 Sample Data 状态
针对首次进入且未接入数据的 Merchant，Dashboard 展示演示数据。

*   **顶部 Banner**：
    *   **位置**：Dashboard 内容区顶部（在筛选器上方）。
    *   **文案**：
        *   左侧提示："You’re viewing sample data"
        *   中间辅助："Connect Python SDK to see your first live Delivery trace"
    *   **CTA 按钮**："Connect Python SDK" (点击触发接入弹窗)。
*   **演示数据内容**：
    *   至少展示 3 条 Demo Deliveries。
    *   每条 Delivery 包含 3-6 个 Steps，模拟真实数据样式。

### 3.2 接入弹窗 (Connect Python SDK Modal)
*   **结构**：
    *   **顶部**：横向步骤条 (Checklist)，共 3 步。
        1.  Get API Key
        2.  Install SDK
        3.  Test trace
        *   *交互*：完成的步骤显示 ✅，可点击切换步骤查看。
    *   **中间**：当前步骤的具体内容。
    *   **底部**：状态区与“下一步”按钮。

#### 步骤一：Get API Key (Create API Key)
*   **内容**：复用 Account -> Developers 模块的创建 API Key 组件。
*   **关键交互**：
    *   创建成功后，展示 Secret Key。
    *   **重要提示**："Key 只展示一次"。
*   **完成判定**：检测到 API Key 已创建。

#### 步骤二：Install SDK
*   **内容**：
    *   **上半区**：安装命令代码块 (如 `pip install anyway-sdk`) + 复制按钮 (Copy)。
    *   **下半区**：辅助链接。
        *   "View API docs" (点击跳转外部文档)。
        *   "Troubleshooting install"。
*   **操作**：按钮 "Continue"。
*   **提示**：点击 Continue 时提示 "We’ll confirm everything when you send a test trace"。

#### 步骤三：Send Test Trace
*   **内容**：引导用户发送测试请求。
*   **操作**：主按钮 "Send Test Trace" (模拟发送或引导用户在本地运行测试代码)。
*   **状态反馈**：
    *   **成功**：
        *   Toast 提示："Test delivery received"。
        *   弹窗关闭，Dashboard 自动切换为 **Live 数据视图**。
        *   页面自动跳转到该条测试 Delivery 的详情页。
    *   **失败**：展示错误状态与重试引导。
*   **完成判定**：后端收到 `test_trace_received == true`。

### 3.3 状态流转
*   **未完成引导**：Banner 常驻，Checklist 显示未完成。
*   **完成引导**：Banner 消失，显示真实业务数据。

---

## 4. Dashboard 列表页 (Delivery List)

### 4.1 页面布局
*   **顶部操作区**：
    *   **时间范围选择器**：支持 Start Time & End Time。
    *   **状态筛选 (Status)**：All / Success / Failed。
*   **主体列表 (Table)**：展示 Agent 的 Delivery 记录。

### 4.2 表格列定义 (Columns)
| 列名 | 内容/格式 | 排序/交互 |
| :--- | :--- | :--- |
| **Delivery ID** | 唯一标识符 | - |
| **Timestamp** | `Created At`，精确到分钟，含时区 | **默认排序 (倒序)** |
| **Agent** | 第一行：Agent 名称<br>第二行：User Email | - |
| **Status** | 状态徽章：`Success` (绿), `Failed` (红), `Running` (蓝/灰) | - |
| **Steps** | 总步骤数 (数字) | 可选排序 |
| **Tokens** | 总消耗 Token 数 | 可选排序 |
| **Cost** | 汇总成本 (USD) | **支持排序** |
| **Actions** | 按钮 "Trace" (或 "Details") | 点击打开详情面板 |

### 4.3 列表交互
*   **排序**：默认按 Timestamp 倒序。支持按 Cost 排序。
*   **分页**：服务端分页，每页 50 条。
*   **详情触发**：点击表格行或 "Trace" 按钮，从右侧滑出详情面板 (Slide-over)。列表页保持原位，保留筛选状态。

---

## 5. Delivery 详情面板 (Slide-over Panel)

### 5.1 头部 (Header)
采用 **紧凑型 (Compact)** 布局，最大化垂直空间利用率。

*   **布局**：Flex 左右布局。
    *   **左侧**：**Delivery ID** (H3, Bold) + **Status Badge** (Small)。
    *   **右侧**：**Summary Metrics** (Total Cost, Duration, Tokens) 并排展示，使用分割线或间距隔开。不再单独占用一行卡片。
*   **交互**：右侧边缘保留关闭按钮 (X)。

### 5.3 执行轨迹 (Execution Trace)
采用 **"Connected Timeline Tree" (连线时间轴树)** 布局，解决层级割裂问题。

*   **视觉结构 (Visual Structure)**：
    *   **主轴线**：左侧贯穿一条垂直的灰色时间线 (Timeline Guide)。
    *   **节点 (Nodes)**：每个 Step 的图标作为时间线上的节点。
    *   **分支 (Branches)**：Child Spans 通过 **L型连接线 (L-Curve)** 从 Parent 的时间线上分叉出来。
        *   *关键修正*：Child Span 不再悬浮，必须通过实线物理连接到 Parent。
*   **列表项交互 (Row Interaction)**：
    *   **点击行体**：在当前行 **下方 (Inline)** 展开详情面板 (Details Panel)。
    *   **父子关系**：默认展开所有子步骤。通过左侧的连接线清晰表达层级，不再依赖额外的折叠按钮，除非层级过深 (>3层)。
*   **样式细节**：
    *   **Parent Step**：字体加粗，图标稍大。
    *   **Child Step**：强缩进 (Indentation)，图标稍小，通过连接线明确归属。

### 5.4 步骤详情 (Step Details)
当点击某个 Step 时展示详细数据。**不展示** 任何关于父子关系的冗余链接，因为列表结构已经表达清楚了。

*   **Header**：
    *   Step Name + Status Badge。
*   **Usage Breakdown (用量明细)**：
    *   展示 Total Tokens, Input Tokens, Output Tokens 的详细数值。
*   **Configuration (配置信息)**：
    *   以 Key-Value 列表展示：Model (Requested/Actual), Parameters 等。
*   **Performance (性能指标)**：
    *   Finish Reason, Exact Duration (ms), Start/End Time。

---

## 6. 数据计算逻辑 (供设计参考)
*   **Total Cost** = Σ (所有 Step 的 Cost)。
*   **Status 判定**：
    *   `Success`: 所有 Step 成功。
    *   `Failed`: 存在失败 Step 且 Delivery 终止。
    *   `Running`: 有开始时间无结束时间。
