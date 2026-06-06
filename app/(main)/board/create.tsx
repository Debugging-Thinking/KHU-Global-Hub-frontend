import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { pickFiles, type PickedImage } from '@/src/lib/pickImages';
import { Screen } from '@/src/components/layout/Screen';
import { Button } from '@/src/components/ui/Button';
import { boardApi } from '@/src/api/board';
import { useAuthStore } from '@/src/store/authStore';
import { useT } from '@/src/i18n';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export default function CreatePostScreen() {
  const router = useRouter();
  const t = useT();
  const language = useAuthStore((s) => s.profile?.language ?? 'KO');
  const { postId } = useLocalSearchParams<{ postId?: string }>();
  const editing = !!postId;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<PickedImage[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [editLang, setEditLang] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 새 글 작성 모드에서만 포커스 시 초기화 (수정 모드는 prefill 유지)
  useFocusEffect(useCallback(() => {
    if (editing) return;
    setTitle('');
    setContent('');
    setImages([]);
    setIsAnonymous(false);
    setError('');
  }, [editing]));

  // 수정 모드: 기존 글 원문을 불러와 채움
  useEffect(() => {
    if (!postId) return;
    boardApi.getPost(Number(postId), language as any)
      .then((p) => {
        setTitle(p.originalTitle || p.title);
        setContent(p.originalContent || p.content);
        setIsAnonymous(p.isAnonymous);
        setEditLang(p.originalLanguage);
      })
      .catch(() => {});
  }, [postId]);

  const addImages = async () => {
    const picked = await pickFiles(true);
    if (picked.length) setImages((prev) => [...prev, ...picked].slice(0, 5));
  };

  const isImageAsset = (a: PickedImage) =>
    (a.mimeType ?? '').startsWith('image') || /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(a.fileName ?? '');

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError(t.titleContentRequired);
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (editing) {
        await boardApi.updatePost(Number(postId), { title, content, isAnonymous, language: (editLang ?? language) as any }, images);
        router.replace(`/(main)/board/${postId}`);
      } else {
        await boardApi.createPost({ title, content, isAnonymous, language: language as any }, images);
        router.back();
      }
    } catch (e: any) {
      setError(e?.response?.data?.message ?? t.createPostFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.createPost}</Text>
        <Button label={t.postButton} onPress={handleSubmit} loading={loading} size="sm" />
      </View>

      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* 제목 */}
        <View style={styles.titleInput}>
          <TextInput
            placeholder={t.titlePlaceholder}
            placeholderTextColor={Colors.textTertiary}
            style={styles.titleText}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* 내용 */}
        <TextInput
          placeholder={t.contentPlaceholder}
          placeholderTextColor={Colors.textTertiary}
          style={styles.contentText}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        {/* 이미지 첨부 (최대 5장) */}
        <View style={styles.imageRow}>
          {images.map((img, i) => (
            <View key={i} style={styles.thumbWrap}>
              {isImageAsset(img) ? (
                <Image source={{ uri: img.uri }} style={styles.thumb} />
              ) : (
                <View style={styles.fileThumb}>
                  <Ionicons name="document-attach-outline" size={20} color={Colors.primary} />
                  <Text style={styles.fileThumbName} numberOfLines={2}>{img.fileName ?? 'file'}</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.thumbRemove}
                onPress={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                hitSlop={6}
              >
                <Ionicons name="close-circle" size={18} color={Colors.textInverse} />
              </TouchableOpacity>
            </View>
          ))}
          {images.length < 5 && (
            <TouchableOpacity style={styles.addImage} onPress={addImages}>
              <Ionicons name="attach" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* 익명 설정 */}
        <View style={styles.anonymousRow}>
          <Ionicons name="person-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.anonymousLabel}>{t.postAnonymously}</Text>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            trackColor={{ false: Colors.border, true: Colors.primaryMuted }}
            thumbColor={isAnonymous ? Colors.primary : Colors.textTertiary}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  scroll: { flex: 1, backgroundColor: Colors.surface },
  titleInput: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  titleText: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    padding: 0,
  },
  contentText: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    fontSize: Typography.base,
    color: Colors.textPrimary,
    minHeight: 300,
    lineHeight: Typography.base * Typography.relaxed,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
  },
  thumbWrap: { position: 'relative' },
  thumb: { width: 64, height: 64, borderRadius: Radius.sm, backgroundColor: Colors.surfaceSecondary },
  fileThumb: {
    width: 64, height: 64, borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center', padding: 4, gap: 2,
  },
  fileThumbName: { fontSize: 9, color: Colors.textSecondary, textAlign: 'center' },
  thumbRemove: { position: 'absolute', top: -6, right: -6, backgroundColor: Colors.overlay, borderRadius: Radius.full },
  addImage: {
    width: 64,
    height: 64,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  anonymousRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  anonymousLabel: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  error: {
    fontSize: Typography.sm,
    color: Colors.error,
    textAlign: 'center',
    padding: Spacing[4],
  },
});
