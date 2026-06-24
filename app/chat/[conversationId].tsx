import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChat } from '@/hooks/useChat';
import { useDocking } from '@/hooks/useDocking';
import { ParchmentBubble, DockingAnimation } from '@/components/chat';
import { GlassCard } from '@/components/ui';
import { Message } from '@/types/database';
import { MAX_KNOCK_COUNT, DOCKING_ROUND_THRESHOLD } from '@/lib/constants';

export default function ChatScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<Message>>(null);
  const [inputText, setInputText] = useState('');

  const {
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
  } = useChat({ conversationId });

  const isDocked = conversationStatus === 'docked';

  const {
    dockingState,
    currentRound,
    showAnimation,
    dismissAnimation,
  } = useDocking({
    conversationId,
    messages,
    currentUserId,
    isDocked,
  });

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length, scrollToBottom]);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || !canSend) return;

    const result = await sendMessage(inputText.trim());
    if (result.success) {
      setInputText('');
    }
  }, [inputText, canSend, sendMessage]);

  const handleKnock = useCallback(async () => {
    if (knockCount >= MAX_KNOCK_COUNT) return;
    await sendKnock();
  }, [knockCount, sendKnock]);

  const formatTime = (dateStr: string): string => {
    return new Date(dateStr).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    const time = date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return isToday ? `今天 ${time}` : time;
  };

  const renderItem = useCallback(
    ({ item }: { item: Message }) => {
      const isMe = item.sender_id === currentUserId;
      return (
        <ParchmentBubble
          content={item.content}
          isMe={isMe}
          time={formatTime(item.created_at)}
          isRead={item.is_read}
          mediaType={item.media_type}
        />
      );
    },
    [currentUserId]
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const renderHeader = useCallback(() => {
    if (messages.length === 0) return null;
    const firstMessage = messages[0];
    return (
      <View className="items-center py-4">
        <View className="px-3 py-1 rounded-full bg-white/5">
          <Text className="text-white/30 text-xs">
            {formatDateLabel(firstMessage.created_at)}
          </Text>
        </View>
      </View>
    );
  }, [messages]);

  const renderFooter = useCallback(() => {
    if (!isLoading) return <View className="h-4" />;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="rgba(255,255,255,0.3)" />
      </View>
    );
  }, [isLoading]);

  const showDockingProgress =
    (dockingState === 'idle' || dockingState === 'pending') &&
    currentRound > 0 &&
    !isDocked;

  const dockingProgress = Math.min(currentRound / DOCKING_ROUND_THRESHOLD, 1);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
      keyboardVerticalOffset={0}
    >
      <View style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center px-4 py-3">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
          >
            <Text className="text-white text-xl">‹</Text>
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="text-white text-base font-semibold">星海中的TA</Text>
            <Text className="text-white/40 text-xs">在线</Text>
          </View>
          <Pressable className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
            <Text className="text-white text-base">⋯</Text>
          </Pressable>
        </View>

        {showDockingProgress && (
          <View className="px-4 pb-2">
            <GlassCard padding="sm" glowColor="#5BC0BE">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-white/70 text-xs">共振进度</Text>
                <Text className="text-bioluminescent text-xs font-semibold">
                  {Math.floor(currentRound)}/{DOCKING_ROUND_THRESHOLD}
                </Text>
              </View>
              <View className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <View
                  className="h-full bg-bioluminescent rounded-full"
                  style={{ width: `${dockingProgress * 100}%` }}
                />
              </View>
            </GlassCard>
          </View>
        )}

        {dockingState === 'completed' && (
          <View className="px-4 pb-2">
            <GlassCard padding="sm" glowColor="#FFD166">
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-dawn text-sm">✓</Text>
                <Text className="text-dawn text-sm font-semibold">已靠岸</Text>
              </View>
            </GlassCard>
          </View>
        )}
      </View>

      {error && (
        <View className="mx-4 my-2 bg-red-500/20 px-4 py-2 rounded-xl">
          <Text className="text-red-300 text-sm text-center">{error}</Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        inverted={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      />

      {isLoading && messages.length === 0 && (
        <View className="absolute inset-0 items-center justify-center">
          <ActivityIndicator size="large" color="rgba(91, 192, 190, 0.5)" />
        </View>
      )}

      <View
        className="px-4 pb-4 pt-2"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        {isWaitingForReply && (
          <View className="mb-2">
            <GlassCard padding="sm" glowColor="#FFD166">
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-dawn text-xs">💫</Text>
                <Text className="text-white/70 text-xs">
                  对方还未回应，先敲门打个招呼吧
                </Text>
              </View>
            </GlassCard>
          </View>
        )}

        <GlassCard padding="sm" glowColor="rgba(255,255,255,0.1)">
          <View className="flex-row items-end gap-3">
            <Pressable className="w-8 h-8 items-center justify-center mb-1">
              <Text className="text-white/60 text-lg">+</Text>
            </Pressable>

            <View className="flex-1">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder={
                  isWaitingForReply ? '等待对方回应...' : '说点什么...'
                }
                placeholderTextColor="rgba(255,255,255,0.3)"
                className="text-white text-base min-h-[32px] max-h-24 py-1"
                multiline
                editable={!isWaitingForReply}
                onSubmitEditing={handleSend}
              />
            </View>

            {isWaitingForReply ? (
              <Pressable
                onPress={handleKnock}
                disabled={knockCount >= MAX_KNOCK_COUNT || isSending}
                className={`px-4 py-2 rounded-full mb-1 ${
                  knockCount >= MAX_KNOCK_COUNT
                    ? 'bg-white/10'
                    : 'bg-dawn/20'
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    knockCount >= MAX_KNOCK_COUNT
                      ? 'text-white/30'
                      : 'text-dawn'
                  }`}
                >
                  敲门 {knockCount}/{MAX_KNOCK_COUNT}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleSend}
                disabled={!inputText.trim() || isSending}
                className={`px-4 py-2 rounded-full mb-1 ${
                  inputText.trim() && !isSending
                    ? 'bg-bioluminescent/20'
                    : 'bg-white/10'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    inputText.trim() && !isSending
                      ? 'text-bioluminescent'
                      : 'text-white/30'
                  }`}
                >
                  {isSending ? '发送中...' : '发送'}
                </Text>
              </Pressable>
            )}
          </View>
        </GlassCard>
      </View>

      <DockingAnimation
        visible={showAnimation}
        onComplete={dismissAnimation}
        onDismiss={dismissAnimation}
      />
    </KeyboardAvoidingView>
  );
}
