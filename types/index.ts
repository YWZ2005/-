import type {
  BottleType,
  BottleStatus,
  ConversationStatus,
  MediaType as DatabaseMediaType,
  VerificationStatus,
  AssetRarity,
  AssetType,
  User,
  Bottle,
  Conversation,
  Message as DatabaseMessage,
  OceanAsset,
  Database,
  Json,
} from './database';

export type {
  BottleType,
  BottleStatus,
  ConversationStatus,
  VerificationStatus,
  AssetRarity,
  AssetType,
  User,
  Bottle,
  Conversation,
  OceanAsset,
  Database,
  Json,
};

export type MediaType = DatabaseMediaType | 'knock';

export interface Message extends Omit<DatabaseMessage, 'media_type'> {
  media_type: MediaType;
}

export interface TextBottleContent {
  text: string;
}

export interface VoiceBottleContent {
  audioUrl: string;
  duration: number;
}

export interface DrawBottleContent {
  imageUrl: string;
}

export type BottleContent = TextBottleContent | VoiceBottleContent | DrawBottleContent;

export interface ThrowBottleParams {
  type: BottleType;
  content: BottleContent;
  tags?: string[];
}

export interface BottleWithThrower extends Bottle {
  thrower: {
    credit_score: number;
  };
}

export interface ChatMessage extends Message {
  isMe: boolean;
  formattedTime: string;
}

export type DockingState = 'idle' | 'pending' | 'triggered' | 'completed';

export interface KnockMessageContent {
  type: 'knock';
  knockCount: number;
}

export interface OceanStage {
  id: string;
  name: string;
  level: number;
  minExp: number;
  maxExp: number;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  icon: string;
}

export interface AssetConfig {
  id: string;
  name: string;
  type: 'creature' | 'landscape' | 'decoration' | 'effect';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requiredExp: number;
  icon: string;
  description: string;
  stage: string;
}

export interface ExchangeItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  category: 'boost' | 'skin' | 'tool' | 'effect';
}
