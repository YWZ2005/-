# 星海漂流路由结构与深海 UI 系统 Spec

## Why
"星海漂流"作为沉浸式情感社区 App，需要一套统一的深海视觉语言和清晰的路由架构。良好的视觉系统是营造沉浸感的关键，而 Expo Router 的文件路由则为跨端导航提供了优雅的解决方案。

## What Changes
- 搭建 Expo Router 路由结构（app/ 目录）
  - `(tabs)/index.tsx`: 首页（扔/捞按钮主视觉）
  - `(tabs)/ocean.tsx`: 我的海域（养成图鉴）
  - `(tabs)/profile.tsx`: 个人中心
  - `bottle/[id].tsx`: 瓶子详情页
  - `chat/[conversationId].tsx`: 聊天私信页
- 配置 NativeWind/Tailwind 主题扩展（深海色系）
- 实现 `<DeepSeaBackground />` 全局背景组件（深海粒子光斑动效）
- 实现 `<GlassCard />` 玻璃拟态基础组件

## Impact
- Affected specs: 全局 UI 系统、导航系统
- Affected code: app/ 目录所有页面、components/ui/ 目录、tailwind.config.js

## ADDED Requirements

### Requirement: 路由结构
系统 SHALL 提供基于 Expo Router 的文件式路由结构，包含 3 个 Tab 页和 2 个详情页。

#### Scenario: Tab 导航
- **WHEN** 用户在底部 Tab 栏切换
- **THEN** 页面在首页/海域/个人中心之间切换，保持状态

#### Scenario: 瓶子详情跳转
- **WHEN** 用户点击打开瓶子
- **THEN** 跳转到 bottle/[id] 页面，展示瓶子内容

### Requirement: 深海主题色
系统 SHALL 在 tailwind.config.js 中扩展深海主题色系：
- 深渊蓝 (Deep Sea): #0B132B
- 午夜蓝 (Midnight): #1C2541
- 荧光绿 (Bioluminescent): #5BC0BE
- 晨曦黄 (Dawn): #FFD166
- 玻璃拟态背景 (Glass): rgba(255, 255, 255, 0.05)

#### Scenario: 主题色使用
- **WHEN** 组件需要使用深海主题色
- **THEN** 通过 Tailwind class 直接引用（如 bg-deepSea、text-bioluminescent）

### Requirement: DeepSeaBackground 组件
系统 SHALL 提供 DeepSeaBackground 组件，使用 react-native-reanimated 实现缓慢流动的深海粒子光斑效果，作为所有页面的底层背景。

#### Scenario: 页面背景
- **WHEN** 页面渲染时
- **THEN** DeepSeaBackground 作为绝对定位的底层视图，呈现深海粒子光斑缓慢漂浮的动画效果

### Requirement: GlassCard 组件
系统 SHALL 提供 GlassCard 基础组件，实现深海玻璃拟态效果（半透明背景、微弱荧光描边、背景模糊）。

#### Scenario: 卡片容器
- **WHEN** 页面需要玻璃拟态卡片容器
- **THEN** 使用 GlassCard 组件包裹内容，呈现半透明 + 荧光描边 + 模糊的深海玻璃效果
