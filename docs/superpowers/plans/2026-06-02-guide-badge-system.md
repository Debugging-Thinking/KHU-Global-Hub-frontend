# Guide & Badge System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 가이드 콘텐츠를 노션 기반으로 교체하고, 카테고리별 퀴즈 통과 시 뱃지를 획득해 프로필에 표시하는 시스템을 구현한다.

**Architecture:** 백엔드는 campusguide BC에 뱃지 도메인을 추가한다. 프론트엔드는 가이드 화면에서 카테고리별 퀴즈를 호출하고, 통과 시 API로 뱃지를 획득해 프로필 도감에 표시한다. 커뮤니티 팀원은 `GET /api/members/{id}/badges`만 호출하면 된다.

**Tech Stack:** Spring Boot 3 / JPA / Flyway (backend), React Native / Expo Router / TypeScript (frontend)

---

## 파일 맵

### 백엔드 — 신규 생성
| 파일 | 역할 |
|------|------|
| `src/main/resources/db/migration/V5__add_member_badges.sql` | member_badges 테이블 생성 |
| `campusguide/domain/BadgeId.java` | 뱃지 종류 Enum |
| `campusguide/domain/MemberBadge.java` | 뱃지 획득 엔티티 |
| `campusguide/infrastructure/MemberBadgeRepository.java` | JPA 리포지토리 |
| `campusguide/application/BadgeService.java` | 획득/조회 비즈니스 로직 |
| `campusguide/presentation/BadgeController.java` | REST 엔드포인트 |
| `campusguide/presentation/dto/BadgeResponse.java` | 응답 DTO |

### 백엔드 — 수정
| 파일 | 변경 내용 |
|------|----------|
| `shared/config/SecurityConfig.java` | `/api/badges/**`, `/api/members/*/badges` 퍼미션 추가 |

### 프론트엔드 — 신규 생성
| 파일 | 역할 |
|------|------|
| `src/types/badge.ts` | Badge 타입 정의 |
| `src/api/badge.ts` | 뱃지 API 클라이언트 |

### 프론트엔드 — 수정
| 파일 | 변경 내용 |
|------|----------|
| `src/data/khuGuide.ts` | 노션 콘텐츠로 전면 교체 (5개 카테고리) |
| `src/data/quizQuestions.ts` | 카테고리별 문제 추가/재편성, 전부 객관식 |
| `app/(main)/quiz.tsx` | category 파라미터 수신, 통과 시 뱃지 획득 |
| `app/(main)/guide.tsx` | 카테고리별 퀴즈 버튼 + 뱃지 획득 여부 표시 |
| `app/(main)/profile.tsx` | 경희온도 제거, 뱃지 컬렉션 섹션 추가 |

---

## Task 1: DB 마이그레이션 — member_badges 테이블

**Files:**
- Create: `KHU-Global-Hub-backend/src/main/resources/db/migration/V5__add_member_badges.sql`

- [ ] **Step 1: 마이그레이션 파일 생성**

```sql
-- V5__add_member_badges.sql
CREATE TABLE member_badges (
    id        BIGSERIAL PRIMARY KEY,
    member_id BIGINT      NOT NULL,
    badge_id  VARCHAR(50) NOT NULL,
    earned_at TIMESTAMP   NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_member_badge UNIQUE (member_id, badge_id)
);
```

- [ ] **Step 2: 백엔드 재시작해서 마이그레이션 적용 확인**

백엔드 PowerShell 창에서 기존 프로세스 종료 후:
```
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot"
$env:PATH = $env:JAVA_HOME + "\bin;" + $env:PATH
cd C:\design_thinking\KHU-Global-Hub-backend
.\gradlew.bat bootRun --args="--spring.profiles.active=local"
```
기대 출력: `Successfully applied 1 migration to schema "public"` (V5)

- [ ] **Step 3: 커밋**

```bash
git -C "C:\design_thinking\KHU-Global-Hub-backend" add src/main/resources/db/migration/V5__add_member_badges.sql
git -C "C:\design_thinking\KHU-Global-Hub-backend" commit -m "feat: member_badges 테이블 추가 (V5 마이그레이션)"
```

---

## Task 2: 백엔드 — 뱃지 도메인 (Enum + Entity + Repository)

**Files:**
- Create: `src/main/java/com/khu/globalhub/campusguide/domain/BadgeId.java`
- Create: `src/main/java/com/khu/globalhub/campusguide/domain/MemberBadge.java`
- Create: `src/main/java/com/khu/globalhub/campusguide/infrastructure/MemberBadgeRepository.java`

- [ ] **Step 1: BadgeId Enum 생성**

```java
// campusguide/domain/BadgeId.java
package com.khu.globalhub.campusguide.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BadgeId {
    COURSE_REG("수강신청 박사", "Course Reg Expert", "📚"),
    TRANSPORT  ("교통 박사",    "Transport Expert",   "🚌"),
    FOOD       ("맛집 박사",    "Food Expert",         "🍽️"),
    CAMPUS_SITE("사이트 박사",  "Campus Site Expert",  "🔗"),
    HUMANITIES ("교양 박사",    "Humanities Expert",   "🎓");

    private final String nameKO;
    private final String nameEN;
    private final String emoji;
}
```

- [ ] **Step 2: MemberBadge Entity 생성**

```java
// campusguide/domain/MemberBadge.java
package com.khu.globalhub.campusguide.domain;

import com.khu.globalhub.shared.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "member_badges")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class MemberBadge extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Enumerated(EnumType.STRING)
    @Column(name = "badge_id", nullable = false, length = 50)
    private BadgeId badgeId;

    public static MemberBadge of(Long memberId, BadgeId badgeId) {
        return MemberBadge.builder()
                .memberId(memberId)
                .badgeId(badgeId)
                .build();
    }
}
```

- [ ] **Step 3: MemberBadgeRepository 생성**

```java
// campusguide/infrastructure/MemberBadgeRepository.java
package com.khu.globalhub.campusguide.infrastructure;

import com.khu.globalhub.campusguide.domain.BadgeId;
import com.khu.globalhub.campusguide.domain.MemberBadge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemberBadgeRepository extends JpaRepository<MemberBadge, Long> {
    boolean existsByMemberIdAndBadgeId(Long memberId, BadgeId badgeId);
    List<MemberBadge> findAllByMemberId(Long memberId);
}
```

- [ ] **Step 4: 빌드 확인**

```
.\gradlew.bat compileJava
```
기대 출력: `BUILD SUCCESSFUL`

- [ ] **Step 5: 커밋**

