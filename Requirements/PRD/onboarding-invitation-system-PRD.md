# 产品需求文档 (PRD)：Onboarding 登录与邀请码系统 (MVP)

| 文档信息 | 详情 |
| :--- | :--- |
| **项目** | Anyway - AI 商业化基础设施 |
| **模块** | 用户引导与访问控制 (Onboarding & Access Control) |
| **版本** | v1.0 (MVP) |
| **状态** | 草稿 (Draft) |
| **作者** | 产品经理 |
| **更新日期** | 2025-01-19 |

---

## 变更历史 (Changelog)

| 版本 | 日期 | 变更内容 | 作者 |
| :--- | :--- | :--- | :--- |
| v1.0 | 2025-01-19 | 初始版本，定义 MVP 内测阶段登录与邀请码系统 | 产品经理 |

---

## 1. 产品背景 (Product Background)

### 1.1 产品定位
Anyway 是专为 **AI 应用/开发者平台/API 转售初创公司和个人开发者** 设计的商业化基础设施产品，提供 **一站式解决方案来管理 API 成本、计价/定价和支付**。

### 1.2 核心问题
AI Startups 和开发者面临商业化困境：
- **成本不可控**：上游 AI 和数据供应商的使用量（如 LLM Token）难以准确追踪和核算
- **计费灵活性差**：传统 SaaS 计费工具（如 Stripe）无法处理可变的边际成本
- **集成成本高**：每次接入新的模型或数据 API 都需要重新开发计量和计费逻辑

### 1.3 MVP 内测目标
- **控制用户规模**：小规模测试（50 人以内），确保产品稳定性
- **验证核心价值**：通过高质量种子用户验证产品市场契合度（PMF）
- **快速迭代优化**：收集真实用户反馈，快速改进产品体验

---

## 2. 用户画像与目标 (User Personas & Goals)

### 2.1 目标用户

| 用户类型 | 描述 | 核心需求 |
| :--- | :--- | :--- |
| **个人开发者/独立开发者** | 个人开发者、学生、技术爱好者，对价格敏感，需要快速上手 | 低门槛接入、清晰的成本追踪、简单的计费逻辑 |
| **早期 AI 创业公司** | AIGC、API 转售等初创团队，有明确的商业化需求 | 完善的计费系统、灵活的定价策略、可扩展的架构 |

### 2.2 用户旅程

**旅程 A：有邀请码的用户（直接注册）**
1. 访问 anyway.sh 首页
2. 点击右上角「Get Started」
3. 输入邮箱地址
4. 输入 5 位数字邀请码
5. 收到 Magic Link 邮件
6. 点击邮件中的链接完成验证
7. 直接进入 Dashboard 开始使用

**旅程 B：无邀请码的用户（申请访问）**
1. 访问 anyway.sh 首页
2. 点击右上角「Get Started」
3. 输入邮箱地址
4. 点击「Request Access」
5. 填写申请表单（姓名、邮箱、公司、使用场景）
6. 收到申请确认邮件
7. 等待运营审核
8. 审核通过后收到邀请码邮件
9. 回到旅程 A 的步骤 4

---

## 3. 功能需求 (Functional Requirements)

### 3.1 登录/注册流程

