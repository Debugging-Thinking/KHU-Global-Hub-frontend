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
        contentEN: "Routes 9, 7000, 5100, 1112, M5107, 1560 are free within campus. Simply don't tap your card.",
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
        icon: '☕',
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
