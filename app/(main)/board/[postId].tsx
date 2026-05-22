import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

function confirmAction(title: string, message: string, cancelLabel: string, deleteLabel: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n${message}`)) onConfirm();
  } else {
    Alert.alert(title, message, [
      { text: cancelLabel, style: 'cancel' },
      { text: deleteLabel, style: 'destructive', onPress: onConfirm },
    ]);
  }
}
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/src/components/layout/Screen';
import { boardApi } from '@/src/api/board';
import { useAuthStore } from '@/src/store/authStore';
import { useT, timeAgo } from '@/src/i18n';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { CommentResponse, PostDetail } from '@/src/types/board';

function CommentItem({
  comment,
  cancelLabel,
  deleteLabel,
  onLike,
  onDelete,
}: {
  comment: CommentResponse;
  cancelLabel: string;
  deleteLabel: string;
  onLike: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const t = useT();
  return (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentAuthor}>
          {comment.authorName ?? t.anonymous}
        </Text>
        <Text style={styles.commentTime}>{timeAgo(comment.createdAt, t)}</Text>
        {comment.isOwner && (
          <TouchableOpacity onPress={() => onDelete(comment.commentId)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={13} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.commentContent}>{comment.content}</Text>
      <TouchableOpacity onPress={() => onLike(comment.commentId)} style={styles.commentLike}>
        <Ionicons
          name={comment.isLiked ? 'heart' : 'heart-outline'}
          size={13}
          color={comment.isLiked ? Colors.error : Colors.textTertiary}
        />
        <Text style={styles.commentLikeText}>{comment.likeCount}</Text>
      </TouchableOpacity>
      {comment.children.map((child) => (
        <View key={child.commentId} style={styles.replyItem}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentAuthor}>{child.authorName ?? t.anonymous}</Text>
            <Text style={styles.commentTime}>{timeAgo(child.createdAt, t)}</Text>
            {child.isOwner && (
              <TouchableOpacity onPress={() => onDelete(child.commentId)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={13} color={Colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.commentContent}>{child.content}</Text>
        </View>
      ))}
    </View>
  );
}

export default function PostDetailScreen() {
  const router = useRouter();
  const t = useT();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const userLanguage = useAuthStore((s) => s.profile?.language ?? 'KO');

  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentAnonymous, setCommentAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  // 번역 토글: false = 번역본(기본), true = 원문
  const [showingOriginal, setShowingOriginal] = useState(false);

  const fetchPost = async (lang: string) => {
    const id = Number(postId);
    const p = await boardApi.getPost(id, lang as any);
    setPost(p);
    setLiked(p.isLiked);
    setLikeCount(p.likeCount);
  };

  const fetchComments = async () => {
    const id = Number(postId);
    const c = await boardApi.getComments(id, userLanguage as any);
    setComments(c);
  };

  useEffect(() => {
    const id = Number(postId);
    setShowingOriginal(false);
    Promise.all([boardApi.getPost(id, userLanguage as any), boardApi.getComments(id, userLanguage as any)])
      .then(([p, c]) => {
        setPost(p);
        setComments(c);
        setLiked(p.isLiked);
        setLikeCount(p.likeCount);
      })
      .finally(() => setLoading(false));
  }, [postId, userLanguage]);

  const handleToggleTranslation = async () => {
    if (!post) return;
    const nextShowingOriginal = !showingOriginal;
    const fetchLang = nextShowingOriginal ? post.originalLanguage : userLanguage;
    try {
      await fetchPost(fetchLang);
      setShowingOriginal(nextShowingOriginal);
    } catch {}
  };

  const handleLike = async () => {
    try {
      await boardApi.likePost(Number(postId));
      setLiked((v) => !v);
      setLikeCount((v) => liked ? v - 1 : v + 1);
    } catch {}
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await boardApi.createComment(Number(postId), {
        content: commentText,
        isAnonymous: commentAnonymous,
        language: userLanguage as any,
      });
      await fetchComments();
      setCommentText('');
    } catch {} finally {
      setSubmitting(false);
    }
  };

  const handleCommentLike = async (commentId: number) => {
    try {
      await boardApi.likeComment(commentId);
      await fetchComments();
    } catch {}
  };

  const handleDeletePost = () => {
    confirmAction(t.deletePost, t.confirmDeletePost, t.cancel, t.delete, async () => {
      try {
        await boardApi.deletePost(Number(postId));
        router.back();
      } catch {}
    });
  };

  const handleDeleteComment = (commentId: number) => {
    confirmAction(t.deleteComment, t.confirmDeleteComment, t.cancel, t.delete, async () => {
      try {
        await boardApi.deleteComment(commentId);
        await fetchComments();
      } catch {}
    });
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      </Screen>
    );
  }

  if (!post) return null;

  // 원문 언어와 사용자 언어가 같으면 토글 불필요
  const showToggle = post.originalLanguage !== userLanguage;

  return (
    <Screen padded={false}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {post.title}
        </Text>
        {post.isOwner ? (
          <TouchableOpacity onPress={handleDeletePost}>
            <Ionicons name="trash-outline" size={22} color={Colors.error} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 게시글 본문 */}
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <View style={styles.postMeta}>
            <Text style={styles.metaText}>
              {post.isAnonymous ? t.anonymous : post.authorName ?? t.unknown}
            </Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{timeAgo(post.createdAt, t)}</Text>
          </View>

          {/* 번역 토글 버튼 */}
          {showToggle && (
            <TouchableOpacity onPress={handleToggleTranslation} style={styles.translateBtn}>
              <Ionicons
                name={showingOriginal ? 'language-outline' : 'document-text-outline'}
                size={14}
                color={Colors.primary}
              />
              <Text style={styles.translateBtnText}>
                {showingOriginal ? t.viewTranslation : t.viewOriginal}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.postBody}>{post.content}</Text>

          {post.imageUrls.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.images}>
              {post.imageUrls.map((url, i) => (
                <Image key={i} source={{ uri: url }} style={styles.image} />
              ))}
            </ScrollView>
          )}

          <View style={styles.postActions}>
            <TouchableOpacity onPress={handleLike} style={styles.action}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={20}
                color={liked ? Colors.error : Colors.textTertiary}
              />
              <Text style={styles.actionText}>{likeCount}</Text>
            </TouchableOpacity>
            <View style={styles.action}>
              <Ionicons name="chatbubble-outline" size={20} color={Colors.textTertiary} />
              <Text style={styles.actionText}>{post.commentCount}</Text>
            </View>
          </View>
        </View>

        {/* 댓글 */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>{t.commentsLabel(comments.length)}</Text>
          {comments.map((c) => (
            <CommentItem
              key={c.commentId}
              comment={c}
              cancelLabel={t.cancel}
              deleteLabel={t.delete}
              onLike={handleCommentLike}
              onDelete={handleDeleteComment}
            />
          ))}
          <View style={{ height: Spacing[16] }} />
        </View>
      </ScrollView>

      {/* 댓글 입력 */}
      <View style={styles.commentInput}>
        <View style={styles.commentInputTop}>
          <TouchableOpacity
            onPress={() => setCommentAnonymous(v => !v)}
            style={styles.anonymousToggle}
          >
            <Ionicons
              name={commentAnonymous ? 'checkbox' : 'square-outline'}
              size={16}
              color={commentAnonymous ? Colors.primary : Colors.textTertiary}
            />
            <Text style={[styles.anonymousLabel, commentAnonymous && { color: Colors.primary }]}>
              {t.anonymous}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.commentInputRow}>
          <TextInput
            style={styles.textInput}
            placeholder={t.commentPlaceholder}
            placeholderTextColor={Colors.textTertiary}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            onPress={handleComment}
            disabled={!commentText.trim() || submitting}
            style={[styles.sendBtn, (!commentText.trim() || submitting) && styles.sendBtnDisabled]}
          >
            <Ionicons name="send" size={18} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginHorizontal: Spacing[2],
  },
  scroll: { flex: 1 },
  postContent: {
    backgroundColor: Colors.surface,
    padding: Spacing[5],
    gap: Spacing[3],
  },
  postTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    lineHeight: Typography.xl * Typography.normal,
  },
  postMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1] },
  metaText: { fontSize: Typography.sm, color: Colors.textTertiary },
  metaDot: { fontSize: Typography.sm, color: Colors.textTertiary },
  translateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  translateBtnText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
  postBody: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: Typography.base * Typography.relaxed,
  },
  images: { marginTop: Spacing[2] },
  image: {
    width: 200,
    height: 150,
    borderRadius: Radius.md,
    marginRight: Spacing[2],
  },
  postActions: {
    flexDirection: 'row',
    gap: Spacing[5],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1] },
  actionText: { fontSize: Typography.sm, color: Colors.textTertiary },
  commentsSection: {
    padding: Spacing[5],
    gap: Spacing[3],
  },
  commentsTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  commentItem: {
    gap: Spacing[1],
    paddingBottom: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  commentHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  commentAuthor: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  commentTime: { fontSize: Typography.xs, color: Colors.textTertiary },
  commentContent: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    lineHeight: Typography.sm * Typography.relaxed,
  },
  deleteBtn: { marginLeft: 'auto' },
  commentLike: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  commentLikeText: { fontSize: Typography.xs, color: Colors.textTertiary },
  replyItem: {
    marginLeft: Spacing[4],
    paddingLeft: Spacing[3],
    borderLeftWidth: 2,
    borderLeftColor: Colors.border,
    gap: Spacing[1],
    marginTop: Spacing[2],
  },
  commentInput: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[2],
    paddingBottom: Spacing[4],
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: Spacing[2],
  },
  commentInputTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  anonymousToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  anonymousLabel: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing[3],
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.border },
});
