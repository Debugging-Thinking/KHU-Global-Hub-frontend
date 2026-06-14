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
import { AuthorName } from '@/src/components/ui/AuthorName';
import { Attachment } from '@/src/components/ui/Attachment';
import { ImagePickerButton } from '@/src/components/ui/ImagePickerButton';
import { boardApi } from '@/src/api/board';
import { useAuthStore } from '@/src/store/authStore';
import { useT, timeAgo } from '@/src/i18n';
import { isPrestoredMode } from '@/src/i18n/preferredLanguage';
import { useItemTranslation } from '@/src/hooks/useTextTranslate';
import type { Language } from '@/src/i18n';
import { Radius, Spacing, Typography, type ThemeColors } from '@/constants/theme';
import { useColors, useThemedStyles } from '@/src/theme';
import type { CommentResponse, PostDetail } from '@/src/types/board';

/** 항목별 원문↔번역 토글 링크. */
function ItemToggle({ tr }: { tr: ReturnType<typeof useItemTranslation> }) {
  const t = useT();
  const styles = useThemedStyles(makeStyles);
  if (!tr.showToggle) return null;
  return (
    <TouchableOpacity onPress={tr.toggle} style={styles.commentTranslate}>
      <Text style={styles.commentTranslateText}>
        {tr.loading ? t.translating : tr.showOriginal ? t.viewTranslation : t.viewOriginal}
      </Text>
    </TouchableOpacity>
  );
}

