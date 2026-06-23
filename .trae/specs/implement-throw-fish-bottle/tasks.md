# Tasks

- [x] Task 1: 创建基础设施（Supabase客户端 + 类型定义 + 依赖配置）
  - [x] SubTask 1.1: 创建 lib/supabase.ts 客户端实例
  - [x] SubTask 1.2: 创建 types/database.ts 数据库类型定义
  - [x] SubTask 1.3: 创建 types/index.ts 业务类型定义
  - [x] SubTask 1.4: 创建 lib/constants.ts 常量
  - [x] SubTask 1.5: 更新 package.json 添加 expo-av、expo-haptics、async-storage、url-polyfill

- [x] Task 2: 实现 useBottle Hook
  - [x] SubTask 2.1: 实现 throwBottle（每日3次限制 + 写入 bottles）
  - [x] SubTask 2.2: 实现 fishBottle（暗海隔离 + 权重随机 + 原子更新）

- [x] Task 3: 实现 UI 交互组件
  - [x] SubTask 3.1: 实现 BottomDrawer 底部抽屉组件
  - [x] SubTask 3.2: 实现 ThrowBottleAnimation 抛物线动画组件
  - [x] SubTask 3.3: 实现 RadarScan 雷达扫描动画组件
  - [x] SubTask 3.4: 创建文字扔瓶弹窗（TextBottleSheet）

- [x] Task 4: 更新首页整合交互
  - [x] SubTask 4.1: 更新 app/(tabs)/index.tsx 整合所有交互逻辑

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 可与 Task 2 并行
- Task 4 依赖 Task 2 和 Task 3
