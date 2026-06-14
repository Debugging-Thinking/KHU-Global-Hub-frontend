import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Radius, Spacing, Typography, type ThemeColors } from '@/constants/theme';
import { useColors, useThemedStyles } from '@/src/theme';

export interface SelectOption {
  value: string;
  label: string;
  subtitle?: string;
  /** 라벨/부제 외 추가 검색 키워드 (예: 네이티브 표기, 영어명). */
  searchText?: string;
}

interface Props {
  label?: string;
  /** 선택된 값 (없으면 placeholder 표시). */
  value?: string | null;
  /** 필드에 표시할 텍스트 (이미 현지화된 라벨). 없으면 options에서 value로 조회. */
  displayValue?: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  modalTitle?: string;
  error?: string;
}

/**
 * 검색 가능한 드롭다운(셀렉트). 모달 + 검색 입력 + FlatList.
 * 라이브러리 없이 RN 기본 컴포넌트로 구현 — Expo Web/네이티브 모두 동작.
 * 학과·국적·선호언어 선택에 공용 사용.
 */
export function SearchableSelect({
  label,
  value,
  displayValue,
  options,
  onSelect,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  noResultsText = 'No results',
  modalTitle,
  error,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const Colors = useColors();
  const styles = useThemedStyles(makeStyles);

  const selectedLabel =
    displayValue ?? options.find((o) => o.value === value)?.label ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) =>
      `${o.label} ${o.subtitle ?? ''} ${o.searchText ?? ''}`.toLowerCase().includes(q),
    );
  }, [query, options]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Pressable
        style={[styles.field, !!error && styles.errored]}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.fieldText, !selectedLabel && styles.placeholder]} numberOfLines={1}>
          {selectedLabel ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={Colors.textTertiary} />
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} animationType="slide" transparent onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close}>
          <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.sheetHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {modalTitle ?? label ?? placeholder}
            </Text>
            <Pressable onPress={close} hitSlop={10}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </Pressable>
          </View>

          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={18} color={Colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              placeholderTextColor={Colors.textTertiary}
              value={query}
              onChangeText={setQuery}
              autoFocus
              autoCorrect={false}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
              </Pressable>
            )}
          </View>

          <FlatList
            data={filtered}
            style={styles.list}
            keyExtractor={(item) => item.value}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<Text style={styles.empty}>{noResultsText}</Text>}
            renderItem={({ item }) => {
              const selected = item.value === value;
              return (
                <Pressable
                  style={[styles.row, selected && styles.rowSelected]}
                  onPress={() => {
                    onSelect(item.value);
                    close();
                  }}
                >
                  <View style={styles.rowTextWrap}>
                    <Text style={[styles.rowLabel, selected && styles.rowLabelSelected]} numberOfLines={1}>
                      {item.label}
                    </Text>
                    {item.subtitle ? (
                      <Text style={styles.rowSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                    ) : null}
                  </View>
                  {selected && <Ionicons name="checkmark" size={18} color={Colors.primary} />}
                </Pressable>
              );
            }}
          />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const makeStyles = (Colors: ThemeColors) => StyleSheet.create({
  container: { gap: Spacing[1] },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing[4],
  },
  errored: { borderColor: Colors.error },
  fieldText: { flex: 1, fontSize: Typography.base, color: Colors.textPrimary, marginRight: Spacing[2] },
  placeholder: { color: Colors.textTertiary },
  error: { fontSize: Typography.xs, color: Colors.error, marginTop: 2 },

  backdrop: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    height: '70%',
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    overflow: 'hidden',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    marginTop: Spacing[2],
  },
  list: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    backgroundColor: Colors.surface,
  },
  modalTitle: { flex: 1, fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary, marginRight: Spacing[3] },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    margin: Spacing[4],
    paddingHorizontal: Spacing[4],
    height: 46,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSecondary,
  },
  searchInput: { flex: 1, fontSize: Typography.base, color: Colors.textPrimary, padding: 0 },
  empty: { textAlign: 'center', color: Colors.textTertiary, marginTop: Spacing[8], fontSize: Typography.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  rowSelected: { backgroundColor: Colors.primaryLight },
  rowTextWrap: { flex: 1, marginRight: Spacing[2] },
  rowLabel: { fontSize: Typography.base, color: Colors.textPrimary },
  rowLabelSelected: { color: Colors.primary, fontWeight: Typography.semibold },
  rowSubtitle: { fontSize: Typography.xs, color: Colors.textTertiary, marginTop: 1 },
});
