# 가이드 탭 기능 구현

## 개요

기존 퀴즈 탭을 **가이드 탭**으로 교체하고, 앱 내에서 경희대 생활 꿀팁을 한국어/영어로 확인할 수 있는 화면을 구현했습니다.
이전에는 노션 링크로 외부 이동하던 방식에서, 앱 자체에서 콘텐츠를 보여주는 방식으로 변경했습니다.

---

## 변경 파일

### 신규
- `app/(main)/guide.tsx` — 가이드 메인 화면

### 수정
- `app/(main)/_layout.tsx` — 탭 구성 변경 (quiz → guide)
- `src/data/khuGuide.ts` — 이중언어 데이터 구조로 개편
- `app/(main)/quiz.tsx` — 가이드와 분리, 뒤로가기 버튼 추가

---

## 기능 상세

### 가이드 탭 (`guide.tsx`)
- **히어로 배너**: 화면 상단 안내 문구
- **카테고리 그리드**: 카드 형태로 카테고리 목록 표시
- **카테고리 상세**: 카드 클릭 시 해당 카테고리의 팁 목록으로 이동, 뒤로가기 버튼 제공
- **언어 토글**: 우상단 `한/EN` 버튼으로 한국어 ↔ 영어 전환
- **지도 보기**: 맛집 카테고리 항목에 Google Maps 링크 버튼
- **퀴즈 버튼**: 가이드 홈 그리드 안에 퀴즈 카드로 진입 가능

### 카테고리 목록
| 카테고리 | 항목 수 |
|---|---|
| 📚 수강신청 (Course Registration) | 6개 |
| 🚌 교통수단 (Transportation) | 4개 |
| 🎓 후마니타스 교양 (Humanitas Liberal Arts) | 4개 |
| 🔗 학교 사이트 (School Websites) | 5개 |
| 🍽️ 영통 맛집 (Yeongtong Restaurants) | 11개 |

### 데이터 구조 변경 (`khuGuide.ts`)

```typescript
// 변경 전
interface GuideTip {
  icon: string;
  title: string;
  content: string;
}

// 변경 후
interface GuideTip {
  icon: string;
  titleKO: string;
  titleEN: string;
  contentKO: string;
  contentEN: string;
  link?: string; // 맛집 Google Maps 링크 (선택)
}
```

### 탭 구성 변경 (`_layout.tsx`)

```
변경 전: 게시판 | 채팅 | 멘토링 | 퀴즈 | 프로필
변경 후: 게시판 | 채팅 | 멘토링 | 가이드 | 프로필
```

퀴즈는 탭바에서 숨기고(`href: null`), 가이드 홈 화면 내 버튼으로 진입합니다.

---

## 로컬 테스트 방법

1. Docker Desktop 실행
2. 백엔드: `cd KHU-Global-Hub-backend` → `run-local.bat` 실행
3. 프론트엔드: `cd KHU-Global-Hub-frontend` → `npx expo start`
4. Expo Go 앱으로 QR 스캔 또는 에뮬레이터 실행
5. 하단 탭에서 **가이드** 탭 선택
