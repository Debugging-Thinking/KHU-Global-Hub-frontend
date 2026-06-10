import React, { useState } from "react";
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

import { Screen } from "@/src/components/layout/Screen";
import { adminApi, type MemberSearchResult } from "@/src/api/admin";
import { Colors } from "@/constants/theme";

/**
 * 관리자 채팅 탭 대체 화면 — 가입 회원을 이름으로 검색해 조회.
 */
export function AdminMemberSearchView() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MemberSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      setResults(await adminApi.searchMembers(query.trim()));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded>
      <Text style={styles.title}>회원 검색</Text>
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
          ListEmptyComponent={
            searched ? <Text style={styles.empty}>검색 결과가 없습니다.</Text> : null
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
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
            </View>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
