import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Message, Conversation } from '@/types';
import { MAX_KNOCK_COUNT, INITIAL_MESSAGE_LIMIT } from '@/lib/constants';

interface UseChatParams {
  conversationId: string;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  canSend: boolean;
  isWaitingForReply: boolean;
  knockCount: number;
  sendMessage: (content: string) => Promise<{ success: boolean; error?: string }>;
  sendKnock: () => Promise<{ success: boolean; error?: string }>;
  loadMore: () => Promise<void>;
  currentUserId: string | null;
  otherUserId: string | null;
  conversationStatus: string | null;
}

interface KnockContent {
  knockCount: number;
}

const LOAD_MORE_LIMIT = 20;

export function useChat({ conversationId }: UseChatParams): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [conversationStatus, setConversationStatus] = useState<string | null>(null);
  const [isWaitingForReply, setIsWaitingForReply] = useState<boolean>(false);
  const [knockCount, setKnockCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isInitiator, setIsInitiator] = useState<boolean>(false);

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  const canSend = !isWaitingForReply;

  const calculateKnockCount = useCallback((msgs: Message[], userId: string | null): number => {
    if (!userId) return 0;
    return msgs.filter((m) => m.sender_id === userId && m.media_type === 'knock').length;
  }, []);

  const checkOtherUserHasReplied = useCallback(
    (msgs: Message[], userId: string | null, otherId: string | null): boolean => {
      if (!userId || !otherId) return false;
      return msgs.some((m) => m.sender_id === otherId && m.media_type !== 'knock');
    },
    []
  );

  const fetchConversation = useCallback(
    async (userId: string): Promise<Conversation | null> => {
      try {
        const { data, error: fetchError } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .single();

        if (fetchError || !data) {
          setError(fetchError?.message ?? '获取会话信息失败');
          return null;
        }

        const conv = data as Conversation;
        const otherId = conv.user_a_id === userId ? conv.user_b_id : conv.user_a_id;
        setOtherUserId(otherId);
        setConversationStatus(conv.status);

        return conv;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : '获取会话信息失败';
        setError(errMsg);
        return null;
      }
    },
    [conversationId]
  );

  const fetchInitialMessages = useCallback(async (): Promise<Message[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(INITIAL_MESSAGE_LIMIT);

      if (fetchError) {
        setError(fetchError.message);
        return [];
      }

      const msgs = (data ?? []) as Message[];
      const reversed = [...msgs].reverse();

      if (msgs.length < INITIAL_MESSAGE_LIMIT) {
        setHasMore(false);
      }

      return reversed;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '获取消息失败';
      setError(errMsg);
      return [];
    }
  }, [conversationId]);

  const setupRealtimeSubscription = useCallback(() => {
    const channel = supabase.channel(`chat:${conversationId}`);

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) {
              return prev;
            }
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    channelRef.current = channel;
  }, [conversationId]);

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;

      setIsLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          const errMsg = '请先登录';
          setError(errMsg);
          setIsLoading(false);
          return;
        }

        setCurrentUserId(user.id);

        const conv = await fetchConversation(user.id);
        if (!conv || cancelled) {
          setIsLoading(false);
          return;
        }

        const initialMessages = await fetchInitialMessages();
        if (cancelled) return;

        setMessages(initialMessages);

        const otherId = conv.user_a_id === user.id ? conv.user_b_id : conv.user_a_id;
        const initiator = conv.user_a_id === user.id;
        const otherHasReplied = checkOtherUserHasReplied(initialMessages, user.id, otherId);
        const waiting = initiator && !otherHasReplied;

        setIsInitiator(initiator);
        setIsWaitingForReply(waiting);
        setKnockCount(calculateKnockCount(initialMessages, user.id));

        setupRealtimeSubscription();
      } catch (err) {
        if (!cancelled) {
          const errMsg = err instanceof Error ? err.message : '初始化聊天失败';
          setError(errMsg);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      cancelled = true;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, [conversationId, fetchConversation, fetchInitialMessages, setupRealtimeSubscription, checkOtherUserHasReplied, calculateKnockCount]);

  useEffect(() => {
    if (isInitiator && currentUserId && otherUserId) {
      const otherHasReplied = checkOtherUserHasReplied(messages, currentUserId, otherUserId);
      
      if (isWaitingForReply && otherHasReplied) {
        setIsWaitingForReply(false);
      }
    }
  }, [messages, currentUserId, otherUserId, isWaitingForReply, isInitiator, checkOtherUserHasReplied]);

  useEffect(() => {
    setKnockCount(calculateKnockCount(messages, currentUserId));
  }, [messages, currentUserId, calculateKnockCount]);

  const sendMessage = useCallback(
    async (content: string): Promise<{ success: boolean; error?: string }> => {
      if (!currentUserId) {
        const errMsg = '请先登录';
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      if (isWaitingForReply) {
        const errMsg = '对方还未回复，暂时不能发送消息';
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      if (!content.trim()) {
        const errMsg = '消息内容不能为空';
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      setIsSending(true);
      setError(null);

      try {
        const insertData = {
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: content.trim(),
          media_type: 'text' as const,
          is_read: false,
        };

        const { error: insertError } = await supabase
          .from('messages')
          .insert(insertData);

        if (insertError) {
          setError(insertError.message);
          return { success: false, error: insertError.message };
        }

        const { error: updateError } = await supabase
          .from('conversations')
          .update({ last_active_at: new Date().toISOString() })
          .eq('id', conversationId);

        if (updateError) {
          console.warn('更新会话最后活跃时间失败:', updateError.message);
        }

        return { success: true };
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : '发送消息失败';
        setError(errMsg);
        return { success: false, error: errMsg };
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, currentUserId, isWaitingForReply]
  );

  const sendKnock = useCallback(
    async (): Promise<{ success: boolean; error?: string }> => {
      if (!currentUserId) {
        const errMsg = '请先登录';
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      if (!isWaitingForReply) {
        const errMsg = '当前不需要敲门';
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      const currentKnockCount = calculateKnockCount(messages, currentUserId);
      if (currentKnockCount >= MAX_KNOCK_COUNT) {
        const errMsg = `敲门次数已达上限（${MAX_KNOCK_COUNT}次）`;
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      setIsSending(true);
      setError(null);

      try {
        const newKnockCount = currentKnockCount + 1;
        const knockContent: KnockContent = { knockCount: newKnockCount };
        const contentJson = JSON.stringify(knockContent);

        const insertData = {
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: contentJson,
          media_type: 'knock' as const,
          is_read: false,
        };

        const { error: insertError } = await supabase
          .from('messages')
          .insert(insertData as unknown as Record<string, unknown>);

        if (insertError) {
          setError(insertError.message);
          return { success: false, error: insertError.message };
        }

        const { error: updateError } = await supabase
          .from('conversations')
          .update({ last_active_at: new Date().toISOString() })
          .eq('id', conversationId);

        if (updateError) {
          console.warn('更新会话最后活跃时间失败:', updateError.message);
        }

        return { success: true };
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : '敲门失败';
        setError(errMsg);
        return { success: false, error: errMsg };
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, currentUserId, isWaitingForReply, messages, calculateKnockCount]
  );

  const loadMore = useCallback(async (): Promise<void> => {
    if (!hasMore || isLoading || messages.length === 0) {
      return;
    }

    setError(null);

    try {
      const oldestMessage = messages[0];
      const oldestCreatedAt = oldestMessage.created_at;

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .lt('created_at', oldestCreatedAt)
        .order('created_at', { ascending: false })
        .limit(LOAD_MORE_LIMIT);

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      const olderMessages = (data ?? []) as Message[];
      const reversed = [...olderMessages].reverse();

      if (olderMessages.length < LOAD_MORE_LIMIT) {
        setHasMore(false);
      }

      if (reversed.length > 0) {
        setMessages((prev) => [...reversed, ...prev]);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '加载更多消息失败';
      setError(errMsg);
    }
  }, [conversationId, hasMore, isLoading, messages]);

  return {
    messages,
    isLoading,
    isSending,
    error,
    canSend,
    isWaitingForReply,
    knockCount,
    sendMessage,
    sendKnock,
    loadMore,
    currentUserId,
    otherUserId,
    conversationStatus,
  };
}
