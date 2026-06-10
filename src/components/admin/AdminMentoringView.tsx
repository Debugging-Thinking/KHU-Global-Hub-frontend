import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Screen } from "@/src/components/layout/Screen";
import { Card } from "@/src/components/ui/Card";
import { adminApi, type AdminMatch } from "@/src/api/admin";
import { Colors } from "@/constants/theme";

/**
 * 관리자 멘토링 화면 — 자동 스케줄러를 대체하는 수동 매칭 실행 + 전체 매칭 현황.
 * 일반 사용자 멘토링 화면(내 매칭)과 완전히 분리.
 */
export function AdminMentoringView() {
  const [matches, setMatches] = useState<AdminMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi
      .getAllMatches()
      .then(setMatches)
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const run = async () => {
    setRunning(true);
    setMsg(null);
    try {
      await adminApi.runMatching();
      setMsg("✅ 매칭이 완료되었습니다.");
      load();
    } catch (e: any) {
      setMsg("⚠ " + (e?.response?.data?.message ?? "매칭 실행에 실패했습니다."));
    } finally {
      setRunning(false);
    }
  };

  return (
    <Screen scrollable padded>
      <Text style={styles.title}>멘토링 매칭 관리</Text>
      <Text style={styles.desc}>자동 스케줄러 대신 운영자가 직접 매칭을 실행합니다.</Text>

      <TouchableOpacity
        style={[styles.runBtn, running && styles.runBtnDisabled]}
        onPress={run}
        disabled={running}
        activeOpacity={0.85}
      >
        <Ionicons name="git-merge-outline" size={18} color={Colors.textInverse} />
        <Text style={styles.runBtnText}>{running ? "매칭 실행 중..." : "지금 매칭 실행"}</Text>
      </TouchableOpacity>
      {msg && <Text style={styles.msg}>{msg}</Text>}

      <Text style={styles.subtitle}>전체 매칭 현황 ({matches.length})</Text>
      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
      ) : matches.length === 0 ? (
        <Text style={styles.empty}>아직 매칭이 없습니다. 위 버튼으로 매칭을 실행하세요.</Text>
      ) : (
        matches.map((m) => (
          <Card key={m.matchId} style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.pair}>
                <Text style={styles.mentor}>{m.mentorName}</Text>
                <Text style={styles.role}> 멘토</Text>
                <Text style={styles.arrow}>  ↔  </Text>
                <Text style={styles.mentee}>{m.menteeName}</Text>
                <Text style={styles.role}> 멘티</Text>
              </Text>
            </View>
            <Text style={styles.meta}>{m.semester} · {m.status}</Text>
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "700", color: Colors.textPrimary, marginBottom: 4 },
  desc: { fontSize: 13, color: Colors.textTertiary, marginBottom: 16 },
  runBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: 12,
  },
  runBtnDisabled: { opacity: 0.6 },
  runBtnText: { color: Colors.textInverse, fontWeight: "700", fontSize: 15 },
  msg: { marginTop: 10, color: Colors.textPrimary, textAlign: "center" },
  subtitle: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary, marginTop: 24, marginBottom: 10 },
  empty: { color: Colors.textTertiary, textAlign: "center", marginTop: 20 },
  card: { marginBottom: 10, padding: 14 },
  cardRow: { flexDirection: "row", alignItems: "center" },
  pair: { fontSize: 14, color: Colors.textPrimary, flexShrink: 1 },
  mentor: { fontWeight: "700", color: Colors.accent },
  mentee: { fontWeight: "700", color: Colors.primary },
  role: { fontSize: 12, color: Colors.textTertiary },
  arrow: { color: Colors.textTertiary },
  meta: { fontSize: 12, color: Colors.textTertiary, marginTop: 4 },
});
