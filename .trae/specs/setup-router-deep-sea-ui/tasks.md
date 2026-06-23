# Tasks

- [x] Task 1: 配置项目基础结构（package.json / tsconfig / babel / metro）
  - [x] SubTask 1.1: 创建 package.json，配置 Expo SDK 51+ 及所有依赖
  - [x] SubTask 1.2: 配置 tsconfig.json（严格模式）
  - [x] SubTask 1.3: 配置 babel.config.js（NativeWind + Reanimated 插件）
  - [x] SubTask 1.4: 配置 metro.config.js（Expo Router + SVG 支持）
  - [x] SubTask 1.5: 创建 app.json（Expo 配置）

- [x] Task 2: 配置 Tailwind/NativeWind 主题
  - [x] SubTask 2.1: 创建 tailwind.config.js，扩展深海主题色
  - [x] SubTask 2.2: 创建全局样式入口文件

- [x] Task 3: 搭建 Expo Router 路由结构
  - [x] SubTask 3.1: 创建 app/_layout.tsx（根布局，DeepSeaBackground 包裹）
  - [x] SubTask 3.2: 创建 app/(tabs)/_layout.tsx（Tab 导航布局）
  - [x] SubTask 3.3: 创建 app/(tabs)/index.tsx（首页骨架）
  - [x] SubTask 3.4: 创建 app/(tabs)/ocean.tsx（海域页骨架）
  - [x] SubTask 3.5: 创建 app/(tabs)/profile.tsx（个人中心骨架）
  - [x] SubTask 3.6: 创建 app/bottle/[id].tsx（瓶子详情骨架）
  - [x] SubTask 3.7: 创建 app/chat/[conversationId].tsx（聊天页骨架）

- [x] Task 4: 实现核心 UI 组件
  - [x] SubTask 4.1: 实现 DeepSeaBackground 组件（Reanimated 深海粒子光斑）
  - [x] SubTask 4.2: 实现 GlassCard 组件（玻璃拟态 + 荧光描边）

# Task Dependencies
- Task 2 依赖 Task 1（依赖安装完成后配置 Tailwind）
- Task 3 依赖 Task 2（路由页面使用 Tailwind 样式）
- Task 4 与 Task 3 可并行执行
- 所有页面组件使用 Task 4 的 DeepSeaBackground 和 GlassCard