```bash
git -C "C:\design_thinking\KHU-Global-Hub-backend" add src/
git -C "C:\design_thinking\KHU-Global-Hub-backend" commit -m "feat: 뱃지 도메인 추가 (BadgeId / MemberBadge / Repository)"
```

---

## Task 3: 백엔드 — BadgeService + BadgeController

**Files:**
- Create: `src/main/java/com/khu/globalhub/campusguide/application/BadgeService.java`
- Create: `src/main/java/com/khu/globalhub/campusguide/presentation/dto/BadgeResponse.java`
- Create: `src/main/java/com/khu/globalhub/campusguide/presentation/BadgeController.java`
- Modify: `src/main/java/com/khu/globalhub/shared/config/SecurityConfig.java`

- [ ] **Step 1: BadgeResponse DTO 생성**

```java
// campusguide/presentation/dto/BadgeResponse.java
package com.khu.globalhub.campusguide.presentation.dto;

import com.khu.globalhub.campusguide.domain.BadgeId;
import com.khu.globalhub.campusguide.domain.MemberBadge;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BadgeResponse {
    private final String badgeId;
    private final String badgeNameKO;
    private final String badgeNameEN;
    private final String emoji;
    private final LocalDateTime earnedAt;

    public BadgeResponse(MemberBadge mb) {
        BadgeId b = mb.getBadgeId();
        this.badgeId    = b.name();
        this.badgeNameKO = b.getNameKO();
        this.badgeNameEN = b.getNameEN();
        this.emoji       = b.getEmoji();
        this.earnedAt    = mb.getCreatedAt();
    }
}
```

- [ ] **Step 2: BadgeService 생성**

```java
// campusguide/application/BadgeService.java
package com.khu.globalhub.campusguide.application;

import com.khu.globalhub.campusguide.domain.BadgeId;
import com.khu.globalhub.campusguide.domain.MemberBadge;
import com.khu.globalhub.campusguide.infrastructure.MemberBadgeRepository;
import com.khu.globalhub.campusguide.presentation.dto.BadgeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BadgeService {

    private final MemberBadgeRepository memberBadgeRepository;

    @Transactional
    public void earnBadge(Long memberId, String badgeIdStr) {
        BadgeId badgeId = BadgeId.valueOf(badgeIdStr);
        if (memberBadgeRepository.existsByMemberIdAndBadgeId(memberId, badgeId)) {
            return; // 이미 획득 — 무시
        }
        memberBadgeRepository.save(MemberBadge.of(memberId, badgeId));
    }

    @Transactional(readOnly = true)
    public List<BadgeResponse> getBadges(Long memberId) {
        return memberBadgeRepository.findAllByMemberId(memberId)
                .stream()
                .map(BadgeResponse::new)
                .toList();
    }
}
```

- [ ] **Step 3: BadgeController 생성**

```java
// campusguide/presentation/BadgeController.java
package com.khu.globalhub.campusguide.presentation;

import com.khu.globalhub.campusguide.application.BadgeService;
import com.khu.globalhub.campusguide.presentation.dto.BadgeResponse;
import com.khu.globalhub.shared.common.ApiResponse;
import com.khu.globalhub.shared.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BadgeController {

    private final BadgeService badgeService;

    /** 뱃지 획득 — 퀴즈 통과 시 프론트에서 호출 */
    @PostMapping("/api/badges/{badgeId}")
    public ResponseEntity<ApiResponse<Void>> earn(@PathVariable String badgeId) {
        Long memberId = SecurityUtil.getCurrentMemberId();
        badgeService.earnBadge(memberId, badgeId);
        return ResponseEntity.ok(ApiResponse.ok("뱃지를 획득했습니다."));
    }

    /** 내 뱃지 목록 */
    @GetMapping("/api/badges/me")
    public ResponseEntity<ApiResponse<List<BadgeResponse>>> getMyBadges() {
        Long memberId = SecurityUtil.getCurrentMemberId();
        return ResponseEntity.ok(ApiResponse.ok(badgeService.getBadges(memberId)));
    }

    /** 특정 유저 뱃지 목록 — 커뮤니티 팀원용 (공개) */
    @GetMapping("/api/members/{memberId}/badges")
    public ResponseEntity<ApiResponse<List<BadgeResponse>>> getMemberBadges(
            @PathVariable Long memberId) {
        return ResponseEntity.ok(ApiResponse.ok(badgeService.getBadges(memberId)));
    }
}
```

- [ ] **Step 4: SecurityConfig에 퍼미션 추가**

`shared/config/SecurityConfig.java`의 `requestMatchers` 퍼미션 블록에 아래 추가:

```java
.requestMatchers(
    "/api/auth/register", "/api/auth/verify-email",
    "/api/auth/login", "/api/auth/refresh",
    "/api/auth/forgot-password", "/api/auth/reset-password"
).permitAll()
.requestMatchers("/api/members/*/badges").permitAll()   // ← 추가
.requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
```

- [ ] **Step 5: 백엔드 재시작 후 API 테스트**

백엔드 재시작 후:
```powershell
# 로그인해서 토큰 획득
$body = '{"email":"xoox1109@khu.ac.kr","password":"xoox1109!"}'
$res = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
$token = ($res.Content | ConvertFrom-Json).data.accessToken

# 뱃지 획득 테스트
Invoke-WebRequest -Uri "http://localhost:8080/api/badges/COURSE_REG" -Method POST -Headers @{Authorization="Bearer $token"} -UseBasicParsing

# 내 뱃지 조회 테스트
Invoke-WebRequest -Uri "http://localhost:8080/api/badges/me" -Headers @{Authorization="Bearer $token"} -UseBasicParsing
```
기대 출력: 첫 번째 200 OK, 두 번째에 `COURSE_REG` 뱃지 포함

- [ ] **Step 6: 커밋**

```bash
git -C "C:\design_thinking\KHU-Global-Hub-backend" add src/
git -C "C:\design_thinking\KHU-Global-Hub-backend" commit -m "feat: 뱃지 API 추가 (BadgeService / BadgeController)"
```

---

## Task 4: 프론트엔드 — 뱃지 타입 & API 클라이언트

**Files:**
- Create: `KHU-Global-Hub-frontend/src/types/badge.ts`
- Create: `KHU-Global-Hub-frontend/src/api/badge.ts`

- [ ] **Step 1: badge.ts 타입 생성**

