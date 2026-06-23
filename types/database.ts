export type BottleType = 'text' | 'voice' | 'draw';

export type BottleStatus = 'floating' | 'fished' | 'opened';

export type ConversationStatus = 'active' | 'archived';

export type MediaType = 'text' | 'voice' | 'image' | 'draw';

export type VerificationStatus = 'none' | 'campus' | 'workplace';

export type AssetRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type AssetType = 'creature' | 'landscape' | 'decoration' | 'effect';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface User {
  id: string;
  credit_score: number;
  ocean_energy: number;
  verification_status: VerificationStatus;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
  interest_tags?: string[] | null;
}

export interface Bottle {
  id: string;
  bottle_type: BottleType;
  content: Json;
  status: BottleStatus;
  thrower_id: string;
  fisher_id: string | null;
  tags: string[] | null;
  created_at: string;
  expires_at: string | null;
}

export interface Conversation {
  id: string;
  bottle_id: string;
  user_a_id: string;
  user_b_id: string;
  status: ConversationStatus;
  last_active_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  media_type: MediaType;
  is_read: boolean;
  created_at: string;
}

export interface OceanAsset {
  id: string;
  user_id: string;
  asset_type: AssetType;
  asset_key: string;
  asset_name: string;
  rarity: AssetRarity;
  unlocked_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at' | 'ocean_energy' | 'verification_status' | 'credit_score'> & {
          credit_score?: number;
          ocean_energy?: number;
          verification_status?: VerificationStatus;
        };
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      bottles: {
        Row: Bottle;
        Insert: Omit<Bottle, 'id' | 'created_at' | 'status' | 'fisher_id'> & {
          status?: BottleStatus;
          fisher_id?: string | null;
        };
        Update: Partial<Omit<Bottle, 'id' | 'created_at' | 'thrower_id'>>;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, 'id' | 'created_at' | 'last_active_at' | 'status'> & {
          status?: ConversationStatus;
        };
        Update: Partial<Omit<Conversation, 'id' | 'created_at'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at' | 'is_read'> & {
          is_read?: boolean;
        };
        Update: Partial<Omit<Message, 'id' | 'created_at' | 'conversation_id' | 'sender_id'>>;
      };
      ocean_assets: {
        Row: OceanAsset;
        Insert: Omit<OceanAsset, 'id' | 'unlocked_at'>;
        Update: Partial<Omit<OceanAsset, 'id' | 'unlocked_at' | 'user_id'>>;
      };
    };
    Views: {
      user_profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          verification_status: VerificationStatus;
          created_at: string;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: {
      bottle_type: BottleType;
      bottle_status: BottleStatus;
      conversation_status: ConversationStatus;
      media_type: MediaType;
      verification_status: VerificationStatus;
      asset_rarity: AssetRarity;
      asset_type: AssetType;
    };
  };
}
