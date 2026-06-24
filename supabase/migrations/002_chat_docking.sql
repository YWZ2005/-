-- ============================================================================
-- 漂流瓶应用 - 聊天靠岸功能数据库迁移
-- 可直接在 Supabase SQL Editor 中运行
-- ============================================================================

-- ============================================================================
-- 一、枚举类型更新
-- ============================================================================

-- 在 conversation_status 枚举中添加 'docked' 值
DO $$
BEGIN
    ALTER TYPE conversation_status ADD VALUE IF NOT EXISTS 'docked';
EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN invalid_alter_type THEN NULL;
END
$$;

-- 在 media_type 枚举中添加 'knock' 值
DO $$
BEGIN
    ALTER TYPE media_type ADD VALUE IF NOT EXISTS 'knock';
EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN invalid_alter_type THEN NULL;
END
$$;

-- ============================================================================
-- 二、表结构更新
-- ============================================================================

-- 给 conversations 表添加 docked_at 字段
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS docked_at TIMESTAMPTZ;

-- ============================================================================
-- 三、RLS 策略确认
-- ============================================================================

-- messages_insert_sender 策略已覆盖所有 media_type 类型，无需修改
-- conversations_update_members 策略已覆盖 status 字段更新，无需修改