```typescript
// src/types/badge.ts
export type BadgeId =
  | 'COURSE_REG'
  | 'TRANSPORT'
  | 'FOOD'
  | 'CAMPUS_SITE'
  | 'HUMANITIES';

export interface BadgeInfo {
  badgeId: BadgeId;
  badgeNameKO: string;
  badgeNameEN: string;
  emoji: string;
  earnedAt: string;
}

export const BADGE_META: Record<BadgeId, { nameKO: string; nameEN: string; emoji: string }> = {
  COURSE_REG:  { nameKO: '수강신청 박사', nameEN: 'Course Reg Expert', emoji: '📚' },
  TRANSPORT:   { nameKO: '교통 박사',     nameEN: 'Transport Expert',  emoji: '🚌' },
  FOOD:        { nameKO: '맛집 박사',     nameEN: 'Food Expert',        emoji: '🍽️' },
  CAMPUS_SITE: { nameKO: '사이트 박사',   nameEN: 'Campus Site Expert', emoji: '🔗' },
  HUMANITIES:  { nameKO: '교양 박사',     nameEN: 'Humanities Expert',  emoji: '🎓' },
};
```

- [ ] **Step 2: badge API 클라이언트 생성**

```typescript
// src/api/badge.ts
import { client } from './client';
import type { BadgeId, BadgeInfo } from '../types/badge';

export const badgeApi = {
  earn: (badgeId: BadgeId) =>
    client.post(`/api/badges/${badgeId}`).then((r) => r.data),

  getMyBadges: () =>
    client.get<{ data: BadgeInfo[] }>('/api/badges/me').then((r) => r.data.data),

  getMemberBadges: (memberId: number) =>
    client.get<{ data: BadgeInfo[] }>(`/api/members/${memberId}/badges`).then((r) => r.data.data),
};
```

- [ ] **Step 3: 커밋**

```bash
git -C "C:\design_thinking\KHU-Global-Hub-frontend" add src/types/badge.ts src/api/badge.ts
git -C "C:\design_thinking\KHU-Global-Hub-frontend" commit -m "feat: 뱃지 타입 및 API 클라이언트 추가"
```

---

## Task 5: 프론트엔드 — 가이드 콘텐츠 교체 (khuGuide.ts)

**Files:**
- Modify: `KHU-Global-Hub-frontend/src/data/khuGuide.ts`

- [ ] **Step 1: khuGuide.ts 전면 교체**

아래 내용으로 `src/data/khuGuide.ts` 전체를 교체한다.

