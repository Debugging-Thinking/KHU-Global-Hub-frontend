import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pickFiles } from '@/src/lib/pickImages';
import { imageApi } from '@/src/api/image';
import { fileNameFromUrl, isImageUrl } from '@/src/components/ui/Attachment';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

/**
 * 첨부 버튼(클립). 탭 → 파일 선택(이미지·문서) → S3 업로드 → 미리보기(+삭제).
 * url/onChange는 부모가 관리. 업로드된 S3 URL을 onChange로 올려준다.
 */
export function ImagePickerButton({
  imageUrl,
  onChange,
  size = 22,
}: {
  imageUrl: string | null;
  onChange: (url: string | null) => void;
  size?: number;
}) {
  const [busy, setBusy] = useState(false);

  const pick = async () => {
    setBusy(true);
    try {
      const picked = await pickFiles(false);
      if (!picked[0]) return;
      const url = await imageApi.upload(picked[0]);
      onChange(url);
    } catch {
      /* 업로드 실패 시 무시 */
    } finally {
      setBusy(false);
    }
  };

  if (imageUrl) {
    return (
      <View style={styles.previewWrap}>
        {isImageUrl(imageUrl) ? (
          <Image source={{ uri: imageUrl }} style={styles.preview} />
        ) : (
          <View style={styles.filePreview}>
            <Ionicons name="document-attach-outline" size={16} color={Colors.primary} />
            <Text style={styles.fileName} numberOfLines={1}>{fileNameFromUrl(imageUrl)}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.removeBtn} onPress={() => onChange(null)} hitSlop={8}>
          <Ionicons name="close-circle" size={20} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <TouchableOpacity onPress={pick} disabled={busy} style={styles.iconBtn} hitSlop={8}>
      {busy ? (
        <ActivityIndicator size="small" color={Colors.primary} />
      ) : (
        <Ionicons name="attach" size={size} color={Colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconBtn: { padding: Spacing[1], alignItems: 'center', justifyContent: 'center' },
  previewWrap: { position: 'relative' },
  preview: { width: 44, height: 44, borderRadius: Radius.sm, backgroundColor: Colors.surfaceSecondary },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    maxWidth: 160,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceSecondary,
  },
  fileName: { flexShrink: 1, fontSize: Typography.xs, color: Colors.primary },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.overlay,
    borderRadius: Radius.full,
  },
});
