import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Screen } from "@/src/components/layout/Screen";
import { Card } from "@/src/components/ui/Card";
import { adminApi, type AdminMatch, type MentoringQueue, type QueueMember } from "@/src/api/admin";
import { Colors } from "@/constants/theme";

const MENTOR_COLOR = "#0D9488"; // 멘토 = 틸 청록 (멘티 빨강의 보색 — 대비 선명 + 차분)
const MENTEE_COLOR = Colors.primary; // 멘티 = 경희 레드

function currentSemester() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() < 6 ? "1" : "2"}`;
}

/**
 * 관리자 멘토링 화면 — 학기별 매칭 현황 + 전역 대기열에서 멤버를 선택해 그 학기로 매칭.
 * 대기열은 백엔드가 저장된 역할로 나눈 그대로 좌우 분리(멘토/멘티 = 각자 가입 시 고른 역할).
 * 체크박스 = 선택 토글, 카드 본문 탭 = 프로필 화면 이동.
 */
export function AdminMentoringView() {
  const router = useRouter();
  const [matches, setMatches] = useState<AdminMatch[]>([]);
  const [queue, setQueue] = useState<MentoringQueue>({ waitingMentors: [], waitingMentees: [] });
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [semester, setSemester] = useState(currentSemester());
  const [extraSemesters, setExtraSemesters] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [newSem, setNewSem] = useState("");

  const [selected, setSelected] = useState<Set<number>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [m, q] = await Promise.all([adminApi.getAllMatches(), adminApi.getQueue()]);
      setMatches(m);
      setQueue(q);
    } catch {
      setMatches([]);
      setQueue({ waitingMentors: [], waitingMentees: [] });
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const semesters = useMemo(() => {
    const set = new Set<string>([currentSemester(), semester, ...matches.map((x) => x.semester), ...extraSemesters]);
    return Array.from(set).sort().reverse();
  }, [matches, extraSemesters, semester]);

  const semesterMatches = matches.filter((m) => m.semester === semester);

  // 좌우 분리 = 백엔드가 저장된 역할(가입 시 본인 선택, 관리자 변경 반영)로 나눠 준 그대로 사용.
  // waitingMentors=멘토 / waitingMentees=멘티. 입학년도로 재분류하지 않는다 — 선배가 멘티를
  // 선택했어도 본인이 고른 역할대로 표시하고, 매칭 시 필요하면 백엔드가 자동 승격한다.
  // (입학년도로 끌어올리면 prod처럼 멘티가 전원 선배일 때 멘티 컬럼이 비는 버그가 났었음)
  const mentorCol = queue.waitingMentors;
  const menteeCol = queue.waitingMentees;
  const allQueue = useMemo(() => [...queue.waitingMentors, ...queue.waitingMentees], [queue]);

  const allSelected = allQueue.length > 0 && allQueue.every((m) => selected.has(m.memberId));

  const toggle = (id: number) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(allQueue.map((m) => m.memberId)));
  const openProfile = (memberId: number) =>
    router.push(`/(main)/mentor-profile?memberId=${memberId}`);

  const addSemester = () => {
    const v = newSem.trim();
    if (v) {
      setExtraSemesters((e) => [...e, v]);
      setSemester(v);
    }
    setNewSem("");
    setAdding(false);
  };

  const run = async () => {
    if (selected.size === 0) {
      setMsg("매칭할 멤버를 선택하세요.");
      return;
    }
    setRunning(true);
    setMsg(null);
    try {
      await adminApi.runMatching(semester, Array.from(selected));
      setMsg(`✅ ${semester} 매칭 완료`);
      setSelected(new Set());
      await load();
    } catch (e: any) {
      setMsg("⚠ " + (e?.response?.data?.message ?? "매칭 실행에 실패했습니다."));
    } finally {
      setRunning(false);
    }
  };

  return (
    <Screen scrollable padded>
      <Text style={styles.title}>멘토링 매칭 관리</Text>

      {/* 학기 선택 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.semRow}
        contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
      >
        {semesters.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.semChip, s === semester && styles.semChipActive]}
            onPress={() => setSemester(s)}
          >
            <Text style={[styles.semText, s === semester && styles.semTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
        {adding ? (
          <View style={styles.addRow}>
            <TextInput
              style={styles.addInput}
              value={newSem}
              onChangeText={setNewSem}
              placeholder="예: 2026-2"
              placeholderTextColor={Colors.textTertiary}
              autoFocus
              onSubmitEditing={addSemester}
            />
            <TouchableOpacity onPress={addSemester}>
              <Ionicons name="checkmark" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.semAdd} onPress={() => setAdding(true)}>
            <Ionicons name="add" size={16} color={Colors.primary} />
            <Text style={styles.semAddText}>학기</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 24 }} />
      ) : (
        <>
          {/* 현황 */}
          <Text style={styles.section}>{semester} 매칭 현황 ({semesterMatches.length})</Text>
          {semesterMatches.length === 0 ? (
            <Text style={styles.empty}>이 학기에 매칭이 없습니다.</Text>
          ) : (
            semesterMatches.map((m) => (
              <Card key={m.matchId} style={styles.matchCard}>
                <Text style={styles.pair}>
                  <Text style={styles.mentor}>{m.mentorName}</Text> 멘토 ↔ <Text style={styles.mentee}>{m.menteeName}</Text> 멘티
                </Text>
                <Text style={styles.meta}>{m.status}</Text>
              </Card>
            ))
          )}

          {/* 대기열 — 좌(멘토) / 우(멘티) */}
          <View style={styles.queueHeader}>
            <Text style={styles.section}>매칭 대기열 ({allQueue.length})</Text>
            {allQueue.length > 0 && (
              <TouchableOpacity onPress={toggleAll}>
                <Text style={styles.selectAll}>{allSelected ? "전체 해제" : "전체 선택"}</Text>
              </TouchableOpacity>
            )}
          </View>
          {allQueue.length === 0 ? (
            <Text style={styles.empty}>대기 중인 멤버가 없습니다.</Text>
          ) : (
            <View style={styles.cols}>
              <QueueCol title="멘토" hint="멘토로 등록" color={MENTOR_COLOR} members={mentorCol} selected={selected} onToggle={toggle} onView={openProfile} />
              <QueueCol title="멘티" hint="멘티로 등록" color={MENTEE_COLOR} members={menteeCol} selected={selected} onToggle={toggle} onView={openProfile} />
            </View>
          )}
        </>
      )}

      {msg && <Text style={styles.msg}>{msg}</Text>}

      <TouchableOpacity
        style={[styles.runBtn, (running || selected.size === 0) && styles.runBtnDisabled]}
        onPress={run}
        disabled={running || selected.size === 0}
        activeOpacity={0.85}
      >
        <Ionicons name="link-outline" size={18} color={Colors.textInverse} />
        <Text style={styles.runBtnText}>
          {running ? "매칭 실행 중..." : `${semester}로 ${selected.size}명 매칭 실행`}
        </Text>
      </TouchableOpacity>
    </Screen>
  );
}

function QueueCol({
  title,
  hint,
  color,
  members,
  selected,
  onToggle,
  onView,
}: {
  title: string;
  hint: string;
  color: string;
  members: QueueMember[];
  selected: Set<number>;
  onToggle: (id: number) => void;
  onView: (id: number) => void;
}) {
  return (
    <View style={styles.col}>
      <View style={[styles.colHead, { borderColor: color }]}>
        <Text style={[styles.colTitle, { color }]}>{title}</Text>
        <Text style={styles.colHint}>{hint} · {members.length}</Text>
      </View>
      {members.length === 0 ? (
        <Text style={styles.colEmpty}>없음</Text>
      ) : (
        members.map((m) => {
          const on = selected.has(m.memberId);
          return (
            <View key={m.memberId} style={styles.qCard}>
              {/* 체크박스만 선택 토글 (카드 본문 탭은 프로필 보기로 분리) */}
              <TouchableOpacity onPress={() => onToggle(m.memberId)} hitSlop={10} activeOpacity={0.6}>
                <Ionicons name={on ? "checkbox" : "square-outline"} size={20} color={on ? color : Colors.textTertiary} />
              </TouchableOpacity>
              {/* 이름/정보 탭 → 프로필 화면 이동 */}
              <TouchableOpacity style={styles.qInfo} onPress={() => onView(m.memberId)} activeOpacity={0.6}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.qName} numberOfLines={1}>{m.name}</Text>
                  <Text style={styles.qMeta} numberOfLines={1}>{m.admissionYear} · {m.nationality}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
              </TouchableOpacity>
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "700", color: Colors.textPrimary, marginBottom: 8 },
  semRow: { marginBottom: 4 },
  semChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: Colors.surface, borderWidth: 1, borderColor: "#E5E7EB" },
  semChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  semText: { fontSize: 13, color: Colors.textPrimary, fontWeight: "600" },
  semTextActive: { color: Colors.textInverse },
  semAdd: { flexDirection: "row", alignItems: "center", gap: 2, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: Colors.primary, borderStyle: "dashed" },
  semAddText: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
  addRow: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, borderRadius: 18, borderWidth: 1, borderColor: Colors.primary },
  addInput: { minWidth: 72, fontSize: 13, color: Colors.textPrimary, paddingVertical: 8 },
  section: { fontSize: 15, fontWeight: "700", color: Colors.textPrimary, marginTop: 16, marginBottom: 8 },
  empty: { color: Colors.textTertiary, fontSize: 13, marginBottom: 8 },
  matchCard: { padding: 12, marginBottom: 8 },
  pair: { fontSize: 14, color: Colors.textPrimary },
  mentor: { fontWeight: "700", color: MENTOR_COLOR },
  mentee: { fontWeight: "700", color: MENTEE_COLOR },
  meta: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  queueHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  selectAll: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
  cols: { flexDirection: "row", gap: 10 },
  col: { flex: 1 },
  colHead: { borderBottomWidth: 2, paddingBottom: 4, marginBottom: 6 },
  colTitle: { fontSize: 14, fontWeight: "700" },
  colHint: { fontSize: 11, color: Colors.textTertiary },
  colEmpty: { fontSize: 12, color: Colors.textTertiary, paddingVertical: 8 },
  qCard: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  qInfo: { flex: 1, flexDirection: "row", alignItems: "center", gap: 6 },
  qName: { fontSize: 13, fontWeight: "600", color: Colors.textPrimary },
  qMeta: { fontSize: 11, color: Colors.textTertiary, marginTop: 1 },
  msg: { marginTop: 12, color: Colors.textPrimary, textAlign: "center" },
  runBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: 12, marginTop: 16 },
  runBtnDisabled: { opacity: 0.5 },
  runBtnText: { color: Colors.textInverse, fontWeight: "700", fontSize: 15 },
});
