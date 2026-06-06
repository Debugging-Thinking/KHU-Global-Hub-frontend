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
import { useT } from "@/src/i18n";
import { Colors, Radius, Spacing, Typography } from "@/constants/theme";

export default function MentoringActivityCreateScreen() {
  const { matchId, partnerName } = useLocalSearchParams<{ matchId: string; partnerName: string }>();
  const router = useRouter();
  const t = useT();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert(t.noticeLabel, t.titleRequiredMsg);
      return;
    }
    if (!content.trim()) {
      Alert.alert(t.noticeLabel, t.contentRequiredMsg);
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
      Alert.alert(t.errorTitle, t.activitySubmitFail);
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
          <Text style={styles.headerTitle}>{t.activityCreateTitle}</Text>
          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>{t.submitLabel}</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

          {/* 제목 입력 */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>{t.titleFieldLabel}</Text>
            <TextInput
              style={styles.titleInput}
              placeholder={t.titleInputPlaceholder}
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
            <Text style={styles.fieldLabel}>{t.contentFieldLabel}</Text>
            <TextInput
              style={styles.contentInput}
              placeholder={t.activityContentPlaceholder(partnerName ?? t.partnerFallback)}
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