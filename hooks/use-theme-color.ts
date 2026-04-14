import { Colors } from '@/constants/theme';

// 새 디자인 시스템은 단일 색상 팔레트 사용 (light/dark 분기 없음)
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors
) {
  return props.light ?? Colors[colorName] ?? Colors.textPrimary;
}
