# 扔瓶/捞瓶核心交互 Spec

## Why
扔瓶和捞瓶是"星海漂流"最核心的用户行为，需要完善的业务逻辑（每日限制、暗海隔离、兴趣匹配）和流畅的动效交互（抛物线抛出、雷达扫描），打造沉浸式体验。

## What Changes
- 创建 Supabase 客户端配置 (`lib/supabase.ts`)
- 创建数据库类型定义 (`types/database.ts`)
- 实现 `useBottle` Hook，包含 throwBottle（含每日3次限制）和 fishBottle（暗海隔离+权重匹配）
- 创建 `BottomDrawer` 组件（扔瓶选择器：文字/语音/手绘）
- 创建 `ThrowAnimation` 组件（瓶子抛物线抛出动画）
- 创建 `RadarScan` 组件（捞瓶雷达扫描动画）
- 更新首页 `index.tsx` 整合扔瓶/捞瓶交互
- 添加 expo-av、expo-haptics 依赖

## Impact
- Affected specs: 漂流瓶核心流程
- Affected code: app/(tabs)/index.tsx、hooks/、components/、lib/

## ADDED Requirements

### Requirement: useBottle.throwBottle
系统 SHALL 提供 throwBottle 方法，写入 bottles 表为 floating 状态，包含每日3次限制校验。

#### Scenario: 扔瓶成功
- **WHEN** 用户今日扔瓶数 < 3 且内容合法
- **THEN** 写入 bottles 表，status=floating，返回成功

#### Scenario: 超过每日限制
- **WHEN** 用户今日已扔3个瓶子
- **THEN** 抛出错误，提示"今日扔瓶次数已用完"

### Requirement: useBottle.fishBottle
系统 SHALL 提供 fishBottle 方法，随机捞取 floating 状态的瓶子，支持暗海隔离和权重匹配。

#### Scenario: 低信用分用户捞瓶
- **WHEN** 用户信用分 < 60
- **THEN** 只能捞到信用分 < 60 用户扔出的瓶子

#### Scenario: 捞瓶成功
- **WHEN** 有可捞取的瓶子
- **THEN** 随机获取一个，更新 status=fished 并设置 fisher_id，返回瓶子数据

### Requirement: 扔瓶底部抽屉
系统 SHALL 提供底部抽屉组件，选择文字/语音/手绘三种扔瓶方式。

### Requirement: 抛瓶动画
系统 SHALL 使用 Reanimated 实现瓶子抛物线抛出并缩小的物理动画，配合 expo-haptics 震动反馈。

### Requirement: 雷达扫描动画
系统 SHALL 实现雷达扫描动画，在捞瓶过程中展示，完成后跳转到瓶子详情页。