```typescript
import type { BadgeId } from '../types/badge';

export interface GuideTip {
  icon: string;
  titleKO: string;
  titleEN: string;
  contentKO: string;
  contentEN: string;
  link?: string;
}

export interface GuideCategory {
  id: BadgeId;
  titleKO: string;
  titleEN: string;
  emoji: string;
  color: string;
  tips: GuideTip[];
}

export const KHU_GUIDE: GuideCategory[] = [
  {
    id: 'COURSE_REG',
    titleKO: '수강신청',
    titleEN: 'Course Registration',
    emoji: '📚',
    color: '#C41230',
    tips: [
      {
        icon: '💻',
        titleKO: '신입생은 PC로만 신청 가능',
        titleEN: 'Freshmen: PC Website Only',
        contentKO: '신입생은 희망과목 담기/예비과목 담기를 사전에 진행하지 않았으므로 PC 웹사이트로만 수강신청이 가능합니다. 모바일 앱 사용 불가.',
        contentEN: 'Freshmen must use the PC website only — the mobile app is unavailable since pre-registration was not completed.',
      },
      {
        icon: '⏱️',
        titleKO: '네이비즘으로 서버시간 확인',
        titleEN: 'Use Navism for Server Time',
        contentKO: '네이버 검색 → 네이비즘. 밀리초 ON, 날짜 OFF. 0.001초 차이가 수백 명 순위 차이를 만듭니다.',
        contentEN: 'Search "Navism" on Naver. Enable milliseconds, disable date. 0.001s can mean hundreds of positions.',
      },
      {
        icon: '🖥️',
        titleKO: '3창 구성으로 준비',
        titleEN: 'Set Up 3 Windows',
        contentKO: '① 네이비즘 서버시간 ② 학수번호 메모장(하이픈 제거) ③ 수강신청 사이트. 경쟁 치열한 수업을 메모장 위쪽에 배치.',
        contentEN: '① Navism clock ② Notepad with course codes (no hyphens) ③ Registration site. Put competitive courses at the top.',
      },
      {
        icon: '⚠️',
        titleKO: 'F5 절대 금지 / ESC 주의',
        titleEN: 'Never press F5 / Careful with ESC',
        contentKO: 'F5는 절대 누르면 안 됩니다. ESC를 약 1,000회 연타하면 수강신청 내역 전체가 초기화됩니다.',
        contentEN: 'Never press F5. Pressing ESC ~1,000 times resets all your registrations.',
      },
      {
        icon: '🔄',
        titleKO: '취소지연제 — 11시 30분부터',
        titleEN: 'Cancellation Delay from 11:30',
        contentKO: '11시 30분경부터 취소지연제가 적용됩니다. 다른 학생이 취소해도 일정 시간 후에야 신청 가능 — 자리를 확보할 수 있는 기회입니다.',
        contentEN: 'From ~11:30, cancelled spots reopen after a delay. Keep watching — seats may become available.',
      },
      {
        icon: '💾',
        titleKO: '학점세이브제',
        titleEN: 'Credit Save System',
        contentKO: 'F학점 없이 학점이 부족하면, 다음 학기에 최대 21학점(3학점 추가) 신청 가능합니다.',
        contentEN: 'If you are short on credits with no F grades, you can take up to 21 credits next semester.',
      },
    ],
  },
  {
    id: 'TRANSPORT',
    titleKO: '교통수단',
    titleEN: 'Transportation',
    emoji: '🚌',
    color: '#1A6B3C',
    tips: [
      {
        icon: '🆓',
        titleKO: '교내 구간 무료 탑승',
        titleEN: 'Free Ride on Campus',
        contentKO: '9, 7000, 5100, 1112, M5107, 1560번 버스는 교내 구간을 무료로 탑승 가능합니다. 카드를 찍지 않으면 됩니다.',
        contentEN: 'Routes 9, 7000, 5100, 1112, M5107, 1560 are free within campus. Simply don\'t tap your card.',
      },
      {
        icon: '🏙️',
        titleKO: '서울 직행 빨간 버스',
        titleEN: 'Express Bus to Seoul',
        contentKO: '7000(사당), 5100·1560·G5100(강남), 1112(잠실·구의). 약 1시간 소요. 입석 불가 — 좌석 없으면 다음 버스 이용.',
        contentEN: '7000→Sadang, 5100/1560/G5100→Gangnam, 1112→Jamsil. ~1 hour. Seating only — no standing.',
      },
      {
        icon: '⚠️',
        titleKO: '1550-1 탑승 방향 주의',
        titleEN: '1550-1 Board Direction',
        contentKO: '강남 방면 → 정문(경희대정문 정류장). 한신대 방면 → 정건(경희대학교 정류장). 반대로 타는 사례 많음!',
        contentEN: 'For Gangnam → board at Front Gate. For Hanshin Univ → board at Jeonggeon. Many people board the wrong side!',
      },
      {
        icon: '🚶',
        titleKO: '영통역 → 학교 이동',
        titleEN: 'Yeongton Station → Campus',
        contentKO: '도보 약 15분. 멀리 가야 한다면 6번 출구에서 310번·900번(정건 하차) 또는 지각 직전이면 8번 출구에서 빨간 버스.',
        contentEN: '~15 min walk. Take 310/900 from Exit 6 (get off at Jeonggeon) or red bus from Exit 8 if in a hurry.',
        link: 'https://maps.app.goo.gl/example',
      },
      {
        icon: '🏙️',
        titleKO: 'M5107 — 서울 도심 직행',
        titleEN: 'M5107 — Express to City',
        contentKO: '경희대 ↔ 을지로·시청·서울역. 교내 무료 탑승 가능. 운행 전 탑승 시 기사님 안내에 따라 정건에서 내렸다가 다시 탑승.',
        contentEN: 'Runs KHU ↔ Euljiro·City Hall·Seoul Station. Free on campus. Before service starts, driver may ask you to re-board at Jeonggeon.',
      },
    ],
  },
  {
    id: 'FOOD',
    titleKO: '맛집',
    titleEN: 'Restaurants',
    emoji: '🍽️',
    color: '#E8650A',
    tips: [
      {
        icon: '🥟',
        titleKO: '사담손만두',
        titleEN: 'Sadam Handmade Dumplings',
        contentKO: '만두전골, 튀김만두. 만두 양이 압도적 — 가는 인원보다 1인분 적게 주문 권장.',
        contentEN: 'Dumpling hot pot & fried dumplings. Huge portions — order one less than your group size.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ-WvQaDJQezURZRmpOAZlYEM',
      },
      {
        icon: '🍜',
        titleKO: '천보현 — 점심특선 6,900원',
        titleEN: 'Cheonbohyeon — Lunch Special',
        contentKO: '육회비빔밥 + 차돌된장찌개 점심특선 6,900원. 유명 고깃집보다 낫다는 평.',
        contentEN: 'Yukhoe bibimbap + beef doenjang jjigae lunch set for 6,900 KRW. Better than many famous BBQ places.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ8UDQnNxEezURxVPGqSxDea0',
      },
      {
        icon: '🌶️',
        titleKO: '얜시부 — 마라탕',
        titleEN: 'Yenshibu — Malatang',
        contentKO: '마라탕 맛집으로 정평. 마라탕 + 계란볶음밥 조합이 일품.',
        contentEN: 'Famous for malatang. Malatang + egg fried rice combo is a must.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ_zJG5BpFezURN3GLNS7NHdE',
      },
      {
        icon: '🍱',
        titleKO: '겐코 — 대창덮밥',
        titleEN: 'Genko — Daechang Bowl',
        contentKO: '대창덮밥(매운맛 추천), 나가사키, 새우장동. 점심 웨이팅 있지만 기다릴 만함.',
        contentEN: 'Daechang bowl (order spicy), Nagasaki, shrimp jang bowl. Lunch queue, but worth it.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ-wo3VZ1FezURRaMr3qgcWUM',
      },
      {
        icon: '🍕',
        titleKO: '솔피 — 씬 도우 피자',
        titleEN: 'Solpi — Thin Crust Pizza',
        contentKO: '파바 뒤 반지하. 얇은 도우 선호라면 강추. 피맥 조합 최고.',
        contentEN: 'Basement behind Paris Baguette. Best thin-crust pizza. Perfect with beer.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJFxk7tC5FezURX7yjI4KoF5I',
      },
      {
        icon: '🍰',
        titleKO: '더마스터커피 — 숨은 카페',
        titleEN: 'The Master Coffee',
        contentKO: '얜시부에서 세븐일레븐 쪽 숨어있는 카페. 초코케이크·에그타르트(데워서)·아메리카노 추천.',
        contentEN: 'Hidden café near 7-Eleven off Yenshibu. Try the choco cake, egg tart (warmed), and Americano.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJSeSSR9lEezURYKbL9gQ8lzw',
      },
    ],
  },
  {
    id: 'CAMPUS_SITE',
    titleKO: '학교 사이트',
    titleEN: 'Campus Websites',
    emoji: '🔗',
    color: '#1565C0',
    tips: [
      {
        icon: '🏫',
        titleKO: '인포21 — 학사 핵심 사이트',
        titleEN: 'Info21 — Academic Hub',
        contentKO: '수강신청, 성적 조회, 학사 일정 등 학사 전반 관리. info21.khu.ac.kr',
        contentEN: 'Course registration, grades, academic calendar. info21.khu.ac.kr',
        link: 'https://info21.khu.ac.kr/',
      },
      {
        icon: '💻',
        titleKO: 'e-Campus — 온라인 강의·과제',
        titleEN: 'e-Campus — Lectures & Tasks',
        contentKO: '온라인 강의 수강, 과제 제출, 출결 관리. e-campus.khu.ac.kr',
        contentEN: 'Online lectures, assignment submissions, attendance. e-campus.khu.ac.kr',
        link: 'https://e-campus.khu.ac.kr/',
      },
      {
        icon: '📚',
        titleKO: '스터디룸 예약',
        titleEN: 'Study Room Booking',
        contentKO: '그룹 스터디룸 온라인 예약. khu-kr.libcal.com',
        contentEN: 'Book group study rooms online. khu-kr.libcal.com',
        link: 'https://khu-kr.libcal.com/',
      },
      {
        icon: '🏠',
        titleKO: '생협 — 식당·매점·귀향버스',
        titleEN: 'Coop — Cafeteria & More',
        contentKO: '학생식당, 매점, 귀향버스 예약. khucoop.com',
        contentEN: 'Cafeteria, convenience store, and hometown bus booking. khucoop.com',
        link: 'https://khucoop.com/',
      },
      {
        icon: '🏫',
        titleKO: '학사지원과 — 휴·복학·학적',
        titleEN: 'Academic Affairs',
        contentKO: '휴학, 복학, 학적 변동 등 행정 처리. ghaksa.khu.ac.kr',
        contentEN: 'Leave of absence, re-enrollment, academic records. ghaksa.khu.ac.kr',
        link: 'http://ghaksa.khu.ac.kr/',
      },
      {
        icon: '📱',
        titleKO: '에브리타임 — 재학생 커뮤니티',
        titleEN: 'Everytime — Student Community',
        contentKO: '재학생 커뮤니티 + 강의평가. 시간표 짜기 전 꼭 참고. everytime.kr',
        contentEN: 'Student community + lecture reviews. Essential before building your schedule. everytime.kr',
        link: 'https://everytime.kr/',
      },
    ],
  },
  {
    id: 'HUMANITIES',
    titleKO: '후마니타스 교양',
    titleEN: 'Humanities Courses',
    emoji: '🎓',
    color: '#6A1B9A',
    tips: [
      {
        icon: '📋',
        titleKO: '필수교과 17학점',
        titleEN: 'Required Courses — 17 Credits',
        contentKO: '인간의가치탐색(3) + 세계와시민(3) + 빅뱅에서문명까지(3) + 성찰과표현(3) + 주제연구(3) + 대학영어(2) = 17학점 필수.',
        contentEN: 'Value Exploration(3) + World&Citizen(3) + BigBang(3) + Reflection(3) + ThematicResearch(3) + CollegeEnglish(2) = 17 required credits.',
      },
      {
        icon: '✍️',
        titleKO: '성찰과표현 → 주제연구 선수',
        titleEN: 'Reflection → Prerequisite',
        contentKO: "'성찰과표현'은 1학년 필수이자 '주제연구'의 선수과목입니다. 1학년 때 반드시 이수해야 합니다.",
        contentEN: "'Reflection & Expression' is a 1st-year requirement and a prerequisite for 'Thematic Research.'",
      },
      {
        icon: '🌍',
        titleKO: '배분이수교과 — 5영역 중 3개',
        titleEN: 'Distribution — 3 of 5 Areas',
        contentKO: '생명·우주·인간 / 분석·추론·논리 / 상징·문화·소통 / 사회·공동체·평화 / 지능·정보·미래 중 3개 영역 이상, 9학점 이상.',
        contentEN: '3+ of: Life&Universe / Analysis&Logic / Culture&Comms / Society&Peace / Intelligence&Future. Min 9 credits.',
      },
      {
        icon: '🌐',
        titleKO: '국제캠퍼스 대학영어 특이사항',
        titleEN: 'International Campus English',
        contentKO: '국제캠퍼스 학생은 대학영어를 한국어 과목으로 대체 가능합니다. 3시간 수업, 2학점.',
        contentEN: 'International campus students may substitute College English with a Korean course. 3 hours / 2 credits.',
      },
      {
        icon: '📊',
        titleKO: '교양 총 이수학점',
        titleEN: 'Total Humanities Credits',
        contentKO: '최소 29학점 이상 이수 필요. 국제캠퍼스는 최대 50학점까지 교양으로 인정.',
        contentEN: 'Minimum 29 credits required. International campus allows up to 50 credits counted as humanities.',
      },
    ],
  },
];
```

