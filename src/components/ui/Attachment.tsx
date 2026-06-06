import React from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, type ImageStyle, type StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

/** S3 URL 마지막 세그먼트에서 원본 파일명 복원 (업로드 시 키 끝에 보존됨). */
export function fileNameFromUrl(url: string): string {
  try {
    const last = url.substring(url.lastIndexOf('/') + 1).split('?')[0];
    return decodeURIComponent(last) || 'file';
  } catch {
    return 'file';
  }
}

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|bmp|svg|heic|heif)$/i;

export function isImageUrl(url: string): boolean {
  return IMAGE_EXT.test(fileNameFromUrl(url));
}

/**
 * 첨부 표시. 이미지면 미리보기, 그 외 파일은 클립 아이콘 + 파일명 칩(탭하면 열림).
 */
export function Attachment({ url, imageStyle }: { url: string; imageStyle?: StyleProp<ImageStyle> }) {
  if (isImageUrl(url)) {
    return <Image source={{ uri: url }} style={[styles.image, imageStyle]} />;
  }
  const name = fileNameFromUrl(url);
  return (
    <TouchableOpacity style={styles.chip} onPress={() => Linking.openURL(url)} activeOpacity={0.7}>
      <Ionicons name="document-attach-outline" size={16} color={Colors.primary} />
      <Text style={styles.chipText} numberOfLines={1}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 180,
    height: 180,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSecondary,
    marginTop: Spacing[2],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    alignSelf: 'flex-start',
    maxWidth: '100%',
    marginTop: Spacing[2],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceSecondary,
  },
  chipText: {
    flexShrink: 1,
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
});
