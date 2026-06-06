import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import apiClient, { unwrap } from '@/src/api/client';
import { chatApi } from '@/src/api/chat';
import { Attachment } from '@/src/components/ui/Attachment';
import { ImagePickerButton } from '@/src/components/ui/ImagePickerButton';
import { useAuthStore } from '@/src/store/authStore';
import { useT } from '@/src/i18n';
import { useAutoTranslate } from '@/src/hooks/useTextTranslate';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { ChatMessage } from '@/src/types/chat';

const POLL_INTERVAL = 5000;

interface PartnerInfo {
  memberId: number;
  name: string;
  profileImageUrl: string | null;
}

/** 원형 아바타 — 이미지 없으면 이름 첫 글자. */
function Avatar({ partner, size = 32 }: { partner: PartnerInfo | null; size?: number }) {
  const dim = { width: size, height: size, borderRadius: size / 2 };
  if (partner?.profileImageUrl) {
    return <Image source={{ uri: partner.profileImageUrl }} style={[styles.avatar, dim]} />;
  }
  return (
    <View style={[styles.avatar, styles.avatarFallback, dim]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.42 }]}>
        {partner?.name?.trim()?.[0]?.toUpperCase() ?? '?'}
      </Text>
    </View>
  );
}

/**
 * 채팅 말풍선. 1:1 채팅은 항상 동적 — 받은 메시지는 자동으로 내 언어로 번역되어 표시되고,
 * "원문 보기" 토글로 되돌릴 수 있다. 번역 결과는 messageId 단위로 캐시되어 5초 폴링에도 재번역하지 않는다.
 */
function MessageBubble({
  item,
  isMine,
  target,
  t,
  onDelete,
  partner,
  showAvatar,
}: {
  item: ChatMessage;
  isMine: boolean;
  target: string;
  t: ReturnType<typeof useT>;
  onDelete: (messageId: number) => void;
  partner: PartnerInfo | null;
  showAvatar: boolean;
}) {
  const tr = useAutoTranslate([item.content], target, !isMine);
  return (
    <View style={[styles.msgRow, isMine && styles.msgRowRight]}>
      {!isMine &&
        (showAvatar ? <Avatar partner={partner} size={32} /> : <View style={styles.avatarSpacer} />)}
      <Pressable
        onLongPress={isMine ? () => onDelete(item.messageId) : undefined}
        delayLongPress={350}
        style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}
      >
        {(isMine ? item.content : tr.displays[0]) ? (
          <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>
            {isMine ? item.content : tr.displays[0]}
          </Text>
        ) : null}
        {item.imageUrl ? (
          <Attachment url={item.imageUrl} imageStyle={styles.msgImage} />
        ) : null}
        {!isMine && (tr.ready || tr.loading) && (
          <TouchableOpacity onPress={tr.toggle} style={styles.translateLink}>
            <Text style={styles.translateLinkText}>
              {tr.loading ? t.translating : tr.showOriginal ? t.viewTranslation : t.viewOriginal}
            </Text>
          </TouchableOpacity>
        )}
      </Pressable>
    </View>
  );
}

export default function ChatRoomScreen() {
  const router = useRouter();
  const t = useT();
  const { partnerId } = useLocalSearchParams<{ partnerId: string }>();
  const myId = useAuthStore((s) => s.profile?.memberId);
  const target = useAuthStore((s) => s.profile?.preferredLanguage ?? 'en');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [partner, setPartner] = useState<PartnerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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

  // 상대 프로필(이름·사진) 1회 조회 — 헤더/아바타 표시용.
  useEffect(() => {
    if (!partnerId) return;
    apiClient
      .get(`/members/${partnerId}`)
      .then((r) => setPartner(unwrap<PartnerInfo>(r)))
      .catch(() => {});
  }, [partnerId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  const handleSend = async () => {
    if ((!text.trim() && !imageUrl) || sending) return;
    setSending(true);
    const body = text.trim();
    const img = imageUrl;
    setText('');
    setImageUrl(null);
    try {
      await chatApi.sendMessage({ receiverId: Number(partnerId), content: body, imageUrl: img });
      await fetchMessages();
    } catch {} finally {
      setSending(false);
    }
  };

  const handleDelete = (messageId: number) => {
    const onConfirm = async () => {
      try { await chatApi.deleteMessage(messageId); await fetchMessages(); } catch {}
    };
    if (Platform.OS === 'web') {
      if (window.confirm(`${t.delete}?`)) onConfirm();
    } else {
      Alert.alert(t.delete, '', [
        { text: t.cancel, style: 'cancel' },
        { text: t.delete, style: 'destructive', onPress: onConfirm },
      ]);
    }
  };

  function renderMessage({ item, index }: { item: ChatMessage; index: number }) {
    if (item.isSystem) {
      // 시스템 메시지(멘토링 매칭 안내)는 정적 텍스트로 취급 — 보는 사람 언어로 표시.
      return (
        <View style={styles.systemMsg}>
          <Text style={styles.systemText}>{t.chatMatchSystem}</Text>
        </View>
      );
    }
    const isMine = item.senderId === myId;
    // 연속된 상대 메시지는 그룹 첫 줄에만 아바타 표시(클러터 방지).
    const prev = messages[index - 1];
    const showAvatar = !isMine && (!prev || prev.senderId !== item.senderId || prev.isSystem);
    return (
      <MessageBubble
        item={item}
        isMine={isMine}
        target={target}
        t={t}
        onDelete={handleDelete}
        partner={partner}
        showAvatar={showAvatar}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* 헤더 — 상대 프로필(탭하면 프로필 화면으로) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.navigate('/(main)/chat')} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerProfile}
          activeOpacity={0.7}
          onPress={() =>
            router.push({
              pathname: '/(main)/mentor-profile',
              params: { memberId: String(partnerId) },
            })
          }
        >
          <Avatar partner={partner} size={32} />
          <Text style={styles.headerName} numberOfLines={1}>
            {partner?.name ?? t.conversation}
          </Text>
        </TouchableOpacity>
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
          <ImagePickerButton imageUrl={imageUrl} onChange={setImageUrl} />
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
            disabled={(!text.trim() && !imageUrl) || sending}
            style={[styles.sendBtn, ((!text.trim() && !imageUrl) || sending) && styles.sendDisabled]}
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
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginLeft: Spacing[3],
  },
  headerName: {
    flexShrink: 1,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  avatar: { backgroundColor: Colors.surfaceSecondary },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  avatarText: { color: Colors.textInverse, fontWeight: Typography.semibold },
  avatarSpacer: { width: 32 },
  list: {
    padding: Spacing[4],
    gap: Spacing[2],
    paddingBottom: Spacing[4],
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing[2],
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
  msgImage: { width: 180, height: 180, borderRadius: Radius.md, marginTop: Spacing[1] },
  translateLink: { marginTop: Spacing[1], alignSelf: 'flex-start' },
  translateLinkText: { fontSize: Typography.xs, color: Colors.primary, fontWeight: Typography.medium },
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
