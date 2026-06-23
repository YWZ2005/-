# 星海漂流数据库 Schema 与 RLS 策略 Spec

## Why
"星海漂流"作为一款沉浸式情感社区 App，需要一套严谨的数据库架构支撑多媒介漂流瓶、海域养成、实时聊天等核心功能。良好的 Schema 设计与 RLS 策略是数据安全、业务扩展和性能优化的基石。

## What Changes
- 新建 `users` 表：用户基础信息、信用分、海洋能量、认证状态
- 新建 `bottles` 表：漂流瓶核心表，支持 text/voice/draw 三种类型
- 新建 `conversations` 表：聊天会话表，由捞瓶触发
- 新建 `messages` 表：聊天消息表，支持多种媒介类型
- 新建 `ocean_assets` 表：海域养成资产表
- 配置各表 RLS 策略，遵循"最小权限"原则
- 启用 Supabase Realtime 推送 messages 表 INSERT 事件
- 创建必要的索引以优化查询性能

## Impact
- Affected specs: 漂流瓶系统、聊天系统、海域养成系统、用户系统
- Affected code: 所有 Supabase 数据操作层 (services/hooks)

## ADDED Requirements

### Requirement: users 表
系统 SHALL 提供用户基础信息表，包含信用分（初始值100）、海洋能量(EXP)、认证状态等字段。

#### Scenario: 用户注册
- **WHEN** 用户通过 Supabase Auth 注册
- **THEN** 自动在 users 表中创建对应记录，信用分初始为100，海洋能量初始为0

### Requirement: bottles 表
系统 SHALL 提供漂流瓶表，支持 text/voice/draw 三种类型，内容以 JSONB 存储，状态包括 floating/fished/opened。

#### Scenario: 用户扔瓶子
- **WHEN** 用户扔出漂流瓶
- **THEN** 瓶子状态为 floating，thrower_id 为当前用户，fisher_id 为 NULL

#### Scenario: 用户捞到瓶子
- **WHEN** 用户捞到漂流瓶
- **THEN** 瓶子状态更新为 fished，fisher_id 设置为当前用户

### Requirement: conversations 表
系统 SHALL 提供聊天会话表，由捞瓶触发，关联 bottle_id，状态包括 active/archived。

#### Scenario: 捞瓶后创建会话
- **WHEN** 用户捞到瓶子并打开
- **THEN** 自动创建会话，双方为扔瓶者和捞瓶者，状态为 active

### Requirement: messages 表
系统 SHALL 提供聊天消息表，支持多种媒介类型，包含已读状态。

#### Scenario: 发送消息
- **WHEN** 用户在会话中发送消息
- **THEN** 消息记录被创建，会话的 last_active_at 被更新

### Requirement: ocean_assets 表
系统 SHALL 提供海域养成资产表，记录用户解锁的海洋生物/景观。

#### Scenario: 用户解锁资产
- **WHEN** 用户满足条件解锁海洋资产
- **THEN** 在 ocean_assets 中创建记录

### Requirement: RLS - bottles 表访问控制
系统 SHALL 对 bottles 表实施行级安全策略：
- 用户只能查看自己扔的瓶子
- 用户只能查看状态为 fished 且自己是捞瓶者的瓶子
- 状态为 floating 的瓶子对所有已认证用户可见（公海捞取池）

#### Scenario: 查看自己扔的瓶子
- **WHEN** 用户查询自己扔出的瓶子列表
- **THEN** 返回 thrower_id = 当前用户的所有瓶子

#### Scenario: 查看自己捞到的瓶子
- **WHEN** 用户查询自己捞到的瓶子列表
- **THEN** 返回 fisher_id = 当前用户且状态为 fished/opened 的瓶子

### Requirement: 暗海隔离机制
系统 SHALL 支持暗海隔离：信用分低于60的用户，其扔出的瓶子只能被同样低于60分的用户捞到。
**实现说明**：此逻辑在应用层（Service 层）通过查询过滤实现，RLS 仅提供基础行级隔离。SQL 脚本中包含注释说明应用层实现方式。

### Requirement: Supabase Realtime
系统 SHALL 启用 messages 表的 INSERT 事件实时推送，支持即时聊天体验。
