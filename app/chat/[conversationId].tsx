import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { GlassCard } from '@/components/ui';

interface Message {
  id: string;
  content: string;
  isMe: boolean;
  time: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: '你好呀！收到你的漂流瓶啦～',
    isMe: false,
    time: '21:30',
  },
  {
    id: '2',
    content: '你好！很高兴认识你，我是星海漫游者',
    isMe: true,
    time: '21:32',
  },
  {
    id: '3',
    content: '哈哈，这个名字好有诗意！我是海边的风',
    isMe: false,
    time: '21:33',
  },
  {
    id: '4',
    content: '你说你在海边看星星，我也好久没看过了',
    isMe: false,
    time: '21:33',
  },
  {
    id: '5',
    content: '城市里的光污染太严重了，很难看到满天繁星',
    isMe: true,
    time: '21:35',
  },
  {
    id: '6',
    content: '是啊，所以我特别喜欢去海边，那里的星空特别美',
    isMe: false,
    time: '21:36',
  },
];

export default function ChatScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      isMe: true,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <View className="flex-1">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center px-4 py-3">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
          >
            <Text className="text-white text-xl">‹</Text>
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="text-white text-base font-semibold">海边的风</Text>
            <Text className="text-white/40 text-xs">在线</Text>
          </View>
          <Pressable className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
            <Text className="text-white text-base">⋯</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center py-4">
          <View className="px-3 py-1 rounded-full bg-white/5">
            <Text className="text-white/30 text-xs">今天 21:30</Text>
          </View>
        </View>

        {messages.map((message) => (
          <View
            key={message.id}
            className={`mb-3 ${message.isMe ? 'items-end' : 'items-start'}`}
          >
            <View className={`max-w-[80%] ${message.isMe ? 'items-end' : 'items-start'}`}>
              <GlassCard
                padding="md"
                glowColor={message.isMe ? '#5BC0BE' : 'rgba(255,255,255,0.1)'}
              >
                <Text
                  className={`leading-5 ${message.isMe ? 'text-white' : 'text-white/90'}`}
                >
                  {message.content}
                </Text>
              </GlassCard>
              <Text className="text-white/30 text-xs mt-1 mx-2">{message.time}</Text>
            </View>
          </View>
        ))}

        <View className="h-4" />
      </ScrollView>

      <View
        className="px-4 pb-4 pt-2"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <GlassCard padding="sm" glowColor="rgba(255,255,255,0.1)">
          <View className="flex-row items-center gap-3">
            <Pressable className="w-8 h-8 items-center justify-center">
              <Text className="text-white/60 text-lg">+</Text>
            </Pressable>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="说点什么..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              className="flex-1 text-white text-base"
              multiline
            />
            <Pressable
              onPress={handleSend}
              className="px-4 py-2 rounded-full bg-bioluminescent/20"
            >
              <Text className="text-bioluminescent font-semibold">发送</Text>
            </Pressable>
          </View>
        </GlassCard>
      </View>
    </View>
  );
}
