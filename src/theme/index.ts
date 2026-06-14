import { useMemo } from 'react';
import { create } from 'zustand';
import { Colors, DarkColors, type ThemeColors } from '@/constants/theme';

export type Scheme = 'light' | 'dark';

interface ThemeState {
  scheme: Scheme;
  setScheme: (s: Scheme) => void;
}

/**
 * 현재 UI 테마 스킴. 기본 'light'(현재 화면).
 * - 로그인/프로필 로드 시 프로필의 theme('LIGHT'|'DARK')에서 동기화(app/_layout).
 * - 프로필 편집에서 토글하면 즉시 미리보기를 위해 setScheme로 직접 바꾼다(저장은 프로필 PUT으로).
 * Zustand 전역이라 ThemeProvider 없이 useColors()만으로 모든 화면이 반응한다.
 */
export const useThemeStore = create<ThemeState>((set) => ({
  scheme: 'light',
  setScheme: (scheme) => set({ scheme }),
}));

/** 백엔드 theme 값('LIGHT'|'DARK') → 스킴. */
export const schemeFromTheme = (theme?: string | null): Scheme =>
  theme === 'DARK' ? 'dark' : 'light';

/** 스킴 → 백엔드 theme 값. */
export const themeFromScheme = (scheme: Scheme): 'LIGHT' | 'DARK' =>
  scheme === 'dark' ? 'DARK' : 'LIGHT';

/** 활성 팔레트. 컴포넌트에서 `const Colors = useColors()`로 사용(이름을 Colors로 두면 기존 참조 무변경). */
export function useColors(): ThemeColors {
  const scheme = useThemeStore((s) => s.scheme);
  return scheme === 'dark' ? DarkColors : Colors;
}

/**
 * 테마 반응형 StyleSheet. 모듈 스코프 `const styles = StyleSheet.create({...})`를
 * `const makeStyles = (Colors) => StyleSheet.create({...})`로 바꾸고
 * 컴포넌트에서 `const styles = useThemedStyles(makeStyles)`로 사용한다.
 */
export function useThemedStyles<T>(factory: (c: ThemeColors) => T): T {
  const colors = useColors();
  return useMemo(() => factory(colors), [colors]);
}
