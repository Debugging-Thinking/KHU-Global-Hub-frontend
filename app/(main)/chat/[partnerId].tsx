import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { chatApi } from '@/src/api/chat';
import { useAuthStore } from '@/src/store/authStore';
import { useT } from '@/src/i18n';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { ChatMessage } from '@/src/types/chat';

const POLL_INTERVAL = 5000;

export default function ChatRoomScreen() {
  const router = useRouter();
  const t = useT();
  const { partnerId } = useLocalSearchParams<{ partnerId: string }>();
  const myId = useAuthStore((s) => s.profile?.memberId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = async () => {
    try {
      const data = await chatApi.getMessages(Number(partnerId));
      setMessages(data);
    } catch {}
  };

  useEffect(() => {
    fetchMessages().finally(() => setLoading(false));
    pollTimer.current = setInterval(fetchMessages, POLL_INTERVAL);
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [partnerId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    const body = text.trim();
    setText('');
    try {
      await chatApi.sendMessage({ receiverId: Number(partnerId), content: body });
      await fetchMessages();
    } catch {} finally {
      setSending(false);
    }
  };

  function renderMessage({ item }: { item: ChatMessage }) {
    if (item.isSystem) {
      return (
        <View style={styles.systemMsg}>
          <Text style={styles.systemText}>{item.content}</Text>
        </View>
      );
    }
    const isMine = item.senderId === myId;
    return (
      <View style={[styles.msgRow, isMine && styles.msgRowRight]}>
        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
          <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.conversation}</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => String(item.messageId)}
            renderItem={renderMessage}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* 입력창 */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder={t.messagePlaceholder}
            placeholderTextColor={Colors.textTertiary}
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!text.trim() || sending}
            style={[styles.sendBtn, (!text.trim() || sending) && styles.sendDisabled]}
          >
            <Ionicons name="send" size={18} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  list: {
    padding: Spacing[4],
    gap: Spacing[2],
    paddingBottom: Spacing[4],
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  msgRowRight: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '72%',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderRadius: Radius.lg,
  },
  bubbleOther: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: Radius.sm,
  },
  bubbleMine: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: Radius.sm,
  },
  bubbleText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: Typography.base * Typography.normal,
  },
  bubbleTextMine: { color: Colors.textInverse },
  systemMsg: {
    alignItems: 'center',
    paddingVertical: Spacing[2],
  },
  systemText: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    backgroundColor: Colors.overlayLight,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing[3],
    padding: Spacing[4],
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { backgroundColor: Colors.border },
});