#### 3.1.1 入口位置
- **位置**：[anyway.sh](http://anyway.sh) 首页右上角
- **文案**：将「Request Demo」改为「Get Started」
- **样式**：主按钮样式（Primary Button）

#### 3.1.2 登录页面布局

**页面元素：**
1. 标题：「Get Started with Anyway」
2. 副标题：「Manage API costs, billing, and payments in one place」
3. 邮箱输入框
4. 两个选项按钮：
   - 选项 A：「I have an invitation code」（我有一个邀请码）
   - 选项 B：「Request Access」（申请访问权限）
5. 底部说明：「By continuing, you agree to our Terms of Service and Privacy Policy」

#### 3.1.3 邀请码登录路径

**步骤 1：输入邮箱**
- 用户输入邮箱地址
- 前端验证邮箱格式
- 点击「Continue」按钮

**步骤 2：输入邀请码**
- 如果用户选择「I have an invitation code」
- 显示邀请码输入框（5 位数字）
- 显示「Submit」按钮

**步骤 3：发送 Magic Link**
- 后端验证邀请码有效性
- 如果邀请码有效：
  - 检查邮箱是否已注册
  - 发送 Magic Link 到用户邮箱
  - 显示成功提示：「Check your email for a magic link to log in」
- 如果邀请码无效（已使用、不存在、过期）：
  - 显示模糊错误提示：「Invalid invitation code. Please contact support.」
  - **重要**：不区分具体错误原因，防止恶意试探

**步骤 4：Magic Link 验证**
- 用户点击邮件中的链接
- 后端验证链接有效性（有效期 15 分钟）
- 创建 Session（有效期 7 天）
- 重定向到 Dashboard

#### 3.1.4 Request Access 路径

**步骤 1：填写申请表单**
- 如果用户选择「Request Access」
- 显示表单，包含以下字段：
  - **Full Name**（姓名）- 必填
  - **Email**（邮箱）- 必填，预填步骤 1 输入的邮箱
  - **Company Name**（公司名称）- 必填
  - **Use Case**（使用场景）- 必填，文本框（最多 500 字）
  - **How did you hear about us?**（了解渠道）- 选填，下拉选择（Direct、Twitter、LinkedIn、Friend、Other）
- 显示「Submit Request」按钮

**步骤 2：提交申请**
- 前端验证必填字段
- 后端存储申请数据到数据库
- 发送确认邮件到用户邮箱
- 显示成功提示：「Thank you for your interest! We'll review your application and get back to you soon.」

**步骤 3：运营审核**
- 运营人员定期查看数据库中的申请记录
- 评估申请人是否符合目标用户画像
- 决定是否批准

**步骤 4：批准通知**
- 如果批准：
  - 运营人员生成 5 位数字邀请码
  - 在 Notion 记录邀请码、邮箱、客户信息
  - 手动发送邮件附邀请码
  - 更新数据库中申请状态为「Approved」
- 如果拒绝：
  - 发送拒绝邮件
  - 更新数据库中申请状态为「Rejected」

---

### 3.2 邀请码机制

#### 3.2.1 邀请码生成规则
- **格式**：5 位数字（00000-99999）
- **生成方式**：后端随机生成
- **唯一性**：全局唯一，数据库唯一索引约束
- **批量生成**：运营人员可以在数据库中批量生成邀请码（如一次生成 50 个）

#### 3.2.2 使用规则
- **一次性有效**：邀请码使用后立即标记为已使用，不可重复使用
- **邮箱绑定**：一个邮箱对应一个邀请码，注册后邮箱与邀请码绑定
- **永不过期**：邀请码在未使用前永久有效
- **撤销机制**：运营人员可在数据库中手动删除未使用的邀请码

#### 3.2.3 邀请码状态管理
邀请码有以下状态：
- **PENDING**（未使用）：邀请码已生成，尚未被使用
- **USED**（已使用）：邀请码已被用户使用
- **REVOKED**（已撤销）：邀请码被运营人员手动撤销

#### 3.2.4 错误处理
所有错误情况统一返回模糊提示：「Invalid invitation code. Please contact support.」

具体错误场景包括：
- 邀请码不存在
- 邀请码已被使用
- 邀请码已被撤销
- 邀请码格式错误（非 5 位数字）

**安全考虑**：不区分具体错误原因，防止恶意用户通过枚举探测有效邀请码。

---

### 3.3 会话管理

#### 3.3.1 Session 机制
- **认证方式**：Magic Link（无密码登录）
- **Session 有效期**：7 天
- **Session 存储**：HTTP-only Cookie
- **多设备登录**：允许同一邮箱在多个设备/浏览器同时登录
- **Session 续期**：用户活跃时自动续期（每次请求后重置 7 天倒计时）

#### 3.3.2 登出机制
- **主动登出**：用户点击「Log Out」按钮，清除 Session
- **被动登出**：Session 7 天后自动过期
- **全局登出**：如需强制用户重新登录，可在后端使 Session 失效

---

### 3.4 邮件通知

#### 3.4.1 Magic Link 邮件

**触发场景**：用户输入有效邀请码后

**邮件内容**：
```
Subject: Log in to Anyway

Hi [Name],

Click the link below to log in to Anyway:

[Log in to Anyway - Button]

This link will expire in 15 minutes.

If you didn't request this link, please ignore this email.

---
Anyway Team
```

#### 3.4.2 申请确认邮件

**触发场景**：用户提交 Request Access 表单后

**邮件内容**：
```
Subject: Thank you for your interest in Anyway!

Hi [Name],

Thank you for your interest in Anyway! We've received your application and will review it shortly.

We're currently in private beta mode and carefully selecting participants to ensure the best experience for our early users.

We'll get back to you within [X] business days.

Best regards,
The Anyway Team
```

#### 3.4.3 申请批准邮件（运营手动发送）

**触发场景**：运营审核通过后手动发送

**邮件内容**：
```
Subject: You're invited to Anyway's Private Beta!

Hi [Name],

Great news! Your application has been approved.

Here's your invitation code: [CODE]

To get started:
1. Visit anyway.sh
2. Click "Get Started"
3. Enter your email
4. Enter your invitation code: [CODE]
5. Check your email for a magic link to log in

If you have any questions, feel free to reply to this email.

Looking forward to your feedback!
The Anyway Team
```

---

## 4. 数据模型 (Data Model)

### 4.1 users 表（用户表）

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | 用户唯一标识 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 用户邮箱 |
| full_name | VARCHAR(100) | | 用户姓名 |
| invitation_code | VARCHAR(5) | FOREIGN KEY | 使用的邀请码 |
| created_at | TIMESTAMP | NOT NULL | 注册时间 |
| last_login_at | TIMESTAMP | 最后登录时间 |
| email_verified | BOOLEAN | DEFAULT FALSE | 邮箱是否已验证 |

### 4.2 invitation_codes 表（邀请码表）

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| code | VARCHAR(5) | PRIMARY KEY | 5 位邀请码 |
| status | ENUM | NOT NULL | 状态：PENDING/USED/REVOKED |
| created_at | TIMESTAMP | NOT NULL | 生成时间 |
| used_at | TIMESTAMP | 使用时间 |
| used_by | UUID | FOREIGN KEY | 使用的用户 ID |
| created_by | VARCHAR(100) | 创建人（运营人员） |
| category | VARCHAR(50) | 邀请码分类（预留字段） |

### 4.3 access_requests 表（访问申请表）

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | 申请唯一标识 |
| full_name | VARCHAR(100) | NOT NULL | 申请人姓名 |
| email | VARCHAR(255) | NOT NULL | 申请人邮箱 |
| company_name | VARCHAR(255) | | 公司名称 |
| use_case | TEXT | | 使用场景描述 |
| source | VARCHAR(50) | 了解渠道 |
| status | ENUM | NOT NULL | 状态：PENDING/APPROVED/REJECTED |
| submitted_at | TIMESTAMP | NOT NULL | 提交时间 |
| reviewed_at | TIMESTAMP | 审核时间 |
| reviewed_by | VARCHAR(100) | 审核人（运营人员） |
| invitation_code | VARCHAR(5) | 分配的邀请码 |

### 4.4 sessions 表（会话表）

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | Session ID |
| user_id | UUID | FOREIGN KEY, NOT NULL | 用户 ID |
| token | VARCHAR(255) | UNIQUE, NOT NULL | Session Token |
| expires_at | TIMESTAMP | NOT NULL | 过期时间 |
| created_at | TIMESTAMP | NOT NULL | 创建时间 |

---

## 5. 非功能需求 (Non-Functional Requirements)

### 5.1 安全性

#### 5.1.1 邀请码安全
- **模糊提示**：所有邀请码错误统一返回「Invalid invitation code」，不区分具体原因
- **防暴力破解**：
  - 同一 IP 限制：每分钟最多尝试 5 次
  - 同一邮箱限制：每天最多尝试 10 次
- **唯一性约束**：数据库层面保证邀请码全局唯一

#### 5.1.2 Magic Link 安全
- **有效期**：Magic Link 15 分钟后自动失效
- **一次性使用**：Magic Link 使用后立即失效
- **HTTP-only Cookie**：防止 XSS 攻击
- **CSRF 保护**：所有 POST 请求需要 CSRF Token

#### 5.1.3 数据保护
- **密码存储**：不存储密码（Magic Link 机制）
- **敏感数据加密**：数据库连接字符串、API 密钥加密存储
- **日志脱敏**：日志中不记录邮箱、邀请码等敏感信息

### 5.2 性能要求

| 指标 | 目标值 |
| :--- | :--- |
| **Magic Link 发送延迟** | < 3 秒 |
| **登录页面加载时间** | < 1 秒 |
| **邮件送达率** | > 95% |
| **数据库查询时间** | < 100 ms |

### 5.3 可用性

- **正常运行时间**：99.5% （每月允许停机约 3.6 小时）
- **备份频率**：每日自动备份数据库
- **灾难恢复**：RTO（恢复时间目标）< 4 小时

---

## 6. 运营管理 (Operations)

### 6.1 邀请码管理流程

#### 6.1.1 生成邀请码
1. 运营人员直接在数据库中批量生成邀请码
2. SQL 示例：
   ```sql
   INSERT INTO invitation_codes (code, status, created_at, created_by)
   VALUES
   ('12345', 'PENDING', NOW(), 'admin@anyway.sh'),
   ('12346', 'PENDING', NOW(), 'admin@anyway.sh'),
   -- ... 批量插入
   ```

#### 6.1.2 记录邀请码
1. 在 Notion 中创建「邀请码追踪」表格
2. 表格字段：
   - 邀请码
   - 分配对象（邮箱/姓名）
   - 发放时间
   - 使用状态（未使用/已使用）
   - 使用时间
   - 备注

#### 6.1.3 发放邀请码
1. 运营人员根据申请记录或个人判断发放邀请码
2. 手动发送邮件附邀请码
3. 在 Notion 中记录发放信息

### 6.2 申请审核流程

#### 6.2.1 查看申请
1. 运营人员定期查询数据库中的待审核申请
2. SQL 示例：
   ```sql
   SELECT * FROM access_requests
   WHERE status = 'PENDING'
   ORDER BY submitted_at DESC;
   ```

#### 6.2.2 评估标准
- 是否符合目标用户画像（个人开发者或早期 AI 创业公司）
- 使用场景是否与 Anyway 产品定位匹配
- 是否有明确的商业化需求

#### 6.2.3 审核决定
- **批准**：
  1. 生成邀请码（从未使用的邀请码中取一个）
  2. 更新申请状态为「APPROVED」
  3. 发送批准邮件附邀请码
  4. 在 Notion 记录邀请码发放信息
- **拒绝**：
  1. 更新申请状态为「REJECTED」
  2. 发送拒绝邮件（可选）

---

## 7. 边界情况与异常处理 (Edge Cases & Error Handling)

### 7.1 邀请码相关

| 场景 | 处理方式 | 用户提示 |
| :--- | :--- | :--- |
| 邀请码已使用 | 检查 invitation_codes 表 status = 'USED' | Invalid invitation code. Please contact support. |
| 邀请码不存在 | 查询数据库无此邀请码 | Invalid invitation code. Please contact support. |
| 邀请码格式错误 | 非 5 位数字 | Invalid invitation code. Please contact support. |
| 邀请码已撤销 | status = 'REVOKED' | Invalid invitation code. Please contact support. |
| 邀请码已被其他邮箱使用 | used_by 字段非空但非当前邮箱 | Invalid invitation code. Please contact support. |

### 7.2 邮箱相关

| 场景 | 处理方式 | 用户提示 |
| :--- | :--- | :--- |
| 邮箱已注册 | 检查 users 表中 email 是否存在 | 如果邮箱已注册，Magic Link 会登录到现有账户 |
| 邮箱格式错误 | 前端验证 | Please enter a valid email address. |
| 邮箱域名不存在 | SMTP 验证（可选） | Unable to send email. Please check your email address. |

### 7.3 Magic Link 相关

| 场景 | 处理方式 | 用户提示 |
| :--- | :--- | :--- |
| Magic Link 已使用 | 检查 sessions 表 | This link has already been used. Please request a new one. |
| Magic Link 已过期 | 检查 expires_at < NOW() | This link has expired. Please request a new one. |
| Magic Link 无效 | Token 不存在于数据库 | Invalid link. Please request a new one. |

### 7.4 申请流程相关

| 场景 | 处理方式 | 用户提示 |
| :--- | :--- | :--- |
| 邮箱已提交过申请 | 检查 access_requests 表中 email + PENDING 状态 | You already have a pending application. We'll review it shortly. |
| 表单字段缺失 | 前端验证 | Please fill in all required fields. |
| 使用场景过长 | 前端限制 500 字 | Use case must be less than 500 characters. |

### 7.5 邮件发送失败

| 场景 | 处理方式 |
| :--- | :--- |
| 邮件服务不可用 | 1. 重试 3 次（指数退避）<br>2. 仍失败则记录日志<br>3. 返回友好错误提示 |
| 邮箱地址无效 | 1. SMTP 验证失败<br>2. 返回错误提示<br>3. 不创建用户记录 |
| 邮件被标记为垃圾邮件 | 1. 监控邮件送达率<br>2. 配置 SPF/DKIM/DMARC<br>3. 提供白名单说明 |

---

## 8. 用户界面规范 (UI/UX Guidelines)

### 8.1 登录页面设计

#### 8.1.1 设计原则
- **简洁性**：最小化表单字段，减少用户输入负担
- **清晰性**：明确的视觉层次和操作指引
- **一致性**：与 Anyway 品牌设计系统保持一致

#### 8.1.2 页面元素规范

**邮箱输入框：**
- Placeholder：「Enter your email」
- 验证：实时验证邮箱格式
- 错误提示：「Please enter a valid email address」

**邀请码输入框：**
- Placeholder：「Enter 5-digit code」
- 限制：仅允许输入数字
- 格式：自动格式化为 XXXXX（如 12345）

**按钮：**
- 主按钮：「Continue」「Submit」
- 次要按钮：「Request Access」
- 加载状态：显示 Spinner，禁用按钮

#### 8.1.3 交互细节

**输入邮箱后：**
1. 用户点击「Continue」
2. 按钮显示加载状态（Spinner）
3. 1-2 秒后显示两个选项卡片
4. 用户选择其中一个路径

**输入邀请码后：**
1. 用户点击「Submit」
2. 按钮显示加载状态
3. 后端验证邀请码
4. 显示成功提示或错误提示
5. 成功后发送邮件

**Magic Link 点击后：**
1. 打开新标签页或重定向当前页面
2. 显示「Logging you in...」加载页面
3. 验证成功后重定向到 Dashboard

### 8.2 成功与错误提示

#### 8.2.1 Toast 通知规范

**成功提示：**
- 背景色：绿色
- 图标：✓ Checkmark
- 显示时长：5 秒
- 位置：页面顶部中央

**错误提示：**
- 背景色：红色
- 图标：✕ Close
- 显示时长：10 秒
- 可手动关闭

#### 8.2.2 页面级提示

**邮件发送成功：**
```
✓ Check your email for a magic link to log in

The link will expire in 15 minutes.
Didn't receive it? Check your spam folder or [Resend email].
```

**申请提交成功：**
```
✓ Thank you for your interest!

We've received your application and will review it shortly.
We'll get back to you within [X] business days.
```

---

## 9. 技术实现建议 (Technical Implementation Notes)

### 9.1 技术栈建议
- **前端框架**：React / Next.js
- **后端框架**：Node.js / Next.js API Routes
- **数据库**：PostgreSQL
- **ORM**：Prisma
- **邮件服务**：SendGrid / Mailgun / Resend
- **Session 管理**：Iron-Session / NextAuth.js
- **验证库**：Zod（表单验证）

### 9.2 数据库索引建议
```sql
-- users 表索引
CREATE INDEX idx_users_email ON users(email);

-- invitation_codes 表索引
CREATE INDEX idx_invitation_codes_status ON invitation_codes(status);
CREATE INDEX idx_invitation_codes_code ON invitation_codes(code);

-- access_requests 表索引
CREATE INDEX idx_access_requests_status ON access_requests(status);
CREATE INDEX idx_access_requests_email ON access_requests(email);
CREATE INDEX idx_access_requests_submitted_at ON access_requests(submitted_at);

-- sessions 表索引
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### 9.3 关键 API 端点

| 端点 | 方法 | 描述 |
| :--- | :--- | :--- |
| /api/auth/send-magic-link | POST | 发送 Magic Link 到邮箱 |
| /api/auth/verify-magic-link | GET | 验证 Magic Link 并创建 Session |
| /api/auth/submit-access-request | POST | 提交访问申请 |
| /api/auth/logout | POST | 登出，清除 Session |
| /api/auth/session | GET | 获取当前 Session 信息 |

---

## 10. 验收标准 (Acceptance Criteria)

### 10.1 功能完整性测试

- [ ] 用户可以通过邮箱 + 邀请码登录
- [ ] 用户可以提交访问申请
- [ ] Magic Link 可以正常验证并登录
- [ ] 邀请码一次性有效，使用后失效
- [ ] 邀请码错误时显示模糊提示
- [ ] Session 有效期为 7 天
- [ ] 用户可以在多个设备同时登录
- [ ] 邮件正常发送（Magic Link、申请确认）

### 10.2 用户体验测试

- [ ] 登录页面加载时间 < 1 秒
- [ ] 表单验证实时反馈
- [ ] 错误提示清晰友好
- [ ] 成功提示明确下一步操作
- [ ] Magic Link 邮件 3 秒内送达

### 10.3 安全性测试

- [ ] 邀请码错误统一返回模糊提示
- [ ] 暴力破解防护有效（IP 和邮箱限流）
- [ ] Magic Link 15 分钟后过期
- [ ] Magic Link 一次性使用
- [ ] Session Cookie 为 HTTP-only
- [ ] CSRF 保护有效

### 10.4 边界情况测试

- [ ] 邀请码已使用时正确处理
- [ ] 邀请码不存在时正确处理
- [ ] 邮箱已注册时正确处理（登录到现有账户）
- [ ] Magic Link 过期时正确处理
- [ ] 邮件发送失败时正确处理
- [ ] 同一邮箱重复提交申请时正确处理

---

## 11. 未来扩展 (Post-MVP Features)

### 11.1 推荐奖励机制
**目标**：通过用户推荐实现病毒式增长

**功能描述：**
- 每个用户获得唯一的推荐链接
- 被推荐用户注册并活跃后，推荐人获得奖励
- 奖励可以是：免费额度、延长试用期、折扣优惠等

**实现要点：**
- 在 users 表添加 `referral_code` 字段（推荐码）
- 在 users 表添加 `referred_by` 字段（推荐人 ID）
- 追踪推荐转化率和奖励发放

### 11.2 邀请码分类
**目标**：对不同类型用户进行分层管理

**功能描述：**
- 支持创建不同类别的邀请码（个人版、企业版、VIP）
- 不同类别邀请码对应不同的权限和功能
- 便于后续分析和精细化运营

**实现要点：**
- 在 invitation_codes 表添加 `category` 字段
- 不同类别邀请码使用不同的前缀（如 P-12345 个人版，E-12345 企业版）
- Dashboard 根据用户类别显示不同功能

### 11.3 SSO 登录
**目标**：提供更便捷的登录方式

**功能描述：**
- 支持 Google OAuth 登录
- 支持 GitHub OAuth 登录
- 保留 Magic Link 作为备选方案

### 11.4 试用期机制
**目标**：降低试用门槛，吸引更多用户

**功能描述：**
- 无需邀请码即可注册试用
- 试用期 14 天，到期后需付费或使用邀请码
- 试用期间功能受限（如 API 调用次数限制）

---

## 12. 成功指标 (Success Metrics)

### 12.1 MVP 内测期间指标

| 指标 | 目标值 | 说明 |
| :--- | :--- | :--- |
| **注册用户数** | 50 人 | 控制在 50 人以内的小规模测试 |
| **邀请码使用率** | > 80% | 已发放邀请码中使用的比例 |
| **申请转化率** | > 30% | 申请用户中批准的比例 |
| **激活率** | > 60% | 注册用户中至少使用一次核心功能的比例 |
| **邮件送达率** | > 95% | Magic Link 邮件成功送达的比例 |

### 12.2 用户行为指标

| 指标 | 测量方式 |
| :--- | :--- |
| **从注册到首次使用的时间** | 注册时间到第一次 API 调用的时间差 |
| **7 天留存率** | 注册后 7 天内仍活跃的用户比例 |
| **用户反馈质量** | 收集的用户反馈数量和质量 |

---

## 13. 风险与缓解措施 (Risks & Mitigation)

### 13.1 邀请码泄露风险
**风险描述**：用户公开分享邀请码，导致不可控的用户增长

**缓解措施：**
- 监控邀请码使用频率，异常使用时及时撤销
- 在服务条款中明确禁止分享邀请码
- 如发现泄露，立即撤销相关邀请码

### 13.2 邮件送达率低
**风险描述**：Magic Link 邮件被标记为垃圾邮件，影响用户体验

**缓解措施：**
- 配置 SPF、DKIM、DMARC 记录
- 监控邮件送达率和垃圾邮件投诉率
- 提供白名单说明，引导用户添加到联系人

### 13.3 恶意申请
**风险描述**：恶意用户大量提交申请，增加运营负担

**缓解措施：**
- 同一 IP 限制申请频率（如每天最多 3 次）
- 使用 reCAPTCHA 防止机器人批量申请
- 建立黑名单机制

### 13.4 数据库性能瓶颈
**风险描述**：用户增长导致数据库查询变慢

**缓解措施：**
- 提前建立数据库索引
- 监控慢查询，及时优化
- 必要时进行数据库分片或读写分离

---

## 14. 相关文档 (Related Documents)

- [Anyway Product Background](../Anyway%20Product%20Background)
- [Anyway Design System](../Anyway_Design_System.md)
- [Dashboard Agent Actions Tracking PRD](./Dashboard_Agent_Actions_Tracking_PRD_Optimized_CN.md)
- [Orders PRD](./orders-PRD.md)
- [Finance PRD](./finance-PRD.md)

---

## 15. 附录 (Appendix)

### 15.1 竞品参考
以下为竞品登录界面截图（仅供设计参考）：

*[请插入竞品登录界面截图]*

### 15.2 邮件模板示例
详见第 3.4 节「邮件通知」

### 15.3 数据库 Schema（SQL）
详见第 4 节「数据模型」

---

**文档结束**
