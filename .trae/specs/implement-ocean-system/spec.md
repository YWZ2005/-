# 海域养成数值系统 Spec

## Why
海域养成是游戏化社交的核心机制，将用户的社交行为（扔瓶、捞瓶、聊天）转化为海洋能量（EXP），驱动海域进化和资产解锁，增强用户粘性和情感投入。能量瓶兑换系统则提供消耗路径，形成经济闭环。

## What Changes
- 新增 services/oceanExp.ts：数值计算引擎
- 新增海域阶段配置（浅滩→珊瑚礁→深海沉船→海底神殿→星海深渊）
- 新增海洋资产配置（生物/景观/装饰/特效）
- 实现 EnergyBottle 能量瓶组件（兑换商店）
- 重写 (tabs)/ocean.tsx：海域资产展示页
- 更新类型定义（OceanStage、AssetConfig 等）
- 更新常量配置

## Impact
- Affected specs: 海域养成系统
- Affected code: app/(tabs)/ocean.tsx、services/、components/ocean/、types/、lib/constants.ts

## ADDED Requirements

### Requirement: 海洋能量计算引擎
系统 SHALL 提供海洋能量（EXP）计算服务。

#### Scenario: 计算消息互动能量
- **WHEN** 用户发送或接收一条消息
- **THEN** 根据媒体类型计算基础能量：text=5, voice=10, draw=15
- **AND** 根据互动深度（对话轮数）应用倍率：<3轮=0, 3-5轮=1.0x, >5轮=1.5x
- **AND** 如果被对方标记为暖心，额外 +50

#### Scenario: 更新用户总能量
- **WHEN** 计算完一次能量收益后
- **THEN** 调用 Supabase 更新用户的 ocean_energy 字段

### Requirement: 海域阶段展示
系统 SHALL 根据用户总 EXP 展示对应的海域阶段。

#### Scenario: 海域阶段显示
- **WHEN** 用户进入海域页面
- **THEN** 顶部展示当前海域名称、等级、当前EXP/下一阶段所需EXP、进度条
- **AND** 背景色/氛围随海域阶段变化

#### Scenario: 阶段列表
浅滩 (0-100) → 珊瑚礁 (100-300) → 深海沉船 (300-800) → 海底神殿 (800-2000) → 星海深渊 (2000+)

### Requirement: 资产图鉴
系统 SHALL 以网格布局展示海洋资产图鉴。

#### Scenario: 已解锁资产
- **WHEN** 资产已解锁
- **THEN** 显示彩色图标/图片 + 名称 + 稀有度标识

#### Scenario: 未解锁资产
- **WHEN** 资产未解锁
- **THEN** 显示剪影（灰度/半透明）+ 锁定图标 + 所需EXP

### Requirement: 能量瓶兑换
系统 SHALL 提供能量瓶兑换功能。

#### Scenario: 打开能量瓶
- **WHEN** 用户点击能量瓶组件
- **THEN** 弹出兑换商店，展示可兑换物品

#### Scenario: 兑换捞瓶加速卡
- **WHEN** 用户消耗 50 EXP 兑换捞瓶加速卡
- **THEN** 获得一张加速卡（下次捞瓶必得高匹配度瓶子）

#### Scenario: 兑换特殊瓶子皮肤
- **WHEN** 用户消耗 200 EXP 兑换特殊瓶子皮肤
- **THEN** 解锁对应皮肤，扔瓶时可选择使用
