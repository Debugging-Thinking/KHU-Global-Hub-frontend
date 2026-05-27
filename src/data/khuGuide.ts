export interface GuideTip {
  icon: string;
  titleKO: string;
  titleEN: string;
  contentKO: string;
  contentEN: string;
  link?: string;
}

export interface GuideCategory {
  id: string;
  titleKO: string;
  titleEN: string;
  emoji: string;
  color: string;
  tips: GuideTip[];
}

export const KHU_GUIDE: GuideCategory[] = [
  {
    id: '수강신청',
    titleKO: '수강신청',
    titleEN: 'Course Registration',
    emoji: '📚',
    color: '#C41230',
    tips: [
      {
        icon: '💻',
        titleKO: '신입생은 PC로만 신청 가능',
        titleEN: 'Freshmen: PC Website Only',
        contentKO: '신입생은 사전 희망과목 담기를 하지 않았기 때문에 PC 웹사이트로만 수강신청이 가능합니다. 모바일 앱 X',
        contentEN: "Freshmen who haven't pre-registered must use the PC website. The mobile app is not available for freshmen.",
      },
      {
        icon: '⏱️',
        titleKO: '네이비즘으로 서버시간 확인',
        titleEN: 'Use Navism for Server Time',
        contentKO: '네이버 검색 → 네이비즘. 밀리초 ON, 날짜 OFF 설정. 0.001초 차이가 수백 명 순위 차이를 만듭니다.',
        contentEN: 'Search "Navism" on Naver. Turn milliseconds ON, date OFF. A 0.001s difference can mean hundreds of positions in the queue.',
      },
      {
        icon: '🖥️',
        titleKO: '3창 구성으로 준비',
        titleEN: 'Set Up 3 Windows',
        contentKO: '① 네이비즘 서버시간 ② 학수번호 메모장(하이픈 제거) ③ 수강신청 사이트. 경쟁 치열한 수업을 메모장 위쪽에 배치하세요.',
        contentEN: '① Navism clock ② Notepad with course codes (no hyphens) ③ Registration site. Put high-demand courses at the top of your list.',
      },
      {
        icon: '⚠️',
        titleKO: 'F5 절대 금지 · ESC 주의',
        titleEN: 'Never Press F5 · Watch ESC',
        contentKO: 'F5(새로고침)는 절대 사용 금지. ESC를 약 1,000회 연타 시 수강신청 내역 전체가 초기화됩니다.',
        contentEN: 'Never press F5 (refresh). Pressing ESC ~1,000 times will reset your entire registration history.',
      },
      {
        icon: '🔄',
        titleKO: '취소지연제 & 정정기간 활용',
        titleEN: 'Cancellation Delay & Add/Drop',
        contentKO: '11시 30분부터 취소지연제 적용. 정정기간(3/4~3/8)에 강의평가 확인 후 수업 교체 가능.',
        contentEN: 'Cancellation delay applies from 11:30 AM. During Add/Drop (Mar 4–8), check course reviews and swap classes.',
      },
      {
        icon: '💡',
        titleKO: '학점세이브제 (최후의 수단)',
        titleEN: 'Credit Save System (Last Resort)',
        contentKO: '이번 학기 학점이 부족하면 다음 학기 최대 21학점 신청 가능. 조건: F학점 없음, 최대 3학점 세이브.',
        contentEN: 'If credits fall short this semester, register up to 21 credits next semester. Conditions: no F grades, max 3 credits saved.',
      },
    ],
  },
  {
    id: '교통수단',
    titleKO: '교통수단',
    titleEN: 'Transportation',
    emoji: '🚌',
    color: '#1E6FBB',
    tips: [
      {
        icon: '🆓',
        titleKO: '교내 구간 무료 탑승',
        titleEN: 'Free Rides Within Campus',
        contentKO: '9, 7000, 5100, 1112 등 교내 진입 버스는 카드를 찍지 않으면 무료. 정문→정건 구간. 기사님께 "감사합니다~" 인사 필수!',
        contentEN: "Buses 9, 7000, 5100, 1112 are free within campus — don't tap your card. Always say \"Thank you!\" to the driver!",
      },
      {
        icon: '🔴',
        titleKO: '강남행 빨간 버스',
        titleEN: 'Red Express Buses to Seoul',
        contentKO: '5100(강남), 7000(사당), 1112(잠실), G5100(강남·2층버스). 약 1시간 소요. 입석 불가이므로 기점인 경희대에서 타면 좌석 확보 쉬움.',
        contentEN: '5100 (Gangnam), 7000 (Sadang), 1112 (Jamsil), G5100 (Gangnam, double-decker). ~1 hour. No standing — board at KHU (origin) for a guaranteed seat.',
      },
      {
        icon: '⚠️',
        titleKO: '1550-1 방향 주의',
        titleEN: '1550-1: Watch Your Direction',
        contentKO: '강남 방면 → 정문(경희대정문 정류장) 탑승. 한신대 방면 → 정건(경희대학교 정류장) 탑승. 반대로 타는 사고 자주 발생!',
        contentEN: 'Toward Gangnam → board at Main Gate stop. Toward Hanshin Univ. → board at Jeonggeon stop. People often board the wrong direction!',
      },
      {
        icon: '🚶',
        titleKO: '영통역에서 학교까지',
        titleEN: 'From Yeongton Station to Campus',
        contentKO: '도보 약 15분. 사색의 광장 쪽(국제대·도서관)이 목적지면 버스 이용 권장. 310번·900번 → 정건 하차 후 지하보도 이용.',
        contentEN: '~15 min walk. For Engineering/International buildings, take Bus 310 or 900 from Exit 6 → alight at Jeonggeon, use the underpass.',
      },
    ],
  },
  {
    id: '후마니타스 교양',
    titleKO: '후마니타스 교양',
    titleEN: 'Humanitas Liberal Arts',
    emoji: '🎓',
    color: '#8B5CF6',
    tips: [
      {
        icon: '📋',
        titleKO: '필수교과 17학점 (2024 입학생)',
        titleEN: '17 Required Credits (2024 Intake)',
        contentKO: '인간의가치탐색(3) + 세계와시민(3) + 빅뱅에서문명까지(3) + 성찰과표현(3) + 주제연구(3) + 대학영어(2) = 총 17학점',
        contentEN: 'Exploring Human Values(3) + World Citizenship(3) + Big Bang to Civilization(3) + Reflective Expression(3) + Topic Research(3) + College English(2) = 17 credits',
      },
      {
        icon: '📝',
        titleKO: '성찰과표현 → 주제연구 순서 필수',
        titleEN: 'Reflective Expression Before Topic Research',
        contentKO: '"성찰과표현"은 1학년 필수이자 "주제연구"의 선수과목. 1학년에 성찰과표현을 반드시 이수해야 2학년에 주제연구 수강 가능.',
        contentEN: '"Reflective Expression" is a 1st-year requirement AND prerequisite for "Topic Research". Must complete in 1st year to take Topic Research in 2nd year.',
      },
      {
        icon: '🌐',
        titleKO: '배분이수교과 9학점 이상',
        titleEN: '9+ Distribution Credits',
        contentKO: '5개 영역(생명·우주·인간 / 분석·추론·논리 / 상징·문화·소통 / 사회·공동체·평화 / 지능·정보·미래) 중 3개 선택, 각 3학점.',
        contentEN: 'Choose 3 of 5 areas: Life·Universe·Humanity / Analysis·Reasoning·Logic / Symbol·Culture / Society·Community·Peace / Intelligence·Information·Future. 3 credits each.',
      },
      {
        icon: '💡',
        titleKO: '교양은 강의평가 필수 확인',
        titleEN: 'Always Check Course Reviews',
        contentKO: '교수에 따른 편차가 매우 큽니다. 강의평가 별점 4.0 이상 강의는 정정기간에도 자리가 거의 없으니 수강신청 때 꼭 잡으세요.',
        contentEN: 'Instructor quality varies greatly. Courses with 4.0+ ratings rarely have open seats during Add/Drop — register during the main period!',
      },
    ],
  },
  {
    id: '학교 사이트',
    titleKO: '학교 사이트',
    titleEN: 'School Websites',
    emoji: '🔗',
    color: '#059669',
    tips: [
      {
        icon: '🎯',
        titleKO: '인포21 — 핵심 사이트',
        titleEN: 'Info21 — Core Site',
        contentKO: 'info21.khu.ac.kr — 수강신청, 성적 조회, 학사 일정 모두 여기서. 로그인이 자주 풀리니 수강신청 전 미리 확인.',
        contentEN: 'info21.khu.ac.kr — Course registration, grades, academic calendar. Session expires often — log in and verify before registration day.',
        link: 'https://info21.khu.ac.kr',
      },
      {
        icon: '📖',
        titleKO: 'e-Campus — 온라인 강의',
        titleEN: 'e-Campus — Online Learning',
        contentKO: 'e-campus.khu.ac.kr — 온라인 강의 시청, 과제 제출, 출결 관리. 강의별 공지사항도 여기서 확인.',
        contentEN: 'e-campus.khu.ac.kr — Watch online lectures, submit assignments, and track attendance. Check course announcements here.',
        link: 'https://e-campus.khu.ac.kr',
      },
      {
        icon: '📚',
        titleKO: '스터디룸 예약',
        titleEN: 'Study Room Booking',
        contentKO: 'khu-kr.libcal.com — 그룹 스터디룸 온라인 예약. 중앙도서관(lib.khu.ac.kr)에서 도서 검색 및 열람실 이용.',
        contentEN: 'khu-kr.libcal.com — Book group study rooms online. Central Library (lib.khu.ac.kr) for book search and reading rooms.',
        link: 'https://khu-kr.libcal.com',
      },
      {
        icon: '🏠',
        titleKO: '생협 & 기숙사',
        titleEN: 'Co-op & Dormitory',
        contentKO: '생협(khucoop.com) — 매점·식당·귀향버스. 기숙사(dorm2.khu.ac.kr) — 기숙사 신청·생활 안내.',
        contentEN: 'Co-op (khucoop.com) — campus store, dining, shuttle bus. Dormitory (dorm2.khu.ac.kr) — application and housing info.',
        link: 'https://khucoop.com',
      },
      {
        icon: '📱',
        titleKO: '에브리타임 필수 가입',
        titleEN: 'Join Everytime!',
        contentKO: 'everytime.kr — 재학생 커뮤니티. 강의평가, 시간표 공유, 학교 생활 정보의 보고. 수강신청 전 반드시 강의평가 확인!',
        contentEN: 'everytime.kr — Student community. Course reviews, timetable sharing, campus life info. Check reviews before course registration!',
        link: 'https://everytime.kr',
      },
    ],
  },
  {
    id: '맛집',
    titleKO: '영통 맛집',
    titleEN: 'Yeongtong Restaurants',
    emoji: '🍽️',
    color: '#D97706',
    tips: [
      {
        icon: '🥟',
        titleKO: '사담손만두',
        titleEN: 'Sadam Son Mandu',
        contentKO: '추천: 만두전골, 튀김만두. 만두전골은 인원보다 1인분 적게 주문 권장. 튀김만두는 바삭함 끝판왕.',
        contentEN: 'Must-order: Dumpling Hot Pot, Fried Dumplings. Order one fewer serving than your group size. The fried dumplings are outrageously crispy.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ-WvQaDJQezURZRmpOAZlYEM',
      },
      {
        icon: '🍚',
        titleKO: '천보현 — 점심특선 6,900원',
        titleEN: 'Cheonbohyeon — Lunch Special ₩6,900',
        contentKO: '추천: 육회비빔밥 + 차돌된장찌개 점심특선. 유명 고깃집보다 낫다는 평. 점심시간 웨이팅 각오.',
        contentEN: 'Must-order: Yukhoe Bibimbap + Chadol Doenjang Jjigae lunch special. Rivals famous BBQ spots. Expect a wait at lunch.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ8UDQnNxEezURxVPGqSxDea0',
      },
      {
        icon: '♾️',
        titleKO: '부대통령 — 밥 무한리필',
        titleEN: 'Budae Daetongryeong — Unlimited Rice',
        contentKO: '추천: 우렁된장찌개, 닭갈비. 밥 무한리필 가능! 배고픈 날 찌개 하나에 밥 두 공기도 거뜬.',
        contentEN: 'Must-order: Snail Doenjang Jjigae, Dakgalbi. Unlimited rice refills! Great value for hungry and budget-conscious students.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJz6NtewBFezURKR4SwIWsiJ4',
      },
      {
        icon: '🥣',
        titleKO: '밥은화 — 가성비 끝판왕',
        titleEN: 'Babeunhwa — Best Value',
        contentKO: '추천: 쭈꾸미숙주덮밥, 닭껍질교자튀김. 3,500~5,500원대. 수업 끝나고 쭈꾸미덮밥 + 맥주 조합 강추.',
        contentEN: 'Must-order: Spicy Octopus Bowl, Chicken Skin Gyoza. ₩3,500–5,500. Octopus bowl + beer after class is highly recommended.',
        link: 'https://www.google.com/maps/place/%EB%B0%A5%EC%9D%80%ED%99%94+%EA%B2%BD%ED%9D%AC%EB%8C%80%EA%B5%AD%EC%A0%9C%EC%BA%A0%ED%8D%BC%EC%8A%A4%EC%A0%90/data=!3m1!4b1!4m6!3m5!1s0x357b452e7b0d177b:0x1f5efd10481b8e25!8m2!3d37.2465428!4d127.0764846!16s%2Fg%2F11rsbp4tg8',
      },
      {
        icon: '🍜',
        titleKO: '얜시부 — 마라탕 맛집',
        titleEN: 'Yaensibu — Malatang Spot',
        contentKO: '추천: 마라탕, 마라샹궈, 계란볶음밥. 영통 마라탕 맛집으로 정평. 마라탕+계란볶음밥 조합 강추.',
        contentEN: 'Must-order: Malatang, Mala Xiangguo, Egg Fried Rice. A well-established malatang spot. Malatang + egg fried rice combo is addictive.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ_zJG5BpFezURN3GLNS7NHdE',
      },
      {
        icon: '🍱',
        titleKO: '쿠지라 — 영통 유일 텐동',
        titleEN: 'Kujira — Only Tendon in Yeongtong',
        contentKO: '추천: 텐동. 영통 유일의 텐동 전문점. 가격대 있지만 맛 보장. 수용 인원 적어 웨이팅 가능.',
        contentEN: 'Must-order: Tendon (Tempura Rice Bowl). The only tendon restaurant in Yeongtong. Pricey but worth it. Small seating — waits are common.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJdSeSBdlEezURWQMcJFkyaxQ',
      },
      {
        icon: '🍺',
        titleKO: '좌우지간 — 바지락칼국수',
        titleEN: 'Jwawujigan — Clam Kalguksu',
        contentKO: '추천: 바지락칼국수, 냉면, 만두. 바지락 양이 특히 인상적. 콧물 날 것 같은 날에 생각나는 집.',
        contentEN: 'Must-order: Clam Kalguksu, Naengmyeon, Mandu. The clam amount is impressive. Perfect for a cold, rainy day.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJney8-NtEezURmTbw_SibryY',
      },
      {
        icon: '🍰',
        titleKO: '로코블링 — 마카롱',
        titleEN: 'Rocobling — Macarons',
        contentKO: '수원 마카롱 맛집으로 유명. 전 메뉴 추천. 인스타그램에서 메뉴 확인 후 방문 권장.',
        contentEN: "One of Suwon's most well-known macaron shops. Entire menu recommended. Check their Instagram for the full menu before visiting.",
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ_QG7bdxEezURHvehCDhvmIU',
      },
      {
        icon: '🍧',
        titleKO: '청춘과수원 — 과일 전문점',
        titleEN: 'Cheonchun Gwasuwon — Fruit Shop',
        contentKO: '추천: 제철 과일컵, 바나나아몬드 생과일주스. 기숙사생에게 특히 강추. 쿠폰 적립 꼭 챙기세요!',
        contentEN: 'Must-order: Seasonal Fruit Cup, Banana Almond Fresh Juice. Especially recommended for dorm residents. Collect loyalty card stamps!',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ_1l6JdxEezURLfoVeMyhey4',
      },
      {
        icon: '☕',
        titleKO: '더마스터커피 — 숨은 카페',
        titleEN: 'The Master Coffee — Hidden Café',
        contentKO: '추천: 초코케이크, 에그타르트(데워서), 아메리카노. 얜시부에서 세븐일레븐 쪽으로 돌아가면 있는 숨은 카페.',
        contentEN: 'Must-order: Chocolate Cake, Egg Tart (warmed), Americano. A hidden café — from Yaensibu, head toward the 7-Eleven and turn the corner.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJSeSSR9lEezURYKbL9gQ8lzw',
      },
      {
        icon: '🌮',
        titleKO: '맥시모브리또 — 영통 브리또 맛집',
        titleEN: 'Maximo Burrito',
        contentKO: '추천: 브리또. 영통 브리또 맛집으로 도스타코스보다 낫다는 평.',
        contentEN: 'Must-order: Burrito. The go-to burrito spot in Yeongtong, said to be better than Dos Tacos.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJWzFvZNxEezURbyQQNSHcEmA',
      },
    ],
  },
];
