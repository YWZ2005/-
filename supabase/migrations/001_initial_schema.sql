-- ============================================================================
-- 漂流瓶应用 - 初始数据库架构
-- 可直接在 Supabase SQL Editor 中运行
-- ============================================================================

-- 启用扩展（Supabase 默认已启用 pgcrypto，此处确保兼容）
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 一、枚举类型
-- ============================================================================

-- 瓶子类型
DO $$ BEGIN
    CREATE TYPE bottle_type AS ENUM ('text', 'voice', 'draw');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 瓶子状态
DO $$ BEGIN
    CREATE TYPE bottle_status AS ENUM ('floating', 'fished', 'opened');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 会话状态
DO $$ BEGIN
    CREATE TYPE conversation_status AS ENUM ('active', 'archived');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 媒体类型
DO $$ BEGIN
    CREATE TYPE media_type AS ENUM ('text', 'voice', 'image', 'draw');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 认证状态
DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('none', 'campus', 'workplace');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 资产稀有度
DO $$ BEGIN
    CREATE TYPE asset_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 资产类型
DO $$ BEGIN
    CREATE TYPE asset_type AS ENUM ('creature', 'landscape', 'decoration', 'effect');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- 二、表结构
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. users 表 - 用户信息表
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    credit_score INTEGER NOT NULL DEFAULT 100 CHECK (credit_score >= 0 AND credit_score <= 100),
    ocean_energy INTEGER NOT NULL DEFAULT 0 CHECK (ocean_energy >= 0),
    verification_status verification_status NOT NULL DEFAULT 'none',
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- users 表 updated_at 自动更新触发器函数
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users 表 updated_at 触发器
DROP TRIGGER IF EXISTS users_updated_at_trigger ON users;
CREATE TRIGGER users_updated_at_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_users_updated_at();

-- auth.users 新增用户时自动创建 users 记录的函数
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- auth.users 新增用户触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ----------------------------------------------------------------------------
-- 1b. user_profiles 视图 - 用户公开信息视图
-- 仅包含可公开的用户信息，保护隐私字段（credit_score、ocean_energy等）
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW user_profiles AS
SELECT
    id,
    display_name,
    avatar_url,
    bio,
    verification_status,
    created_at
FROM users;

-- 授予已认证用户查看公开视图的权限
GRANT SELECT ON user_profiles TO authenticated;

-- ----------------------------------------------------------------------------
-- 2. bottles 表 - 漂流瓶表
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bottles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bottle_type bottle_type NOT NULL,
    content JSONB NOT NULL,
    status bottle_status NOT NULL DEFAULT 'floating',
    thrower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fisher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- bottles 表索引
CREATE INDEX IF NOT EXISTS bottles_status_idx ON bottles(status);
CREATE INDEX IF NOT EXISTS bottles_thrower_id_idx ON bottles(thrower_id);
CREATE INDEX IF NOT EXISTS bottles_fisher_id_idx ON bottles(fisher_id);
CREATE INDEX IF NOT EXISTS bottles_created_at_idx ON bottles(created_at);
CREATE INDEX IF NOT EXISTS bottles_status_created_at_idx ON bottles(status, created_at);

-- bottles 表更新保护触发器函数
-- 捞瓶者只能更新 status 和 fisher_id 字段，不能篡改 bottle_type、content、thrower_id 等
CREATE OR REPLACE FUNCTION check_bottle_update_permissions()
RETURNS TRIGGER AS $$
BEGIN
    IF auth.uid() = NEW.fisher_id THEN
        IF OLD.bottle_type != NEW.bottle_type
            OR OLD.content != NEW.content
            OR OLD.thrower_id != NEW.thrower_id
            OR OLD.created_at != NEW.created_at
            OR OLD.expires_at != NEW.expires_at THEN
            RAISE EXCEPTION 'Fisher can only update status and fisher_id';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS bottles_update_permissions_trigger ON bottles;
CREATE TRIGGER bottles_update_permissions_trigger
    BEFORE UPDATE ON bottles
    FOR EACH ROW
    EXECUTE FUNCTION check_bottle_update_permissions();

-- ----------------------------------------------------------------------------
-- 3. conversations 表 - 会话表
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bottle_id UUID UNIQUE REFERENCES bottles(id) ON DELETE CASCADE,
    user_a_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_b_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status conversation_status NOT NULL DEFAULT 'active',
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- conversations 表索引
CREATE INDEX IF NOT EXISTS conversations_user_a_id_idx ON conversations(user_a_id);
CREATE INDEX IF NOT EXISTS conversations_user_b_id_idx ON conversations(user_b_id);
CREATE INDEX IF NOT EXISTS conversations_last_active_at_idx ON conversations(last_active_at);
CREATE INDEX IF NOT EXISTS conversations_user_a_id_status_idx ON conversations(user_a_id, status);
CREATE INDEX IF NOT EXISTS conversations_user_b_id_status_idx ON conversations(user_b_id, status);