function ReplyItem({
  comment,
  prestored,
  viewerBucket,
  preferredCode,
  onDelete,
  onAuthorPress,
}: {
  comment: CommentResponse;
  prestored: boolean;
  viewerBucket: Language;
  preferredCode: string;
  onDelete: (id: number) => void;
  onAuthorPress: (id: number) => void;
}) {
  const t = useT();
  const Colors = useColors();
  const styles = useThemedStyles(makeStyles);
  const isAdmin = useAuthStore((s) => s.profile?.isAdmin);
  const tr = useItemTranslation([comment.content], [comment.originalContent], comment.originalLanguage, prestored, viewerBucket, preferredCode);
  return (
    <View style={styles.replyItem}>
      <View style={styles.commentHeader}>
        <AuthorName name={comment.authorName ?? t.anonymous} authorId={comment.authorId} onPress={onAuthorPress} style={styles.commentAuthor} />
        <Text style={styles.commentTime}>{timeAgo(comment.createdAt, t)}</Text>
        {(comment.isOwner || isAdmin) && (
          <TouchableOpacity onPress={() => onDelete(comment.commentId)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={13} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.commentContent}>{tr.displays[0]}</Text>
      {comment.imageUrl ? <Attachment url={comment.imageUrl} imageStyle={styles.commentImage} /> : null}
      <ItemToggle tr={tr} />
    </View>
  );
}

function CommentItem({
  comment,
  prestored,
  viewerBucket,
  preferredCode,
  onLike,
  onDelete,
  onAuthorPress,
}: {
  comment: CommentResponse;
  prestored: boolean;
  viewerBucket: Language;
  preferredCode: string;
  onLike: (id: number) => void;
  onDelete: (id: number) => void;
  onAuthorPress: (id: number) => void;
}) {
  const t = useT();
  const Colors = useColors();
  const styles = useThemedStyles(makeStyles);
  const isAdmin = useAuthStore((s) => s.profile?.isAdmin);
  const tr = useItemTranslation([comment.content], [comment.originalContent], comment.originalLanguage, prestored, viewerBucket, preferredCode);
  return (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <AuthorName name={comment.authorName ?? t.anonymous} authorId={comment.authorId} onPress={onAuthorPress} style={styles.commentAuthor} />
        <Text style={styles.commentTime}>{timeAgo(comment.createdAt, t)}</Text>
        {(comment.isOwner || isAdmin) && (
          <TouchableOpacity onPress={() => onDelete(comment.commentId)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={13} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.commentContent}>{tr.displays[0]}</Text>
      {comment.imageUrl ? <Attachment url={comment.imageUrl} imageStyle={styles.commentImage} /> : null}
      <View style={styles.commentActions}>
        {isAdmin ? (
          <View style={styles.commentLike}>
            <Ionicons
              name={comment.isLiked ? 'heart' : 'heart-outline'}
              size={13}
              color={comment.isLiked ? Colors.error : Colors.textTertiary}
            />
            <Text style={styles.commentLikeText}>{comment.likeCount}</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={() => onLike(comment.commentId)} style={styles.commentLike}>
            <Ionicons
              name={comment.isLiked ? 'heart' : 'heart-outline'}
              size={13}
              color={comment.isLiked ? Colors.error : Colors.textTertiary}
            />
            <Text style={styles.commentLikeText}>{comment.likeCount}</Text>
          </TouchableOpacity>
        )}
        <ItemToggle tr={tr} />
      </View>
      {comment.children.map((child) => (
        <ReplyItem
          key={child.commentId}
          comment={child}
          prestored={prestored}
          viewerBucket={viewerBucket}
          preferredCode={preferredCode}
          onDelete={onDelete}
          onAuthorPress={onAuthorPress}
        />
      ))}
    </View>
  );
}

export default function PostDetailScreen() {
  const router = useRouter();
  const t = useT();
  const Colors = useColors();
  const styles = useThemedStyles(makeStyles);
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const userLanguage = useAuthStore((s) => s.profile?.language ?? 'KO');
  const preferredCode = useAuthStore((s) => s.profile?.preferredLanguage ?? 'en');
  const isAdmin = useAuthStore((s) => s.profile?.isAdmin);
  // 사전번역(6개) 모드: 원문/번역 재조회 토글. 그 외: 원문 + on-demand "번역하기".
  const prestored = isPrestoredMode(preferredCode);

  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const [commentAnonymous, setCommentAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  // 게시글 본문(제목+본문 한 단위) 항목별 원문↔번역 토글.
  const postTr = useItemTranslation(
    [post?.title ?? '', post?.content ?? ''],
    [post?.originalTitle ?? '', post?.originalContent ?? ''],
    post?.originalLanguage,
    prestored,
    userLanguage as Language,
    preferredCode,
  );

  const fetchComments = async () => {
    const id = Number(postId);
    const c = await boardApi.getComments(id, userLanguage as any);
    setComments(c);
  };

  useEffect(() => {
    const id = Number(postId);
    Promise.all([
      boardApi.getPost(id, userLanguage as any),
      boardApi.getComments(id, userLanguage as any),
    ])
      .then(([p, c]) => {
        setPost(p);
        setComments(c);
        setLiked(p.isLiked);
        setLikeCount(p.likeCount);
      })
      .finally(() => setLoading(false));
  }, [postId, userLanguage]);

  const goProfile = (id: number) => router.push(`/(main)/mentor-profile?memberId=${id}` as any);

  const handleLike = async () => {
    try {
      await boardApi.likePost(Number(postId));
      setLiked((v) => !v);
      setLikeCount((v) => liked ? v - 1 : v + 1);
    } catch {}
  };

  const handleComment = async () => {
    if (!commentText.trim() && !commentImage) return;  // 텍스트 또는 첨부 중 하나만 있어도 작성
    setSubmitting(true);
    try {
      await boardApi.createComment(Number(postId), {
        content: commentText,
        isAnonymous: commentAnonymous,
        language: userLanguage as any,
        imageUrl: commentImage,
      });
      await fetchComments();
      setCommentText('');
      setCommentImage(null);
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
        router.navigate('/(main)');
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

  const bodyTitle = postTr.displays[0];
  const bodyContent = postTr.displays[1];

  return (
    <Screen padded={false}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.navigate('/(main)')}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {post.title}
        </Text>
        {(post.isOwner || isAdmin) ? (
          <View style={{ flexDirection: 'row', gap: Spacing[3] }}>
            {post.isOwner && (
              <TouchableOpacity onPress={() => router.push(`/(main)/board/create?postId=${postId}`)}>
                <Ionicons name="pencil-outline" size={21} color={Colors.primary} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleDeletePost}>
              <Ionicons name="trash-outline" size={21} color={Colors.error} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 게시글 본문 */}
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{bodyTitle}</Text>
          <View style={styles.postMeta}>
            <AuthorName
              name={post.isAnonymous ? t.anonymous : post.authorName ?? t.unknown}
              authorId={post.isAnonymous ? null : post.authorId}
              onPress={goProfile}
              style={styles.metaText}
            />
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{timeAgo(post.createdAt, t)}</Text>
          </View>

          {/* 게시글 본문 원문↔번역 토글 (항목별) */}
          {postTr.showToggle && (
            <TouchableOpacity onPress={postTr.toggle} style={styles.translateBtn} disabled={postTr.loading}>
              <Ionicons
                name={postTr.showOriginal ? 'document-text-outline' : 'language-outline'}
                size={14}
                color={Colors.primary}
              />
              <Text style={styles.translateBtnText}>
                {postTr.loading ? t.translating : postTr.showOriginal ? t.viewTranslation : t.viewOriginal}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.postBody}>{bodyContent}</Text>

          {post.imageUrls.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.images}>
              {post.imageUrls.map((url, i) => (
                <Attachment key={i} url={url} imageStyle={styles.image} />
              ))}
            </ScrollView>
          )}

          <View style={styles.postActions}>
            {isAdmin ? (
              <View style={styles.action}>
                <Ionicons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={20}
                  color={liked ? Colors.error : Colors.textTertiary}
                />
                <Text style={styles.actionText}>{likeCount}</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={handleLike} style={styles.action}>
                <Ionicons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={20}
                  color={liked ? Colors.error : Colors.textTertiary}
                />
                <Text style={styles.actionText}>{likeCount}</Text>
              </TouchableOpacity>
            )}
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
              prestored={prestored}
              viewerBucket={userLanguage as Language}
              preferredCode={preferredCode}
              onLike={handleCommentLike}
              onDelete={handleDeleteComment}
              onAuthorPress={goProfile}
            />
          ))}
          <View style={{ height: Spacing[16] }} />
        </View>
      </ScrollView>

      {/* 댓글 입력 (관리자는 작성 불가 — 숨김) */}
      {!isAdmin && (
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
            <ImagePickerButton imageUrl={commentImage} onChange={setCommentImage} />
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
      )}
    </Screen>
  );
}

const makeStyles = (Colors: ThemeColors) => StyleSheet.create({
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
  commentImage: { width: 160, height: 160, borderRadius: Radius.md, marginTop: Spacing[1] },
  deleteBtn: { marginLeft: 'auto' },
  commentActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  commentLike: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  commentLikeText: { fontSize: Typography.xs, color: Colors.textTertiary },
  commentTranslate: { alignSelf: 'flex-start' },
  commentTranslateText: { fontSize: Typography.xs, color: Colors.primary, fontWeight: Typography.medium },
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