- [ ] **Step 2: 앱 확인 — 가이드 화면에 5개 카테고리가 정상 표시되는지 확인**

Expo 앱에서 가이드 탭 열고 카테고리 5개(수강신청/교통/맛집/사이트/교양) 확인.

- [ ] **Step 3: 커밋**

```bash
git -C "C:\design_thinking\KHU-Global-Hub-frontend" add src/data/khuGuide.ts
git -C "C:\design_thinking\KHU-Global-Hub-frontend" commit -m "feat: 가이드 콘텐츠 노션 기반으로 전면 교체 (5개 카테고리)"
```

---

## Task 6: 프론트엔드 — 퀴즈 문제 재편성 (quizQuestions.ts)

**Files:**
- Modify: `KHU-Global-Hub-frontend/src/data/quizQuestions.ts`

- [ ] **Step 1: quizQuestions.ts 전면 교체**

기존 14문제를 5개 카테고리별로 재편성하고 문제를 추가한다. 전부 객관식 4지선다, 지엽적 문제 제거.

```typescript
import type { BadgeId } from '../types/badge';
import type { QuizQuestion } from '@/src/types/quiz';

interface LocalQuizQuestion extends QuizQuestion {
  category: BadgeId;
  answer: number;
  explanation: string;
}

export const LOCAL_QUIZ_QUESTIONS: LocalQuizQuestion[] = [
  // ─── 수강신청 (COURSE_REG) ─────────────────────────────────────
  {
    id: 1, category: 'COURSE_REG',
    question: '신입생이 PC로만 수강신청해야 하는 이유는?',
    options: ['앱이 자주 오류가 나서', '희망과목 담기를 사전에 진행하지 않았기 때문', '학교 규정상 신입생은 PC 사용 의무', '모바일 앱은 2학년 이상만 사용 가능'],
    answer: 1,
    explanation: '신입생은 사전 희망과목 담기를 하지 않아 PC로만 수강신청이 가능합니다.',
  },
  {
    id: 2, category: 'COURSE_REG',
    question: '수강신청 정각 타이밍 확인에 권장되는 도구는?',
    options: ['네이버 시계', '윈도우 내장 시계', '네이비즘', '카카오 시계'],
    answer: 2,
    explanation: '네이비즘(밀리초 ON, 날짜 OFF)을 사용합니다. 0.001초 차이가 수백 명 순위 차이를 만듭니다.',
  },
  {
    id: 3, category: 'COURSE_REG',
    question: '수강신청 중 절대 눌러서는 안 되는 키는?',
    options: ['Enter', 'Tab', 'ESC', 'F5'],
    answer: 3,
    explanation: 'F5(새로고침)는 절대 금지. ESC 약 1,000회 연타 시 수강신청 내역 전체 초기화.',
  },
  {
    id: 4, category: 'COURSE_REG',
    question: '확인창이 뜨면 어떤 키로 닫고 다음 과목을 신청하나요?',
    options: ['Enter', 'ESC', 'Delete', 'Space'],
    answer: 1,
    explanation: '확인창은 ESC로 닫고 바로 다음 학수번호를 신청합니다.',
  },
  {
    id: 5, category: 'COURSE_REG',
    question: '취소지연제는 몇 시경부터 적용되나요?',
    options: ['10시', '11시', '11시 30분', '12시'],
    answer: 2,
    explanation: '11시 30분경부터 취소지연제가 적용되어 취소된 자리를 일정 시간 후 확보 가능합니다.',
  },
  {
    id: 6, category: 'COURSE_REG',
    question: '학점세이브제 활용 시 다음 학기 최대 신청 가능 학점은?',
    options: ['18학점', '19학점', '20학점', '21학점'],
    answer: 3,
    explanation: 'F학점 없이 학점 부족 시 학점세이브제로 다음 학기 최대 21학점 신청 가능합니다.',
  },

  // ─── 교통수단 (TRANSPORT) ──────────────────────────────────────
  {
    id: 7, category: 'TRANSPORT',
    question: '경희대 교내 구간 버스를 무료로 타는 방법은?',
    options: ['학생증을 기사님께 보여준다', '카드를 찍지 않는다', '앱에서 쿠폰을 발급받는다', '기사님께 학생임을 말한다'],
    answer: 1,
    explanation: '교내 구간은 카드를 찍지 않으면 무료입니다.',
  },
  {
    id: 8, category: 'TRANSPORT',
    question: '1550-1 버스에서 강남 방면으로 탑승하는 정류장은?',
    options: ['정건(경희대학교)', '영통역 8번 출구', '정문(경희대정문)', '학생회관 앞'],
    answer: 2,
    explanation: '강남 방면 → 정문(경희대정문 정류장), 한신대 방면 → 정건(경희대학교 정류장).',
  },
  {
    id: 9, category: 'TRANSPORT',
    question: 'G5100 버스의 특징은?',
    options: ['교내 무료 구간이 없음', '2층 버스', 'M버스(광역급행)', '경희대 기점이 아님'],
    answer: 1,
    explanation: 'G5100은 강남행 2층 버스입니다.',
  },
  {
    id: 10, category: 'TRANSPORT',
    question: '영통역에서 경희대 정문까지 도보로 약 몇 분 걸리나요?',
    options: ['5분', '10분', '15분', '25분'],
    answer: 2,
    explanation: '영통역에서 학교 정문까지 도보 약 15분 거리입니다.',
  },
  {
    id: 11, category: 'TRANSPORT',
    question: '지각 직전, 영통역에서 가장 빠르게 캠퍼스에 도달하는 방법은?',
    options: ['6번 출구 310번 버스', '6번 출구 900번 버스', '8번 출구 빨간 버스(유료)', '도보'],
    answer: 2,
    explanation: '급할 때는 8번 출구에서 빨간 버스(직행좌석버스)를 타는 것이 가장 빠릅니다. 단, 요금이 발생합니다.',
  },

  // ─── 맛집 (FOOD) ──────────────────────────────────────────────
  {
    id: 12, category: 'FOOD',
    question: '가성비 점심 특선(6,900원)으로 유명한 식당은?',
    options: ['사담손만두', '천보현', '부대통령', '밥은화'],
    answer: 1,
    explanation: '천보현의 육회비빔밥+차돌된장찌개 점심특선 6,900원이 유명합니다.',
  },
  {
    id: 13, category: 'FOOD',
    question: '마라탕 맛집으로 정평이 나 있는 식당은?',
    options: ['겐코', '얜시부', '부타센세', '쿠지라'],
    answer: 1,
    explanation: '얜시부는 마라탕 맛집으로 마라탕+계란볶음밥 조합이 특히 인기입니다.',
  },
  {
    id: 14, category: 'FOOD',
    question: '밥 무한리필이 가능한 식당은?',
    options: ['사담손만두', '전주본가', '부대통령', '청진옥'],
    answer: 2,
    explanation: '부대통령은 밥 무한리필이 가능합니다.',
  },
  {
    id: 15, category: 'FOOD',
    question: '영통 유일의 텐동 전문점은?',
    options: ['미미카츠', '부타센세', '쿠지라', '겐코'],
    answer: 2,
    explanation: '쿠지라는 영통에서 유일한 텐동 전문점입니다.',
  },

  // ─── 학교 사이트 (CAMPUS_SITE) ────────────────────────────────
  {
    id: 16, category: 'CAMPUS_SITE',
    question: '수강신청, 성적 조회, 학사 일정을 모두 처리하는 사이트는?',
    options: ['e-Campus', '인포21(Info21)', '경희대 공식 홈페이지', '에브리타임'],
    answer: 1,
    explanation: '인포21(info21.khu.ac.kr)은 수강신청·성적·학사 일정 등 학사 전반을 관리합니다.',
  },
  {
    id: 17, category: 'CAMPUS_SITE',
    question: '그룹 스터디룸 온라인 예약이 가능한 사이트는?',
    options: ['인포21', 'lib.khu.ac.kr', 'khu-kr.libcal.com', 'khucoop.com'],
    answer: 2,
    explanation: '스터디룸 예약은 khu-kr.libcal.com에서 가능합니다.',
  },
  {
    id: 18, category: 'CAMPUS_SITE',
    question: '귀향버스 예약, 학생식당 정보를 제공하는 사이트는?',
    options: ['인포21', '에브리타임', '생협(khucoop.com)', 'e-Campus'],
    answer: 2,
    explanation: '생협(khucoop.com)에서 귀향버스 예약, 매점·식당 정보를 확인할 수 있습니다.',
  },
  {
    id: 19, category: 'CAMPUS_SITE',
    question: '휴학·복학·학적 변동 등 행정 처리를 위한 사이트는?',
    options: ['인포21', '학사지원과(ghaksa.khu.ac.kr)', '기숙사(dorm2.khu.ac.kr)', 'e-Campus'],
    answer: 1,
    explanation: '학사지원과(ghaksa.khu.ac.kr)에서 휴학·복학·학적 변동 등을 처리합니다.',
  },

  // ─── 후마니타스 교양 (HUMANITIES) ─────────────────────────────
  {
    id: 20, category: 'HUMANITIES',
    question: '2024학년도 입학생 기준 필수교과 이수학점은?',
    options: ['12학점', '15학점', '17학점', '20학점'],
    answer: 2,
    explanation: '필수교과: 인간의가치탐색(3)+세계와시민(3)+빅뱅에서문명까지(3)+성찰과표현(3)+주제연구(3)+대학영어(2) = 17학점.',
  },
  {
    id: 21, category: 'HUMANITIES',
    question: "'주제연구'를 수강하기 위한 선수과목은?",
    options: ['세계와시민', '인간의가치탐색', '성찰과표현', '대학영어'],
    answer: 2,
    explanation: "'성찰과표현'은 1학년 필수이자 '주제연구'의 선수과목입니다.",
  },
  {
    id: 22, category: 'HUMANITIES',
    question: '배분이수교과는 5개 영역 중 최소 몇 개 영역에서 이수해야 하나요?',
    options: ['1개', '2개', '3개', '5개 전부'],
    answer: 2,
    explanation: '5개 영역 중 3개 이상 선택, 9학점 이상 이수해야 합니다.',
  },
  {
    id: 23, category: 'HUMANITIES',
    question: '국제캠퍼스 학생의 교양 최대 인정 학점은?',
    options: ['29학점', '40학점', '50학점', '56학점'],
    answer: 2,
    explanation: '국제캠퍼스는 최대 50학점까지 교양으로 인정됩니다(서울캠퍼스는 56학점).',
  },
];

export function getQuestionsByCategory(category: string): LocalQuizQuestion[] {
  return LOCAL_QUIZ_QUESTIONS.filter((q) => q.category === category);
}

export function gradeLocally(answers: { questionId: number; selectedOption: number }[]) {
  const map = Object.fromEntries(LOCAL_QUIZ_QUESTIONS.map((q) => [q.id, q]));
  let correct = 0;
  const results = answers.map((a) => {
    const q = map[a.questionId];
    const isCorrect = q ? q.answer === a.selectedOption : false;
    if (isCorrect) correct++;
    return {
      questionId: a.questionId,
      correct: isCorrect,
      correctAnswer: q?.answer ?? 0,
      explanation: q?.explanation ?? '',
    };
  });
  const total = results.length;
  const score = total > 0 ? Math.round((correct / total) * 1000) / 10 : 0;
  return { correctCount: correct, totalCount: total, score, results };
}
```