-- ----------------------------------------------------------------------------
-- 4. messages 表 - 消息表
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_type media_type NOT NULL DEFAULT 'text',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- messages 表索引
CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at);
CREATE INDEX IF NOT EXISTS messages_conversation_id_created_at_idx ON messages(conversation_id, created_at);

-- ----------------------------------------------------------------------------
-- 5. ocean_assets 表 - 海洋资产表
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ocean_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset_type asset_type NOT NULL,
    asset_key TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    rarity asset_rarity NOT NULL DEFAULT 'common',
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, asset_key)
);

-- ocean_assets 表索引
CREATE INDEX IF NOT EXISTS ocean_assets_user_id_idx ON ocean_assets(user_id);
CREATE INDEX IF NOT EXISTS ocean_assets_rarity_idx ON ocean_assets(rarity);
CREATE INDEX IF NOT EXISTS ocean_assets_asset_type_idx ON ocean_assets(asset_type);

-- ============================================================================
-- 三、RLS 策略
-- ============================================================================

-- 启用所有表的 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bottles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocean_assets ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- users 表 RLS 策略
-- ----------------------------------------------------------------------------

-- 用户可查看自己的完整信息
DROP POLICY IF EXISTS users_select_self ON users;
CREATE POLICY users_select_self ON users
    FOR SELECT
    USING (id = auth.uid());

-- 注意：其他用户的公开信息请通过 user_profiles 视图查询
-- 该视图仅暴露公开字段（id, display_name, avatar_url, bio, verification_status, created_at）
-- 隐私字段（credit_score, ocean_energy, updated_at）仅本人可通过 users 表查看

-- 用户可更新自己的信息
DROP POLICY IF EXISTS users_update_self ON users;
CREATE POLICY users_update_self ON users
    FOR UPDATE
    USING (id = auth.uid());

-- ----------------------------------------------------------------------------
-- bottles 表 RLS 策略
-- ----------------------------------------------------------------------------

-- 用户可查看自己扔的瓶子
DROP POLICY IF EXISTS bottles_select_thrower ON bottles;
CREATE POLICY bottles_select_thrower ON bottles
    FOR SELECT
    USING (thrower_id = auth.uid());

-- 用户可查看自己捞到且状态为 fished/opened 的瓶子
DROP POLICY IF EXISTS bottles_select_fisher ON bottles;
CREATE POLICY bottles_select_fisher ON bottles
    FOR SELECT
    USING (
        fisher_id = auth.uid()
        AND status IN ('fished', 'opened')
    );

-- 已认证用户可查看 floating 状态的瓶子（公海可见）
DROP POLICY IF EXISTS bottles_select_floating ON bottles;
CREATE POLICY bottles_select_floating ON bottles
    FOR SELECT
    USING (
        auth.role() = 'authenticated'
        AND status = 'floating'
    );

-- 用户可插入自己为扔瓶者的瓶子
DROP POLICY IF EXISTS bottles_insert_thrower ON bottles;
CREATE POLICY bottles_insert_thrower ON bottles
    FOR INSERT
    WITH CHECK (thrower_id = auth.uid());

-- 捞瓶者可更新瓶子状态（fishing 操作及打开操作）
DROP POLICY IF EXISTS bottles_update_fisher ON bottles;
CREATE POLICY bottles_update_fisher ON bottles
    FOR UPDATE
    USING (fisher_id = auth.uid());

-- ----------------------------------------------------------------------------
-- conversations 表 RLS 策略
-- ----------------------------------------------------------------------------

-- 会话双方均可查看
DROP POLICY IF EXISTS conversations_select_members ON conversations;
CREATE POLICY conversations_select_members ON conversations
    FOR SELECT
    USING (
        user_a_id = auth.uid()
        OR user_b_id = auth.uid()
    );

-- 用户只能创建自己参与的会话
DROP POLICY IF EXISTS conversations_insert_members ON conversations;
CREATE POLICY conversations_insert_members ON conversations
    FOR INSERT
    WITH CHECK (
        user_a_id = auth.uid()
        OR user_b_id = auth.uid()
    );

-- 会话双方均可更新
DROP POLICY IF EXISTS conversations_update_members ON conversations;
CREATE POLICY conversations_update_members ON conversations
    FOR UPDATE
    USING (
        user_a_id = auth.uid()
        OR user_b_id = auth.uid()
    );

-- ----------------------------------------------------------------------------
-- messages 表 RLS 策略
-- ----------------------------------------------------------------------------

