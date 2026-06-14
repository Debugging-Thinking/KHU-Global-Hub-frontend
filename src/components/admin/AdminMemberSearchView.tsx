import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Screen } from "@/src/components/layout/Screen";
import { adminApi, type MemberSearchResult } from "@/src/api/admin";
import { type ThemeColors } from "@/constants/theme";
import { useColors, useThemedStyles } from "@/src/theme";

/**
 * 관리자 채팅 탭 대체 화면 — 가입 회원 목록을 표시(진입 시 전체)하고
 * 이름으로 필터 검색. 행을 누르면 타인 프로필(정지 토글 포함)로 이동.
 */
export function AdminMemberSearchView() {
  const Colors = useColors();
  const styles = useThemedStyles(makeStyles);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MemberSearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  // 진입 시 전체 회원 목록을 먼저 로드 (name='' → 전체)
  const load = useCallback(async (name: string) => {
    setLoading(true);
    try {
      setResults(await adminApi.searchMembers(name.trim()));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load("");
  }, [load]);

  const search = () => load(query);

  return (
    <Screen padded>
      <Text style={styles.title}>회원 관리</Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="이름으로 검색"
          placeholderTextColor={Colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={search}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={search} activeOpacity={0.85}>
          <Ionicons name="search" size={20} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(m) => String(m.memberId)}
          contentContainerStyle={{ paddingTop: 12 }}
          ListEmptyComponent={<Text style={styles.empty}>회원이 없습니다.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={() => router.push(`/(main)/mentor-profile?memberId=${item.memberId}`)}
            >
              {item.profileImageUrl ? (
                <Image source={{ uri: item.profileImageUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person" size={20} color={Colors.textInverse} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.dept}>{item.department}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}
        />
      )}
    </Screen>
  );
}

const makeStyles = (Colors: ThemeColors) => StyleSheet.create({
  title: { fontSize: 20, fontWeight: "700", color: Colors.textPrimary, marginBottom: 16 },
  searchRow: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.textPrimary,
    borderWidth: 1, borderColor: "#E5E7EB",
  },
  searchBtn: { width: 48, alignItems: "center", justifyContent: "center", backgroundColor: Colors.primary, borderRadius: 12 },
  empty: { color: Colors.textTertiary, textAlign: "center", marginTop: 24 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarPlaceholder: { backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 15, fontWeight: "600", color: Colors.textPrimary },
  dept: { fontSize: 13, color: Colors.textTertiary, marginTop: 2 },
});
