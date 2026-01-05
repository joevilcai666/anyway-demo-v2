# Anyway Orders（收款记录）DRD（MVP）

## 1. 设计背景与目标

### 1.1 设计背景
- 本设计需求文档对应 PRD《Orders（收款记录）MVP》。
- Orders 模块为 merchant 提供“收款记录检索与追溯”的 Console 入口，支持对账、开通权限与排查支付问题。
- 交互需要与现有 Trace 详情保持一致：列表 + 右侧侧滑详情（保留上下文）。

### 1.2 设计目标
- 让用户在列表页用最少操作完成定位：按时间/商品/状态找到一笔订单并打开详情。
- 让详情面板的信息“可执行”：金额/状态/用户/商品一眼可读，关键字段可复制，且能一键跳转 Stripe 做更深排查。
- 让导出行为可预期：导出与筛选条件一致，且用户明确知道导出范围与行数上限。

---

## 2. 信息架构（IA）

### 2.1 模块定位（MVP 推荐）
- Console 左侧主导航保持不膨胀：将 Orders 作为 **Payments 模块下的子页面/页签**。
- 顶层导航参考：
  - Dashboard
  - Product Catalog
  - Payments
    - Orders（本次新增）
  - Finance
  - Settings
  - Developers（已存在，用于 API Keys）

### 2.2 Orders 子结构
- Orders
  - Orders 列表页（默认视图）
  - Order Detail（右侧侧滑面板，不作为独立路由页面）

---

## 3. 核心页面与布局

### 3.1 Orders 列表页

#### 3.1.1 有数据状态（默认）
- 页面顶部 Header：
  - 左侧：标题「Orders」+ 一句描述（可选）
  - 右侧：主按钮「Export CSV」
- 筛选/查询区（建议为单行可换行布局）：
  - Date range（必有）：默认 Last 7 days
  - Product filter（可选）：下拉选择
  - Status filter（可选）：All / Paid / Failed / Refunded / Partially refunded / Pending
- 列表区（表格）：
  - 表头字段（MVP 必须）：
    - Date
    - Product
    - Customer
    - Status
    - Amount
  - 行交互：
    - 点击整行：打开右侧 Order Detail 侧滑面板
- 分页：
  - 表格底部：page_size 选择（20/50/100）+ 页码

#### 3.1.2 空状态（无订单）
- 触发条件：当前筛选条件下无任何记录（或 merchant 从未产生订单）。
- 内容构成：
  - 图标/插画（轻量）
  - 标题：例如「No orders yet」
  - 描述：一句话说明 Orders 会展示什么
  - 行动建议（按钮/链接二选一）：
    - 跳转 Products：引导去创建/发布商品并生成收款链接
    - 跳转 Payments：引导去配置收款（视你们现有信息架构而定）

### 3.2 Order Detail（右侧侧滑面板）

#### 3.2.1 交互与尺寸
- 交互：从右侧滑出（Slide-over），覆盖列表的右侧部分，保留列表上下文。
- 关闭方式：
  - 面板右上角 Close
  - Esc 键（如已有通用支持）
  - 点击遮罩（如与 Trace 一致）

#### 3.2.2 信息结构（MVP 必须）
- 顶部 Header（需与截图保持一致的层级）：
  - 主标题：`amount + currency`（大号展示）
  - 副标题：`From {customer_email}`（优先 email；无 email 则展示其他用户标识）
  - 右上角：关闭按钮（X）
- Header 底部：`Begin refund` 功能按钮
- 板块一：Payment details
  - Status：Badge
  - Date received：`YYYY-MM-DD HH:mm`
  - Product：Product name
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

---

## 4. 关键组件与交互规范

### 4.1 Status Badge 规范
- Paid：绿色
- Failed：红色
- Pending：蓝色或灰蓝
- Refunded / Partially refunded：灰色（可带辅助图标）

### 4.2 筛选行为
- Date range、Product、Status：
  - 变更即触发刷新（避免用户找“Search”按钮）
- 查询条件需可被“看懂”：
  - 筛选区的组合不应隐藏在二级菜单内（除非窄屏折叠）

### 4.3 表格可读性
- Date：固定宽度，避免跳动
- Amount：右对齐，格式为 `amount + currency`（例如 99.99 USD）

---

## 5. 导出（Export CSV）交互

### 5.1 弹窗结构（MVP）
- 标题：Export orders
- 字段：
  - Date range（必填，默认当前范围）
  - Max rows（必填，下拉）：1,000 / 5,000 / 10,000（默认 5,000）
- 说明文案（简短一行）：
  - “Export will follow your current filters.”
- 按钮：
  - Cancel
  - Export（主按钮）

### 5.2 状态
- Export 中：按钮 loading，避免重复点击
- 导出失败：在弹窗内展示错误提示 + Retry
- 导出成功：触发下载（或显示可点击下载链接）

---

## 6. 状态、反馈与错误处理

### 6.1 Loading
- 列表加载：使用 skeleton table（保持表格布局不跳变）
- 详情加载：面板框架先出现，内容区 skeleton

### 6.2 Error
- 列表错误：表格区展示错误提示 + Retry（不影响筛选区）
- 详情错误：面板内展示错误提示 + Retry，同时保留关闭入口

### 6.3 数据延迟提示（如适用）
- 若系统存在分钟级同步延迟，在列表页筛选区附近展示轻提示（非阻断）：
  - “Data may be delayed by a few minutes.”

---

## 7. 响应式与可访问性

### 7.1 响应式（MVP 目标）
- 桌面优先；在笔记本宽度下：
  - 筛选区允许换行但保持可见
  - 表格允许横向滚动（避免压缩字段到不可读）
  - 侧滑面板宽度占比可自适应（例如 40%–50%）

### 7.2 可访问性
- Badge 颜色需配合文本，避免仅靠颜色区分状态
- 可复制按钮与外链按钮需要明确 hover/focus 样式

---

## 8. 设计交付物清单

- 页面级线框图：
  - Orders 列表页（含筛选区、表格与分页）
  - Orders 列表页空状态
  - Order Detail 侧滑面板（含退款与失败态）
  - Export CSV 弹窗
- 组件规格：
  - Filter bar（含 Date range、Status、Product）
  - Status badge 视觉规范
  - Copy-to-clipboard 的通用样式
- 状态稿：
  - Loading / Error / Empty state
