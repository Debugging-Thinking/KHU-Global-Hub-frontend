import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useColors } from '@/src/theme';
import { Radius, Spacing, Typography } from '@/constants/theme';
import type { Language } from '@/src/types/auth';

type ThemeValue = 'LIGHT' | 'DARK';

/** 6개 UI 버킷별 라벨 (translations.ts 비대화 방지로 컴포넌트에 자체 내장). */
const LABELS: Record<Language, { title: string; light: string; dark: string }> = {
  KO: { title: '테마', light: '라이트', dark: '다크' },
  EN: { title: 'Theme', light: 'Light', dark: 'Dark' },
  ZH: { title: '主题', light: '浅色', dark: '深色' },
  VI: { title: 'Giao diện', light: 'Sáng', dark: 'Tối' },
  UZ: { title: 'Mavzu', light: 'Yorug‘', dark: 'Tungi' },
  MN: { title: 'Загвар', light: 'Цайвар', dark: 'Бараан' },
};

/**
 * 라이트/다크 2지선다 세그먼트. 프로필 생성·수정에서 선호 언어 다음에 노출.
 * 제어 컴포넌트 — value/onChange만 받고, 즉시 미리보기(setScheme)는 호출 측에서 처리.
 */
export function ThemeToggle({
  value,
  onChange,
  lang,
}: {
  value: ThemeValue;
  onChange: (v: ThemeValue) => void;
  lang: Language;
}) {
  const Colors = useColors();
  const L = LABELS[lang] ?? LABELS.EN;
  const opts: { v: ThemeValue; label: string; icon: 'sunny-outline' | 'moon-outline' }[] = [
    { v: 'LIGHT', label: L.light, icon: 'sunny-outline' },
    { v: 'DARK', label: L.dark, icon: 'moon-outline' },
  ];
  return (
    <View>
      <Text style={[styles.label, { color: Colors.textPrimary }]}>{L.title}</Text>
      <View style={styles.row}>
        {opts.map((o) => {
          const on = value === o.v;
          return (
            <TouchableOpacity
              key={o.v}
              onPress={() => onChange(o.v)}
              activeOpacity={0.8}
              style={[
                styles.chip,
                { borderColor: Colors.border, backgroundColor: Colors.surface },
                on && { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
              ]}
            >
              <Ionicons name={o.icon} size={16} color={on ? Colors.primary : Colors.textSecondary} />
              <Text style={[styles.chipText, { color: on ? Colors.primary : Colors.textSecondary }]}>
                {o.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: Typography.sm, fontWeight: Typography.semibold, marginBottom: Spacing[2] },
  row: { flexDirection: 'row', gap: Spacing[2] },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[1],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    borderWidth: 1.5,
  },
  chipText: { fontSize: Typography.sm, fontWeight: Typography.medium },
});
