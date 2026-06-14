import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Screen } from "@/src/components/layout/Screen";
import apiClient from "@/src/api/client";
import { Radius, Spacing, Typography, type ThemeColors } from "@/constants/theme";
import { useColors, useThemedStyles } from "@/src/theme";

const MAX_IMAGES = 5;

interface PickedImage {
  uri: string;
  mimeType: string;
}

export default function MentoringActivityCreateScreen() {
  const { matchId, partnerName } = useLocalSearchParams<{ matchId: string; partnerName: string }>();
  const router = useRouter();
  const Colors = useColors();
  const styles = useThemedStyles(makeStyles);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<PickedImage[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // 화면 진입 시마다 입력 상태 초기화
  useFocusEffect(
    useCallback(() => {
      setTitle("");
      setContent("");
      setImages([]);
    }, [])
  );

  const handlePickImages = async () => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      Alert.alert("알림", `사진은 최대 ${MAX_IMAGES}장까지 첨부할 수 있습니다.`);
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 필요", "사진 접근 권한이 필요합니다. 설정에서 허용해주세요.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.5,
    });
    if (!result.canceled) {
      const picked: PickedImage[] = result.assets.map((a) => ({
        uri: a.uri,
        mimeType: a.mimeType ?? "image/jpeg",
      }));
      setImages((prev) => [...prev, ...picked].slice(0, MAX_IMAGES));
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) { Alert.alert("알림", "제목을 입력해주세요."); return; }
    if (!content.trim()) { Alert.alert("알림", "내용을 입력해주세요."); return; }

    setSubmitting(true);
    try {
      // 이미지를 Base64 data URI로 변환
      const imageDataUris: string[] = [];
      for (const img of images) {
        try {
          const response = await fetch(img.uri);
          const blob = await response.blob();
          const dataUri = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          imageDataUris.push(dataUri);
        } catch {
          // 개별 이미지 변환 실패 시 무시
        }
      }

      await apiClient.post(`/mentoring/${matchId}/activities`, {
        title: title.trim(),
        content: content.trim(),
        imageDataUris,
      });
      router.replace(`/(main)/mentoring-activity?matchId=${matchId}&partnerName=${partnerName}`);
    } catch {
      Alert.alert("오류", "활동 기록 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>활동 기록 작성</Text>
          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={styles.submitBtnText}>등록</Text>
            }
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

          {/* 제목 */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>제목</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="제목을 입력하세요"
              placeholderTextColor={Colors.textTertiary}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <Text style={styles.charCount}>{title.length} / 100</Text>
          </View>

          <View style={styles.divider} />

          {/* 내용 */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>내용</Text>
            <TextInput
              style={styles.contentInput}
              placeholder={`${partnerName ?? "파트너"}와의 멘토링 활동을 기록해보세요`}
              placeholderTextColor={Colors.textTertiary}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.divider} />

          {/* 사진 첨부 */}
          <View style={styles.field}>
            <View style={styles.photoHeader}>
              <Text style={styles.fieldLabel}>사진 첨부</Text>
              <Text style={styles.photoCount}>{images.length} / {MAX_IMAGES}</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.length < MAX_IMAGES && (
                <TouchableOpacity style={styles.addPhotoBtn} onPress={handlePickImages}>
                  <Ionicons name="camera-outline" size={28} color={Colors.textTertiary} />
                  <Text style={styles.addPhotoBtnText}>사진 추가</Text>
                </TouchableOpacity>
              )}
              {images.map((img, index) => (
                <View key={index} style={styles.photoThumb}>
                  <Image source={{ uri: img.uri }} style={styles.thumbImg} />
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Ionicons name="close-circle" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <Text style={styles.photoHint}>최대 {MAX_IMAGES}장까지 첨부 가능합니다</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const THUMB = 90;
const makeStyles = (Colors: ThemeColors) => StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: Spacing[4], paddingVertical: Spacing[3], borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.background },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  submitBtn: { paddingHorizontal: Spacing[3], paddingVertical: Spacing[2], backgroundColor: Colors.primary, borderRadius: Radius.md, minWidth: 52, alignItems: "center" },
  submitBtnDisabled: { backgroundColor: Colors.textTertiary },
  submitBtnText: { fontSize: Typography.sm, fontWeight: Typography.bold, color: "#fff" },
  body: { padding: Spacing[5], gap: Spacing[5] },
  field: { gap: Spacing[2] },
  fieldLabel: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textSecondary },
  titleInput: { fontSize: Typography.lg, color: Colors.textPrimary, paddingVertical: Spacing[3], borderBottomWidth: 1, borderBottomColor: Colors.border },
  charCount: { fontSize: Typography.xs, color: Colors.textTertiary, textAlign: "right" },
  divider: { height: 1, backgroundColor: Colors.divider },
  contentInput: { fontSize: Typography.base, color: Colors.textPrimary, minHeight: 200, lineHeight: Typography.base * 1.8, paddingTop: Spacing[2] },
  photoHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  photoCount: { fontSize: Typography.xs, color: Colors.textTertiary },
  addPhotoBtn: { width: THUMB, height: THUMB, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, borderStyle: "dashed", alignItems: "center", justifyContent: "center", marginRight: Spacing[2], gap: 4, backgroundColor: Colors.surfaceSecondary },
  addPhotoBtnText: { fontSize: Typography.xs, color: Colors.textTertiary },
  photoThumb: { width: THUMB, height: THUMB, borderRadius: Radius.md, marginRight: Spacing[2] },
  thumbImg: { width: THUMB, height: THUMB, borderRadius: Radius.md },
  removeBtn: { position: "absolute", top: -8, right: -8, backgroundColor: Colors.error, borderRadius: 10, width: 20, height: 20, alignItems: "center", justifyContent: "center" },
  photoHint: { fontSize: Typography.xs, color: Colors.textTertiary },
});