- [ ] **Step 2: 커밋**

```bash
git -C "C:\design_thinking\KHU-Global-Hub-frontend" add src/data/quizQuestions.ts
git -C "C:\design_thinking\KHU-Global-Hub-frontend" commit -m "feat: 퀴즈 문제 카테고리별 재편성 (23문제, 전부 객관식)"
```

---

## Task 7: 프론트엔드 — 퀴즈 화면 (category 파라미터 + 뱃지 획득)

**Files:**
- Modify: `KHU-Global-Hub-frontend/app/(main)/quiz.tsx`

- [ ] **Step 1: quiz.tsx 상단 import 수정**

기존 import 블록에서 다음을 추가/교체:

```typescript
// 추가
import { useLocalSearchParams } from 'expo-router';
import { badgeApi } from '@/src/api/badge';
import { getQuestionsByCategory } from '@/src/data/quizQuestions';
import type { BadgeId } from '@/src/types/badge';
import { BADGE_META } from '@/src/types/badge';
```

- [ ] **Step 2: QuizScreen 컴포넌트에 category 파라미터 수신 추가**

`GuideScreen` 함수 상단에 추가:

```typescript
export default function QuizScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const categoryId = (category ?? '') as BadgeId;
  const categoryQuestions = category
    ? getQuestionsByCategory(category)
    : LOCAL_QUIZ_QUESTIONS;
  // ... 기존 상태들
```

