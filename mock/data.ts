import type { User, Bottle, Conversation, Message, OceanAsset, Json } from '@/types/database';

export const MOCK_USER: User = {
  id: 'mock-user-001',
  credit_score: 85,
  ocean_energy: 256,
  verification_status: 'none',
  display_name: '深海旅人',
  avatar_url: null,
  bio: '在星海中寻找共鸣',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-06-01T00:00:00Z',
  interest_tags: ['心情', '日常', '文学'],
};

export const MOCK_THROWER_USER: User = {
  id: 'mock-user-002',
  credit_score: 92,
  ocean_energy: 512,
  verification_status: 'none',
  display_name: '星光收集者',
  avatar_url: null,
  bio: '收集每一颗星星的光芒',
  created_at: '2024-12-01T00:00:00Z',
  updated_at: '2025-05-15T00:00:00Z',
  interest_tags: ['日落', '旅行'],
};

export const MOCK_THIRD_USER: User = {
  id: 'mock-user-003',
  credit_score: 78,
  ocean_energy: 128,
  verification_status: 'none',
  display_name: '诗意漫步者',
  avatar_url: null,
  bio: '用文字记录生活',
  created_at: '2025-03-10T00:00:00Z',
  updated_at: '2025-06-10T00:00:00Z',
  interest_tags: ['文学', '创作'],
};

const bottleContent1: Json = { text: '今天在海边看到了很美的日落，想分享给远方的你。' };
const bottleContent2: Json = { text: '有没有人想听一首我写的小诗？关于星星和海的故事...' };

export const MOCK_BOTTLES: Bottle[] = [
  {
    id: 'bottle-001',
    bottle_type: 'text',
    content: bottleContent1,
    status: 'floating',
    thrower_id: 'mock-user-002',
    fisher_id: null,
    tags: ['心情', '日常'],
    created_at: '2025-06-20T10:30:00Z',
    expires_at: '2026-06-23T10:30:00Z',
  },
  {
    id: 'bottle-002',
    bottle_type: 'text',
    content: bottleContent2,
    status: 'floating',
    thrower_id: 'mock-user-003',
    fisher_id: null,
    tags: ['文学', '创作'],
    created_at: '2025-06-21T15:00:00Z',
    expires_at: '2026-06-24T15:00:00Z',
  },
];

export const MOCK_CONVERSATION: Conversation = {
  id: 'conv-001',
  bottle_id: 'bottle-001',
  user_a_id: 'mock-user-002',
  user_b_id: 'mock-user-001',
  status: 'active',
  last_active_at: '2025-06-22T08:00:00Z',
  created_at: '2025-06-21T12:00:00Z',
  docked_at: null,
};

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-001',
    conversation_id: 'conv-001',
    sender_id: 'mock-user-002',
    content: JSON.stringify({ text: '嗨～你捞到了我的瓶子！' }),
    media_type: 'text',
    is_read: true,
    created_at: '2025-06-21T12:01:00Z',
  },
  {
    id: 'msg-002',
    conversation_id: 'conv-001',
    sender_id: 'mock-user-001',
    content: JSON.stringify({ text: '哈哈是的！你写的日落很美，我也很喜欢看日落' }),
    media_type: 'text',
    is_read: true,
    created_at: '2025-06-21T12:05:00Z',
  },
  {
    id: 'msg-003',
    conversation_id: 'conv-001',
    sender_id: 'mock-user-002',
    content: JSON.stringify({ text: '你一般什么时候看日落呀？' }),
    media_type: 'text',
    is_read: true,
    created_at: '2025-06-21T12:10:00Z',
  },
  {
    id: 'msg-004',
    conversation_id: 'conv-001',
    sender_id: 'mock-user-001',
    content: JSON.stringify({ text: '周末会去海边看，城市里的日落总被楼挡着' }),
    media_type: 'text',
    is_read: true,
    created_at: '2025-06-21T12:15:00Z',
  },
  {
    id: 'msg-005',
    conversation_id: 'conv-001',
    sender_id: 'mock-user-002',
    content: JSON.stringify({ text: '同感！我住的地方也看不到海，只能靠想象了' }),
    media_type: 'text',
    is_read: true,
    created_at: '2025-06-21T12:20:00Z',
  },
  {
    id: 'msg-006',
    conversation_id: 'conv-001',
    sender_id: 'mock-user-001',
    content: JSON.stringify({ text: '你喜欢画画吗？可以把想象中的海画下来' }),
    media_type: 'text',
    is_read: true,
    created_at: '2025-06-21T12:25:00Z',
  },
  {
    id: 'msg-007',
    conversation_id: 'conv-001',
    sender_id: 'mock-user-002',
    content: JSON.stringify({ text: '哈哈我手残画不好，不过你给了我一个好主意' }),
    media_type: 'text',
    is_read: false,
    created_at: '2025-06-22T08:00:00Z',
  },
];

export const MOCK_OCEAN_ASSETS: OceanAsset[] = [
  {
    id: 'asset-001',
    user_id: 'mock-user-001',
    asset_type: 'creature',
    asset_key: 'jellyfish',
    asset_name: '发光水母',
    rarity: 'common',
    unlocked_at: '2025-06-01T00:00:00Z',
  },
];
