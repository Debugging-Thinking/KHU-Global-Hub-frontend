import { Redirect } from 'expo-router';

/**
 * 게시판 목록은 메인 커뮤니티 화면((main)/index)의 "자유게시판" 탭으로 통합되었다.
 * 과거 /(main)/board 진입은 메인으로 리다이렉트한다.
 */
export default function BoardIndexRedirect() {
  return <Redirect href="/(main)" />;
}