-- 会话成员可查看消息（通过子查询判断是否为会话成员）
DROP POLICY IF EXISTS messages_select_conversation_members ON messages;
CREATE POLICY messages_select_conversation_members ON messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM conversations c
            WHERE c.id = messages.conversation_id
              AND (c.user_a_id = auth.uid() OR c.user_b_id = auth.uid())
        )
    );

-- 发送者只能发送自己为发送者且自己是会话成员的消息
DROP POLICY IF EXISTS messages_insert_sender ON messages;
CREATE POLICY messages_insert_sender ON messages
    FOR INSERT
    WITH CHECK (
        sender_id = auth.uid()
        AND EXISTS (
            SELECT 1
            FROM conversations c
            WHERE c.id = messages.conversation_id
              AND (c.user_a_id = auth.uid() OR c.user_b_id = auth.uid())
        )
    );

-- 发送者可更新自己的消息（主要用于撤回等场景）
DROP POLICY IF EXISTS messages_update_sender ON messages;
CREATE POLICY messages_update_sender ON messages
    FOR UPDATE
    USING (sender_id = auth.uid());

-- ----------------------------------------------------------------------------
-- ocean_assets 表 RLS 策略
-- ----------------------------------------------------------------------------

-- 用户只能查看自己的资产
DROP POLICY IF EXISTS ocean_assets_select_own ON ocean_assets;
CREATE POLICY ocean_assets_select_own ON ocean_assets
    FOR SELECT
    USING (user_id = auth.uid());

-- 用户只能插入自己的资产
DROP POLICY IF EXISTS ocean_assets_insert_own ON ocean_assets;
CREATE POLICY ocean_assets_insert_own ON ocean_assets
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 四、Supabase Realtime
-- ============================================================================

-- 确保 supabase_realtime publication 存在
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication
        WHERE pubname = 'supabase_realtime'
    ) THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END
$$;

-- 将 messages 表添加到 supabase_realtime publication（幂等处理）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = 'messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE messages;
    END IF;
END
$$;

-- 设置 messages 表的实时复制身份（使用完整记录）
ALTER TABLE messages REPLICA IDENTITY FULL;

-- ============================================================================
-- 五、暗海隔离机制（应用层实现说明）
-- ============================================================================
--
-- 【暗海隔离机制说明】
--
-- 为了营造健康的社区环境，系统根据用户信用分进行"暗海隔离"：
-- 高信用分用户（>=60分）只能看到高信用分用户扔出的瓶子，
-- 低信用分用户（<60分）只能看到低信用分用户扔出的瓶子。
--
-- 该机制在应用层（Edge Function 或客户端查询）中实现，具体方式如下：
--
-- 1. 捞瓶查询时，先获取当前用户的信用分
--    - 从 users 表中查询 auth.uid() 对应用户的 credit_score
--
-- 2. 信用分判断逻辑：
--    - 如果当前用户信用分 >= 60，只捞取 thrower 信用分 >= 60 的瓶子
--    - 如果当前用户信用分 < 60，只捞取 thrower 信用分 < 60 的瓶子
--
-- 3. 查询实现方式：
--    - 使用 JOIN users thrower ON thrower.id = bottles.thrower_id 进行过滤
--    - 同时配合 status = 'floating' 和 expires_at 条件
--
-- 4. 示例查询语句（高信用分用户捞瓶）：
--    SELECT b.*
--    FROM bottles b
--    JOIN users thrower ON thrower.id = b.thrower_id
--    WHERE b.status = 'floating'
--      AND thrower.credit_score >= 60
--      AND (b.expires_at IS NULL OR b.expires_at > NOW())
--      AND b.thrower_id != auth.uid()
--    ORDER BY RANDOM()
--    LIMIT 1;
--
-- 5. 示例查询语句（低信用分用户捞瓶）：
--    SELECT b.*
--    FROM bottles b
--    JOIN users thrower ON thrower.id = b.thrower_id
--    WHERE b.status = 'floating'
--      AND thrower.credit_score < 60
--      AND (b.expires_at IS NULL OR b.expires_at > NOW())
--      AND b.thrower_id != auth.uid()
--    ORDER BY RANDOM()
--    LIMIT 1;
--
-- 【注意事项】
-- - 该隔离机制仅作用于公海捞瓶场景，不影响：
--   * 用户查看自己扔出的瓶子
--   * 用户查看自己已捞到的瓶子
--   * 已建立会话后的消息收发
-- - 信用分阈值（60分）可根据运营需求调整
-- - 建议在 Edge Function 中封装捞瓶逻辑，确保规则统一执行
--
-- ============================================================================
