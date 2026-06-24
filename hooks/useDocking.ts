import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Message, Conversation, DockingState } from '@/types';
import {
  DOCKING_ROUND_THRESHOLD,
  DOCKING_ASSET_KEY,
  DOCKING_ASSET_NAME,
} from '@/lib/constants';

interface UseDockingParams {
  conversationId: string;
  messages: Message[];
  currentUserId: string | null;
  isDocked: boolean;
}

interface UseDockingReturn {
  dockingState: DockingState;
  currentRound: number;
  triggerDocking: () => Promise<void>;
  showAnimation: boolean;
  dismissAnimation: () => void;
}

const calculateRound = (messages: Message[]): number => {
  const textMessages = messages.filter((msg) => msg.media_type === 'text');

  if (textMessages.length === 0) {
    return 0;
  }

  let senderSwitchCount = 0;
  let lastSenderId: string | null = null;

  for (const msg of textMessages) {
    if (lastSenderId !== null && msg.sender_id !== lastSenderId) {
      senderSwitchCount++;
    }
    lastSenderId = msg.sender_id;
  }

  return senderSwitchCount / 2;
};

export function useDocking({
  conversationId,
  messages,
  currentUserId,
  isDocked,
}: UseDockingParams): UseDockingReturn {
  const [dockingState, setDockingState] = useState<DockingState>(
    isDocked ? 'completed' : 'idle'
  );
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const isPerformingRef = useRef<boolean>(false);

  useEffect(() => {
    const round = calculateRound(messages);
    setCurrentRound(round);
  }, [messages]);

  const performDocking = useCallback(async () => {
    if (isPerformingRef.current) {
      return;
    }

    isPerformingRef.current = true;
    setDockingState('pending');

    try {
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .select('user_a_id, user_b_id')
        .eq('id', conversationId)
        .single();

      if (conversationError || !conversation) {
        throw new Error(conversationError?.message ?? '获取会话信息失败');
      }

      const conv = conversation as Pick<Conversation, 'user_a_id' | 'user_b_id'>;

      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          status: 'docked',
          docked_at: new Date().toISOString(),
        })
        .eq('id', conversationId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      const userIds = [conv.user_a_id, conv.user_b_id];
      for (const userId of userIds) {
        const { data: existing } = await supabase
          .from('ocean_assets')
          .select('id')
          .eq('user_id', userId)
          .eq('asset_key', DOCKING_ASSET_KEY)
          .limit(1);

        if (!existing || existing.length === 0) {
          const { error: insertError } = await supabase
            .from('ocean_assets')
            .insert({
              user_id: userId,
              asset_type: 'creature',
              asset_key: DOCKING_ASSET_KEY,
              asset_name: DOCKING_ASSET_NAME,
              rarity: 'legendary',
            });

          if (insertError) {
            throw new Error(insertError.message);
          }
        }
      }

      setDockingState('completed');
    } catch (err) {
      setDockingState('idle');
      console.error('靠岸失败:', err);
    } finally {
      isPerformingRef.current = false;
    }
  }, [conversationId]);

  useEffect(() => {
    if (
      currentRound >= DOCKING_ROUND_THRESHOLD &&
      dockingState === 'idle' &&
      !isDocked
    ) {
      setDockingState('triggered');
      setShowAnimation(true);
    }
  }, [currentRound, dockingState, isDocked]);

  useEffect(() => {
    if (dockingState === 'triggered') {
      performDocking();
    }
  }, [dockingState, performDocking]);

  const triggerDocking = useCallback(async () => {
    if (dockingState !== 'idle' || isDocked) {
      return;
    }

    setDockingState('triggered');
    setShowAnimation(true);
  }, [dockingState, isDocked]);

  const dismissAnimation = useCallback(() => {
    setShowAnimation(false);
  }, []);

  return {
    dockingState,
    currentRound,
    triggerDocking,
    showAnimation,
    dismissAnimation,
  };
}
