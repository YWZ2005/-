import type {
  BottleType,
  BottleStatus,
  ConversationStatus,
  MediaType,
  VerificationStatus,
  AssetRarity,
  AssetType,
  User,
  Bottle,
  Conversation,
  Message,
  OceanAsset,
  Database,
  Json,
} from './database';

export type {
  BottleType,
  BottleStatus,
  ConversationStatus,
  MediaType,
  VerificationStatus,
  AssetRarity,
  AssetType,
  User,
  Bottle,
  Conversation,
  Message,
  OceanAsset,
  Database,
  Json,
};

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
