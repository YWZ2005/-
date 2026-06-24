# Tasks

- [ ] Task 1: 更新数据库与类型定义
  - [ ] SubTask 1.1: 新增数据库迁移脚本 002（docked 状态、knock 消息类型）
  - [ ] SubTask 1.2: 更新 types/database.ts
  - [ ] SubTask 1.3: 更新 types/index.ts
  - [ ] SubTask 1.4: 更新 lib/constants.ts（靠岸阈值等）

- [ ] Task 2: 实现 useChat Hook
  - [ ] SubTask 2.1: 实现消息列表拉取（分页/初始加载）
  - [ ] SubTask 2.2: 实现 Supabase Realtime INSERT 订阅
  - [ ] SubTask 2.3: 实现 sendMessage 方法
  - [ ] SubTask 2.4: 实现女性友好敲门机制（性别判断 + 输入锁定）
  - [ ] SubTask 2.5: 实现 sendKnock 敲门消息方法

- [ ] Task 3: 实现 useDocking Hook
  - [ ] SubTask 3.1: 实现互动轮次计数逻辑
  - [ ] SubTask 3.2: 实现靠岸状态检测与触发
  - [ ] SubTask 3.3: 实现更新 conversations.status = 'docked'
  - [ ] SubTask 3.4: 实现解锁双人专属海域资产

- [ ] Task 4: 实现聊天相关 UI 组件
  - [ ] SubTask 4.1: 实现 ParchmentBubble 羊皮纸消息气泡
  - [ ] SubTask 4.2: 实现 DockingAnimation 全屏共振动画
  - [ ] SubTask 4.3: 实现 KnockAnimation 敲门动画组件
  - [ ] SubTask 4.4: 创建 components/chat/index.ts 统一导出

- [ ] Task 5: 更新聊天页面
  - [ ] SubTask 5.1: 重写 chat/[conversationId].tsx（FlatList + Realtime + 靠岸）

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 2（需要消息数据）
- Task 4 与 Task 2、Task 3 可并行
- Task 5 依赖 Task 2、Task 3、Task 4