기존 `LOCAL_QUIZ_QUESTIONS` 를 직접 사용하던 부분을 `categoryQuestions`로 교체.

- [ ] **Step 3: 퀴즈 결과 처리 — 70% 이상 시 뱃지 획득**

기존 `HomeView`의 `onFinish` 콜백 또는 결과 처리 부분에서, score ≥ 70 이고 category가 있을 때 뱃지 API 호출:

```typescript
const handleFinish = async (response: QuizSubmitResponse) => {
  setResult(response);
  setCurrentView('result');
  if (category && response.score >= 70) {
    try {
      await badgeApi.earn(categoryId);
    } catch {
      // 이미 획득했거나 오류 — 무시
    }
  }
};
```

- [ ] **Step 4: 결과 화면에 뱃지 획득 메시지 추가**

결과 화면(`ResultView` 또는 result 렌더링 부분)에서 score ≥ 70이고 category가 있을 때 표시:

```typescript
{result.score >= 70 && category && (
  <View style={styles.badgeEarned}>
    <Text style={styles.badgeEarnedEmoji}>
      {BADGE_META[categoryId]?.emoji ?? '🏅'}
    </Text>
    <Text style={styles.badgeEarnedText}>
      {BADGE_META[categoryId]?.nameKO} 획득!
    </Text>
  </View>
)}
```

스타일 추가:
```typescript
badgeEarned: {
  alignItems: 'center',
  backgroundColor: Colors.primaryLight,
  borderRadius: Radius.lg,
  padding: Spacing[4],
  marginBottom: Spacing[4],
  borderWidth: 1.5,
  borderColor: Colors.primary,
},
badgeEarnedEmoji: { fontSize: 40, marginBottom: Spacing[2] },
badgeEarnedText: {
  fontSize: Typography.lg,
  fontWeight: Typography.bold,
  color: Colors.primary,
},
```

- [ ] **Step 5: 앱에서 퀴즈 카테고리 파라미터 동작 확인**

가이드 화면 → 수강신청 → 퀴즈 버튼(Task 8 이후 연결) 또는 직접 `/(main)/quiz?category=COURSE_REG`로 진입해 테스트.

- [ ] **Step 6: 커밋**

```bash
git -C "C:\design_thinking\KHU-Global-Hub-frontend" add app/\(main\)/quiz.tsx
git -C "C:\design_thinking\KHU-Global-Hub-frontend" commit -m "feat: 퀴즈 화면 카테고리 파라미터 지원 + 통과 시 뱃지 획득"
```

---

## Task 8: 프론트엔드 — 가이드 화면 (카테고리별 퀴즈 버튼 + 뱃지 표시)

**Files:**
- Modify: `KHU-Global-Hub-frontend/app/(main)/guide.tsx`

- [ ] **Step 1: import 추가**

```typescript
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { badgeApi } from '@/src/api/badge';
import type { BadgeId } from '@/src/types/badge';
```

- [ ] **Step 2: 뱃지 상태 관리 추가**

`GuideScreen` 컴포넌트 내에:
```typescript
const [earnedBadges, setEarnedBadges] = useState<Set<BadgeId>>(new Set());

useFocusEffect(
  useCallback(() => {
    badgeApi.getMyBadges()
      .then((badges) => setEarnedBadges(new Set(badges.map((b) => b.badgeId as BadgeId))))
      .catch(() => {});
  }, [])
);
```

- [ ] **Step 3: 카테고리 카드에 뱃지 상태 + 퀴즈 버튼 추가**

`HomeView`의 카테고리 카드 렌더링 부분 수정:

```typescript
{KHU_GUIDE.map((cat) => {
  const earned = earnedBadges.has(cat.id as BadgeId);
  return (
    <TouchableOpacity
      key={cat.id}
      style={[styles.categoryCard, { borderTopColor: cat.color }]}
      onPress={() => onSelectCategory(cat.id)}
      activeOpacity={0.8}
    >
      <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
      <Text style={styles.categoryTitle}>
        {lang === 'KO' ? cat.titleKO : cat.titleEN}
      </Text>
      {earned ? (
        <Text style={[styles.categoryBadge, { color: cat.color }]}>🏅 획득!</Text>
      ) : (
        <TouchableOpacity
          style={[styles.quizSmallBtn, { borderColor: cat.color }]}
          onPress={(e) => { e.stopPropagation(); onQuiz(cat.id); }}
          activeOpacity={0.7}
        >
          <Text style={[styles.quizSmallBtnText, { color: cat.color }]}>
            {lang === 'KO' ? '퀴즈' : 'Quiz'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
})}
```

