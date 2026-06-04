import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import apiClient, { unwrap } from "@/src/api/client";
import { Colors, Radius, Spacing, Typography } from "@/constants/theme";

export default function MentoringActivityCreateScreen() {
  const { matchId, partnerName } = useLocalSearchParams<{ matchId: string; partnerName: string }>();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("알림", "제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      Alert.alert("알림", "내용을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post(`/mentoring/${matchId}/activities`, {
        title: title.trim(),
        content: content.trim(),
      });
      router.back();
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
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>등록</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

          {/* 제목 입력 */}
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

          {/* 내용 입력 */}
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

        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  submitBtn: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    minWidth: 52,
    alignItems: "center",
  },
  submitBtnDisabled: {
    backgroundColor: Colors.textTertiary,
  },
  submitBtnText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: "#fff",
  },
  body: {
    padding: Spacing[5],
    gap: Spacing[4],
  },
  field: {
    gap: Spacing[2],
  },
  fieldLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  titleInput: {
    fontSize: Typography.lg,
    color: Colors.textPrimary,
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  charCount: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  contentInput: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    minHeight: 300,
    lineHeight: Typography.base * 1.8,
    paddingTop: Spacing[2],
  },
});