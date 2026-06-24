# 实时聊天模块与靠岸仪式 Spec

## Why
聊天是漂流瓶社交的核心交互场景，需要实时性和情感温度。"靠岸仪式"作为关系沉淀机制，将 10 轮互动转化为仪式感的解锁事件，增强用户粘性和情感连接。女性友好机制则保障了社区的安全与尊重。

## What Changes
- 更新数据库：conversations 状态增加 'docked'，media_type 增加 'knock'
- 实现 useChat Hook：Realtime 订阅、发送消息、女性友好敲门机制
- 实现 useDocking Hook：监听消息轮次，触发靠岸状态
- 实现 DockingAnimation 组件："频率共振"全屏动画
- 重写 chat/[conversationId].tsx：FlatList 消息列表 + 实时订阅 + 靠岸仪式
- 更新 types/database.ts 和 types/index.ts
- 更新 lib/constants.ts

## Impact
- Affected specs: 聊天系统、海域养成系统
- Affected code: app/chat/[conversationId].tsx、hooks/、components/chat/、types/、supabase/migrations/

## ADDED Requirements

### Requirement: 实时聊天
系统 SHALL 提供基于 Supabase Realtime 的实时私信功能。

#### Scenario: 实时接收消息
- **WHEN** 对方发送新消息
- **THEN** 消息通过 Realtime INSERT 事件实时上屏，列表自动滚动到底部

#### Scenario: 发送消息
- **WHEN** 用户输入文字并点击发送
- **THEN** 消息写入 messages 表，会话 last_active_at 更新

### Requirement: 女性友好机制
系统 SHALL 提供女性友好的敲门机制：男性用户在女性用户回复第一条消息前，只能发送"敲门"动画消息，输入框禁用。

#### Scenario: 男性首次联系女性
- **WHEN** 男性用户进入与女性的聊天，对方尚未发送过消息
- **THEN** 输入框被禁用，显示"等待对方回应"提示，只能发送敲门动画

#### Scenario: 女性回复后解锁
- **WHEN** 女性用户发送第一条消息后
- **THEN** 男性用户的输入框解锁，可正常发送消息

### Requirement: 靠岸仪式
系统 SHALL 提供靠岸仪式机制：当双方连续互动达到 10 轮时，触发靠岸状态。

#### Scenario: 触发靠岸
- **WHEN** 会话中双方互相回复累计达到 10 轮（你来我往各算半轮）
- **THEN** 播放全屏"频率共振"动画，更新会话状态为 docked

#### Scenario: 解锁专属资产
- **WHEN** 靠岸仪式完成
- **THEN** 双方各获得一枚"共振之石"海洋资产，海域图鉴解锁

### Requirement: 羊皮纸消息气泡
系统 SHALL 提供羊皮纸卷轴风格的消息气泡（GlassCard 变体）。

#### Scenario: 消息展示
- **WHEN** 消息列表渲染
- **THEN** 消息气泡采用羊皮纸色调，带卷边阴影效果