`onQuiz` 콜백 시그니처 변경: `onQuiz: (categoryId: string) => void`

`GuideScreen`에서 `onQuiz` 연결:
```typescript
onQuiz={(categoryId) => router.push(`/(main)/quiz?category=${categoryId}`)}
```

스타일 추가:
```typescript
categoryBadge: { fontSize: Typography.xs, fontWeight: Typography.bold },
quizSmallBtn: {
  borderWidth: 1,
  borderRadius: Radius.full,
  paddingHorizontal: Spacing[2],
  paddingVertical: 2,
  alignSelf: 'flex-start',
},
quizSmallBtnText: { fontSize: Typography.xs, fontWeight: Typography.semibold },
```

- [ ] **Step 4: 앱에서 가이드 화면 확인**

가이드 화면에서:
- 카테고리 카드마다 퀴즈 버튼 표시 확인
- 퀴즈 통과 후 가이드로 돌아왔을 때 🏅 획득! 표시 확인

- [ ] **Step 5: 커밋**

```bash
git -C "C:\design_thinking\KHU-Global-Hub-frontend" add app/\(main\)/guide.tsx
git -C "C:\design_thinking\KHU-Global-Hub-frontend" commit -m "feat: 가이드 카테고리 카드에 퀴즈 버튼 + 뱃지 획득 표시"
```

---

## Task 9: 프론트엔드 — 프로필 화면 (경희온도 제거 + 뱃지 컬렉션)

**Files:**
- Modify: `KHU-Global-Hub-frontend/app/(main)/profile.tsx`

- [ ] **Step 1: import 추가**

```typescript
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { badgeApi } from '@/src/api/badge';
import { BADGE_META } from '@/src/types/badge';
import type { BadgeId, BadgeInfo } from '@/src/types/badge';
```

- [ ] **Step 2: 뱃지 상태 추가 + 경희온도 상태 제거**

컴포넌트 상태에:
```typescript
const [earnedBadges, setEarnedBadges] = useState<BadgeInfo[]>([]);

useFocusEffect(
  useCallback(() => {
    badgeApi.getMyBadges()
      .then(setEarnedBadges)
      .catch(() => {});
  }, [])
);
```

- [ ] **Step 3: 경희온도 카드 제거**

`profile.tsx`에서 아래 블록 전체 삭제:
```typescript
{/* 경희 온도 — 구조만 */}
{!isEditing && (
  <View style={styles.tempCard}>
    ...
  </View>
)}
```

관련 스타일 (`tempCard`, `tempRow`, `tempLabel`, `tempBadge`, `tempValue`, `tempHint`) 도 삭제.

- [ ] **Step 4: 뱃지 컬렉션 섹션 추가**

경희온도 카드가 있던 자리(프로필 배너 아래)에 추가:

```typescript
{!isEditing && (
  <View style={styles.badgeSection}>
    <Text style={styles.badgeSectionTitle}>내 뱃지</Text>
    <View style={styles.badgeGrid}>
      {(Object.keys(BADGE_META) as BadgeId[]).map((badgeId) => {
        const meta = BADGE_META[badgeId];
        const earned = earnedBadges.find((b) => b.badgeId === badgeId);
        return (
          <View
            key={badgeId}
            style={[styles.badgeItem, earned ? styles.badgeItemEarned : styles.badgeItemLocked]}
          >
            <Text style={[styles.badgeEmoji, !earned && styles.badgeEmojiLocked]}>
              {earned ? meta.emoji : '🔒'}
            </Text>
            <Text style={[styles.badgeName, !earned && styles.badgeNameLocked]}>
              {meta.nameKO}
            </Text>
          </View>
        );
      })}
    </View>
  </View>
)}
```

스타일 추가:
```typescript
badgeSection: {
  backgroundColor: Colors.surface,
  borderRadius: Radius.lg,
  padding: Spacing[4],
  marginBottom: Spacing[4],
  ...Shadow.sm,
},
badgeSectionTitle: {
  fontSize: Typography.base,
  fontWeight: Typography.semibold,
  color: Colors.textPrimary,
  marginBottom: Spacing[3],
},
badgeGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: Spacing[3],
},
badgeItem: {
  width: '45%',
  alignItems: 'center',
  padding: Spacing[3],
  borderRadius: Radius.md,
  borderWidth: 1.5,
  gap: Spacing[1],
},
badgeItemEarned: {
  borderColor: Colors.primary,
  backgroundColor: Colors.primaryLight,
},
badgeItemLocked: {
  borderColor: Colors.border,
  backgroundColor: Colors.background,
},
badgeEmoji: { fontSize: 28 },
badgeEmojiLocked: { opacity: 0.4 },
badgeName: {
  fontSize: Typography.xs,
  fontWeight: Typography.semibold,
  color: Colors.primary,
  textAlign: 'center',
},
badgeNameLocked: { color: Colors.textTertiary },
```

- [ ] **Step 5: 앱에서 프로필 화면 확인**

- 경희온도 카드가 사라졌는지 확인
- 뱃지 5개 컬렉션이 표시되는지 확인
- 획득한 뱃지는 컬러, 미획득은 🔒+회색인지 확인

- [ ] **Step 6: 커밋**

```bash
git -C "C:\design_thinking\KHU-Global-Hub-frontend" add app/\(main\)/profile.tsx
git -C "C:\design_thinking\KHU-Global-Hub-frontend" commit -m "feat: 프로필 경희온도 제거, 뱃지 컬렉션 추가"
```

---

## 최종 동작 확인 체크리스트

- [ ] 가이드 탭 → 5개 카테고리 카드 정상 표시
- [ ] 카테고리 카드 → 퀴즈 버튼 탭 → 해당 카테고리 퀴즈 진입
- [ ] 퀴즈 70% 이상 통과 → 뱃지 획득 메시지 표시
- [ ] 가이드로 돌아오면 해당 카테고리 카드에 🏅 획득! 표시
- [ ] 프로필 탭 → 뱃지 컬렉션 표시 (획득=컬러, 미획득=🔒)
- [ ] `GET /api/members/{id}/badges` 공개 API 정상 응답 (커뮤니티 팀원용)
