# Claude Code Bug Log

记录项目开发过程中遇到的bug和解决方案。

## Bug #1: ProductDetailPage 无法渲染

**日期**: 2026-01-19

**症状**:
- 点击产品列表中的产品后，ProductDetailPage 显示空白页面
- 浏览器控制台可能有运行时错误

**根本原因**:
在重构 ProductDetailPage 时，删除了 Pricing Summary 模块，但遗漏了导入清理：
- 代码中第 225 行使用了 `formatDateTime(product.updatedAt)` 函数
- 但在第 11 行的导入语句中只导入了 `formatDate` 和 `formatPrice`，缺少 `formatDateTime`

**错误代码片段**:
```typescript
// line 11 - 缺少 formatDateTime 导入
import { formatDate, formatPrice } from '../utils';

// line 225 - 使用了未导入的函数
<p className="text-sm text-neutral-600 mt-1">{formatDateTime(product.updatedAt)}</p>
```

**修复方案**:
在导入语句中添加 `formatDateTime`:

```typescript
import { formatDate, formatDateTime, formatPrice } from '../utils';
```

**教训**:
1. 删除代码模块时，要检查整个文件中是否还有其他地方使用了相关导入的函数
2. 使用 IDE 的 "Find Usages" 功能可以快速定位所有使用某个函数的地方
3. 重构后应该立即测试页面是否能正常渲染

**相关文件**:
- `/pages/ProductDetailPage.tsx`

---

## Bug #2: PaymentLinksList 组件变量引用错误

**日期**: 2026-01-19

**症状**:
- ProductDetailPage 无法渲染
- React 运行时错误：`linkId is not defined`

**根本原因**:
在 PaymentLinksList 组件中，使用了未定义的变量 `linkId`，应该是 `link.payment_link_id`

**错误代码片段**:
```typescript
// line 138-139 (桌面视图)
const isCopied = copiedLinkId === linkId;  // ❌ linkId 未定义
const isDeleting = deleteConfirmId === linkId;

// line 291-292 (移动视图)
const isCopied = copiedLinkId === linkId;  // ❌ 同样的错误
const isDeleting = deleteConfirmId === linkId;
```

**修复方案**:
将 `linkId` 改为 `link.payment_link_id`:

```typescript
// 桌面视图
const isCopied = copiedLinkId === link.payment_link_id;
const isDeleting = deleteConfirmId === link.payment_link_id;

// 移动视图
const isCopied = copiedLinkId === link.payment_link_id;
const isDeleting = deleteConfirmId === link.payment_link_id;
```

**教训**:
1. 在 map 循环中，要始终使用 `link.xxx` 而不是 `linkId` 这样的缩写变量
2. TypeScript 可以帮助捕获这类错误，确保开启了严格类型检查
3. 组件代码重复的地方（桌面/移动视图），bug 也会重复出现

**相关文件**:
- `/components/PaymentLinksList.tsx`

---

## 更新日志

### 2026-01-19
- 修复了 ProductDetailPage 的 formatDateTime 导入缺失问题
- 修复了 PaymentLinksList 组件中的 linkId 变量引用错误
- 删除了 ProductDetailPage 的 Pricing Summary 模块
- 移除了 ProductDetailPage 右上角的 "Create payment link" 按钮
- 实现了 Payment Link Wizard 的完整 UI/UX 流程

### 2026-01-19 (早期)
- 完成了 Products Module 的 PRD v2.0 重构
- 实现了 2-step Product Create Wizard
- 实现了 Pricing Assistant 组件（8个状态）
- 实现了 Revenue Model Selector 组件
- 创建了 Payment Link Wizard 页面
- 更新了数据模型（Product, Price, PaymentLink 分离）
