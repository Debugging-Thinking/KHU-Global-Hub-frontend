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
  // ─────────────────────────────────────────────────────────────
  // 수강신청
  // ─────────────────────────────────────────────────────────────
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
        titleEN: 'Freshmen: PC Only',
        contentKO: '수강신청은 모바일 앱 또는 PC 웹사이트 중 선택할 수 있습니다. 단, 신입생은 희망과목 담기/예비과목 담기를 사전에 진행하지 않았으므로 PC 웹사이트로만 수강신청이 가능합니다.',
        contentEN: 'Freshmen cannot use the mobile app — they must register via the PC website only, as pre-registration (wishlist) was not completed.',
      },
      {
        icon: '🏠',
        titleKO: '장소 선택: 집 vs 피시방',
        titleEN: 'Where to Register',
        contentKO: '컴퓨터 사양은 결과에 거의 영향 없습니다. 입장 타이밍과 손놀림이 결과의 95%를 결정합니다.\n\n• 집 컴퓨터: 심각하게 노후화된 기기가 아니라면 충분\n• 피시방: 1시간 전 도착 권장. 30분 전은 촉박할 수 있음\n\n실제로 학교 근로 컴퓨터에서 올클한 사례도 많고, 고사양 PC방에서 전패한 사례도 많습니다.',
        contentEN: 'Hardware barely matters — timing and speed are 95% of the result.\n• Home PC: fine unless severely outdated\n• PC café: arrive 1 hour early (30 min is too tight)',
      },
      {
        icon: '🖥️',
        titleKO: '3창 구성 + 메모장 준비',
        titleEN: '3-Window Setup',
        contentKO: '3개 창을 준비하세요:\n① 네이비즘 서버시간 (네이버 검색 → 네이비즘, 밀리초 ON / 날짜 OFF)\n② 메모장 — 학수번호 목록 (하이픈 제거, 경쟁 치열한 수업 위쪽, 대안 코드 준비)\n③ 수강신청 사이트\n\n⚠️ 네이버 시계 등 다른 시간 도구는 사용하지 마세요.\n💡 교양 수업은 강의평가가 좋은 교수를 반드시 선택하세요. 교수에 따른 편차가 매우 큽니다.',
        contentEN: 'Prepare 3 windows:\n① Navism server clock (milliseconds ON, date OFF)\n② Notepad — course codes (no hyphens, competitive courses on top, have backups)\n③ Registration site\n\n💡 For electives, always check lecture ratings — quality varies a lot by professor.',
      },
      {
        icon: '⚙️',
        titleKO: 'PC 환경 설정 체크리스트',
        titleEN: 'Pre-Registration PC Setup',
        contentKO: '수강신청 전 완료해야 할 설정:\n• 크롬: 마우스 우클릭 → 관리자 권한으로 실행\n• 팝업: 크롬 설정 → 팝업 및 리디렉션 → 허용\n• 백그라운드 앱 모두 OFF\n• 백신 프로그램 일시 중지\n• 네이비즘: 날짜 OFF, 밀리초 ON\n• 서버시간 일치 여부 반드시 확인\n• 비활성 10분 시 자동 로그아웃 → 주기적으로 페이지 갱신\n• F5 절대 금지\n\n💡 0.001초 차이가 수백~수천 명 순위 차이로 이어질 수 있습니다.',
        contentEN: 'Complete before registration:\n• Chrome: run as administrator\n• Allow popups in Chrome settings\n• Close all background apps\n• Pause antivirus\n• Navism: date OFF, milliseconds ON\n• Verify server time matches\n• Refresh page periodically (auto-logout after 10 min)\n• NEVER press F5',
      },
      {
        icon: '🎯',
        titleKO: '당일 진행 순서',
        titleEN: 'Registration Day Steps',
        contentKO: '당황하지 않는 것이 가장 중요합니다. 침착하게:\n\n① 메모장 최상단 학수번호 미리 복사\n② 수강신청 사이트 입장\n③ 학수번호 검색창(상단 우측)에 붙여넣기\n④ 수강신청 버튼 클릭 (화면 왼쪽)\n⑤ 확인창 뜨면 ESC 키로 닫기\n⑥ 다음 학수번호 복사 후 반복\n\n⚠️ ESC 연타 주의 — 매크로 방지 팝업 활성화 가능\n⚠️ ESC 약 1,000회 연타 시 수강신청 내역 전체 초기화!',
        contentEN: "Stay calm:\n① Copy top course code from notepad\n② Enter the registration site\n③ Paste into the search box (top right)\n④ Click register (left side)\n⑤ Close confirmation with ESC\n⑥ Copy next code and repeat\n\n⚠️ Don't spam ESC — ~1,000 presses resets everything!",
      },
      {
        icon: '✅',
        titleKO: '올클 성공 후 대처',
        titleEN: 'If You Got Everything',
        contentKO: '• 강의평가가 모두 양호하면 그대로 종료\n• 평이한 교수가 있다면 잔여 인원 변동을 주시하며 더 좋은 강의로 교체 시도\n\n💡 비대면 수업은 "분반" 제도로 관리자가 시간차로 티오를 추가 공개합니다. 놓쳤더라도 포기하지 말고 계속 확인하세요. 갑자기 10분 후 10명이 풀리는 경우도 있습니다.',
        contentEN: "• If all lecture ratings are good, you're done\n• If a professor seems average, keep watching for seat changes\n\n💡 Online courses release extra seats over time — don't give up checking.",
      },
      {
        icon: '❌',
        titleKO: '올클 실패 후 대처',
        titleEN: 'If You Missed Some Courses',
        contentKO: '① 대안 수업 코드로 침착하게 신청 시도\n② 1학년 수업 티오는 비교적 넉넉 — 시간표 구성 자체가 불가능한 경우는 드뭄\n③ 최소 12시까지는 사이트 유지하며 잔여 티오 확인\n\n💡 취소지연제: 11시 30분경부터 적용. 다른 학생이 취소해도 일정 시간 후 신청 가능 — 소수 자리 확보 기회.\n💡 1학년 필수 과목은 대부분 계절학기에도 개설됩니다.',
        contentEN: '① Try backup course codes calmly\n② Freshman course seats are relatively plentiful\n③ Keep the site open until at least noon\n\n💡 Cancellation delay from ~11:30 — freed seats become claimable after a short delay.',
      },
      {
        icon: '📅',
        titleKO: '정정 기간 (3/4 ~ 3/8)',
        titleEN: 'Add/Drop Period (Mar 4–8)',
        contentKO: '3월 4일 10:30 ~ 3월 8일(금): 신청 못한 과목 추가 또는 수강 취소 가능.\n\n• 본전공 (2학년 이상): 교수 재량으로 강입 가능 ✅\n• 전공기초: 사실상 불가 — 빈 자리 직접 확인 ❌\n• 교양: 사실상 불가 — 빈 자리 직접 확인 ❌\n\n⚠️ 전공기초 미이수 시 성적우수장학금 지급 제한 가능!\n💡 인기 강의(별점 4.0↑)는 정정 기간에도 빈 자리 거의 없습니다.',
        contentEN: 'Mar 4 10:30 ~ Mar 8 (Fri): add or drop courses.\n\n• Major courses (2nd yr+): professor may allow entry ✅\n• Core major courses: practically impossible ❌\n• Electives: practically impossible ❌\n\n⚠️ Missing core courses may block merit scholarships!',
      },
      {
        icon: '💾',
        titleKO: '학점세이브제',
        titleEN: 'Credit Save System',
        contentKO: '부득이하게 수강학점이 부족할 경우 활용할 수 있는 최후의 수단:\n• 이번 학기 이수학점이 기준보다 적을 경우, 다음 학기에 최대 21학점(3학점 추가) 신청 가능\n• 조건: F 학점 없음, 최대 3학점까지 세이브 가능\n\n자세한 조건은 학교 정보게시판을 참고하세요.',
        contentEN: "Last resort if you're short on credits:\n• Carry up to 3 credits into next semester (max 21 next sem)\n• Condition: no F grades\n\nCheck the school bulletin board for full conditions.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 교통수단
  // ─────────────────────────────────────────────────────────────
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
        titleEN: 'Free Campus Rides',
        contentKO: '아래 버스들은 교내 구간을 무료로 이용할 수 있습니다:\n9 / 7000 / 5100 / 1112 / M5107 / 1560\n\n• 교내 → 외부: 정건(경희대학교 정류장)까지 무료\n• 외부 → 교내: 정문(경희대정문 정류장)부터 무료\n• 방법: 카드를 찍지 않으면 됩니다\n\n💡 기사님께 탑승 시 "감사합니다~" 인사는 꼭 해주세요!\n⚠️ 정문 이전 탑승 또는 정건 이후 이동 시 요금 부과.',
        contentEN: "Free within campus on: 9 / 7000 / 5100 / 1112 / M5107 / 1560\n\n• Outbound: free until Jeonggeon stop\n• Inbound: free from Front Gate stop\n• How: simply don't tap your card\n\n⚠️ Fare applies if boarding before Front Gate or exiting after Jeonggeon.",
      },
      {
        icon: '🏙️',
        titleKO: '서울 직행 빨간 버스',
        titleEN: 'Express Buses to Seoul',
        contentKO: '중간 정류장 없이 고속 운행:\n\n• 7000 → 사당\n• 5100 → 강남\n• 1112 → 잠실, 구의(건대 근처)\n• 1560 → 강남\n• G5100 → 강남 🚌 2층 버스\n\n소요 시간: 약 1시간 (퇴근 시간 추가 소요)\n⚠️ 입석 불가 — 좌석 없으면 다음 버스 이용\n💡 대부분 경희대 기점 → 좌석 확보 비교적 수월',
        contentEN: 'Express routes:\n• 7000 → Sadang\n• 5100 → Gangnam\n• 1112 → Jamsil, Guui\n• 1560 → Gangnam\n• G5100 → Gangnam (double-decker 🚌)\n\n~1 hour. No standing — wait for next bus if full.',
      },
      {
        icon: '⚠️',
        titleKO: '1550-1 탑승 방향 주의',
        titleEN: '1550-1: Watch Direction',
        contentKO: '반대로 타는 사례가 종종 있습니다!\n\n• 강남 방면 → 정문 (경희대정문 정류장)\n• 한신대 방면 → 정건 (경희대학교 정류장)\n\n만석 상황이 종종 발생합니다.',
        contentEN: 'Easy to board the wrong way — check!\n\n• To Gangnam → Front Gate stop\n• To Hanshin Univ → Jeonggeon stop\n\nCan fill up quickly.',
      },
      {
        icon: '🚇',
        titleKO: 'M5107 — 서울 도심 직행',
        titleEN: 'M5107 — City Center Express',
        contentKO: 'M버스(광역급행버스): 경희대 ↔ 을지로·시청·서울역\n• 교내 진입, 무료 탑승 가능\n\n💡 운행 시간 전 탑승 시: 기사님이 정건에서 내렸다가 다시 탑승하도록 안내할 수 있습니다. 단말기 비활성 상태이므로 안내에 따라 행동하면 됩니다.',
        contentEN: 'M-bus: KHU ↔ Euljiro · City Hall · Seoul Station\n• Boards on campus (free)\n\n💡 Before service starts, driver may ask you to re-board at Jeonggeon.',
      },
      {
        icon: '🚶',
        titleKO: '영통역 → 학교 이동 팁',
        titleEN: 'Yeongton Station → Campus',
        contentKO: '영통역에서 학교까지 도보 약 15분.\n특히 자대(전정대)·국제대·중앙도서관 쪽은 버스 이용 권장.\n\n• 시간·체력 여유: 정문까지 도보 → 정문에서 무료 탑승\n• 시간 애매: 6번 출구 → 310번 또는 900번 → 정건 하차 후 지하보도\n• 걷기 싫음: 6번 출구 → 9번 대기 (배차 간격 있음)\n• 지각 직전: 8번 출구 → 빨간 버스 (요금 발생)\n\n⚠️ 310번·900번은 정건 하차 후 지하보도를 건너야 합니다.',
        contentEN: '~15 min walk from Yeongton Station.\n\n• Time to spare: walk to Front Gate, ride free\n• Moderate: Exit 6 → 310 or 900 → Jeonggeon (underpass)\n• Lazy: Exit 6 → wait for route 9\n• Late: Exit 8 → red express bus (fare)\n\n⚠️ Routes 310/900: cross the underpass after Jeonggeon.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 맛집 — 노션 원문 전체 수록
  // ─────────────────────────────────────────────────────────────
  {
    id: 'FOOD',
    titleKO: '맛집',
    titleEN: 'Restaurants',
    emoji: '🍽️',
    color: '#E8650A',
    tips: [
      {
        icon: '🥟',
        titleKO: '사담손만두 — 한식',
        titleEN: 'Sadam Dumplings — Korean',
        contentKO: '추천 메뉴: 만두전골, 튀김만두\n\n만두전골은 가는 인원보다 1인분 적게 시킬 것을 권장할 만큼 만두 양이 압도적입니다. 튀김만두도 끝판왕급 바삭함을 자랑합니다.',
        contentEN: 'Rec: Dumpling hot pot, fried dumplings\n\nThe hot pot is massive — order one less than your group. Fried dumplings are incredibly crispy.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ-WvQaDJQezURZRmpOAZlYEM',
      },
      {
        icon: '🍜',
        titleKO: '좌우지간 — 바지락칼국수',
        titleEN: 'Jwawujigan — Clam Noodles',
        contentKO: '추천 메뉴: 바지락칼국수, 냉면, 만두\n\n냉면·만두 전문점이지만 바지락칼국수의 바지락 양이 특히 인상적입니다. 콧물 날 것 같은 날에 생각나는 집.',
        contentEN: 'Rec: Clam noodle soup, cold noodles, dumplings\n\nPrimarily a cold noodle place, but the clam noodle soup is the standout. Perfect for cold days.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJney8-NtEezURmTbw_SibryY',
      },
      {
        icon: '🥩',
        titleKO: '천보현 — 점심특선 6,900원',
        titleEN: 'Cheonbohyeon — ₩6,900 Lunch',
        contentKO: '추천 메뉴: 육회비빔밥 + 차돌된장찌개 (점심특선)\n\n6,900원짜리 점심특선이 핵심입니다. 육회비빔밥은 유명 고깃집보다 낫다는 평도 있을 정도.',
        contentEN: 'Rec: Yukhoe bibimbap + beef doenjang stew (lunch set)\n\nThe ₩6,900 lunch set is the main draw. Rivals famous BBQ spots.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ8UDQnNxEezURxVPGqSxDea0',
      },
      {
        icon: '🍚',
        titleKO: '밥은화 — 가성비 끝판왕',
        titleEN: 'Babeunhwa — Best Value',
        contentKO: '추천 메뉴: 쭈꾸미숙주덮밥, 닭껍질교자튀김\n\n3,500~5,500원대의 가성비 끝판왕 체인점입니다. 쭈꾸미숙주덮밥에 맥주 한 잔 조합이 강추. 닭껍질교자튀김은 맥주 안주로 딱. 단, 평일 점심엔 웨이팅 각오 필요.',
        contentEN: 'Rec: Spicy squid sprout bowl, chicken skin fried dumplings\n\nChain restaurant, ₩3,500–5,500. Squid bowl + beer after class = perfect. Expect a lunch wait on weekdays.',
        link: 'https://www.google.com/maps/place/%EB%B0%A5%EC%9D%80%ED%99%94+%EA%B2%BD%ED%9D%AC%EB%8C%80%EA%B5%AD%EC%A0%9C%EC%BA%A0%ED%8D%BC%EC%8A%A4%EC%A0%90/data=!3m1!4b1!4m6!3m5!1s0x357b452e7b0d177b:0x1f5efd10481b8e25!8m2!3d37.2465428!4d127.0764846!16s%2Fg%2F11rsbp4tg8?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D',
      },
      {
        icon: '🌶️',
        titleKO: '청진옥 — 제육볶음',
        titleEN: 'Cheongjinok — Spicy Pork',
        contentKO: '추천 메뉴: 제육볶음\n\n제육볶음이 맛있습니다. 사담손만두에서 길 건너편에 위치.',
        contentEN: 'Rec: Spicy pork stir-fry\n\nSolid spicy pork. Across the street from Sadam Dumplings.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJg_sLqdlEezURd28V2oN1avY',
      },
      {
        icon: '🐙',
        titleKO: '어반드림 — 고등어·쭈꾸미',
        titleEN: 'Urban Dream — Mackerel & Squid',
        contentKO: '추천 메뉴: 점심특선 고등어구이, 쭈꾸미\n\n가격은 살짝 부담스러울 수 있으나 맛은 그만큼 보장됩니다. 함께 나오는 샐러드가 고소하고 맛있다는 후기.',
        contentEN: 'Rec: Lunch set mackerel, spicy squid\n\nSlightly pricier but quality matches. Side salad is notably good.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ7wmg4MREezUR0hXGUKxxgOY',
      },
      {
        icon: '🍱',
        titleKO: '전주본가 — 돈까스·제육',
        titleEN: 'Jeonju Bonga',
        contentKO: '추천 메뉴: 돈까스, 콩나물순두부찌개, 제육볶음',
        contentEN: 'Rec: Tonkatsu, soybean sprout tofu stew, spicy pork',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJef10VtlEezURvUDjsg76Kj4',
      },
      {
        icon: '🍲',
        titleKO: '부대통령 — 밥 무한리필',
        titleEN: 'Budaetongnyeong — Unlimited Rice',
        contentKO: '추천 메뉴: 우렁된장찌개, 닭갈비\n\n밥 무한리필 가능합니다. 배가 많이 고픈 날 찌개 하나에 밥 두 공기도 거뜬합니다.',
        contentEN: 'Rec: Snail doenjang stew, dakgalbi\n\nUnlimited rice refills. Perfect for big appetites.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJz6NtewBFezURKR4SwIWsiJ4',
      },
      {
        icon: '🥩',
        titleKO: '맛돈 — 볶음밥',
        titleEN: 'Matdon — Fried Rice',
        contentKO: '추천 메뉴: 볶음밥\n\n나쁘지 않은 가성비의 고깃집입니다. 방학 중 리모델링 이력 있음, 개강 후 영업 여부 확인 권장.',
        contentEN: 'Rec: Fried rice\n\nDecent value BBQ spot. Has been renovated during breaks — confirm it\'s open after semester starts.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJHQ7yUdlEezURAkRfwhDiC0w',
      },
      {
        icon: '🍖',
        titleKO: '주호식당 — 소고기전골',
        titleEN: 'Juho Restaurant — Beef Hot Pot',
        contentKO: '추천 메뉴: 소고기전골, 새우튀김\n\n메인은 술집이지만 소고기전골이 특히 맛있습니다. 안주류 전반적으로 수준급.',
        contentEN: 'Rec: Beef hot pot, fried shrimp\n\nPrimarily a bar, but the beef hot pot is excellent. Appetizers are high quality overall.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJP9IBBdxEezURoLqX905ON48',
      },
      {
        icon: '🍱',
        titleKO: '겐코 — 대창덮밥',
        titleEN: 'Genko — Daechang Bowl',
        contentKO: '추천 메뉴: 대창덮밥 (매운맛 추천), 나가사키, 새우장동\n\n대창덮밥은 느끼할 수 있으니 매운맛으로 주문을 권장합니다. 점심 웨이팅이 있지만 기다릴 만합니다.',
        contentEN: 'Rec: Daechang bowl (order spicy), Nagasaki, shrimp jang bowl\n\nOrder spicy to cut the richness. Lunch queue, but worth the wait.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ-wo3VZ1FezURRaMr3qgcWUM',
      },
      {
        icon: '🍛',
        titleKO: '부타센세 — 부타동',
        titleEN: 'Butasensei — Pork Bowl',
        contentKO: '추천 메뉴: 부타동, 오야코동\n\n메뉴가 심플한 편입니다. 호불호가 다소 갈리는 편.',
        contentEN: 'Rec: Pork rice bowl, oyakodon\n\nSimple menu. Mixed reviews — worth trying once.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ3bGH4KZFezUR6ykAoH6WXiw',
      },
      {
        icon: '🥩',
        titleKO: '키와마루아지 — 규동',
        titleEN: 'Kiwamaruaji — Beef Bowl',
        contentKO: '추천 메뉴: 규동\n\n규동 하나만큼은 강력 추천합니다.',
        contentEN: 'Rec: Gyudon\n\nThe gyudon alone is a strong recommendation.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJjdj9ctxEezURsW0wTs6kmrw',
      },
      {
        icon: '🍤',
        titleKO: '쿠지라 — 텐동 (영통 유일)',
        titleEN: 'Kujira — Tempura Bowl',
        contentKO: '추천 메뉴: 텐동\n\n영통 유일의 텐동 전문점입니다. 가격이 있는 만큼 맛도 보장됩니다. 가게 구조상 수용 인원이 적으니 참고.',
        contentEN: "Rec: Tempura rice bowl\n\nYeongton's only tempura specialist. Pricier but quality is guaranteed. Small seating capacity.",
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJdSeSBdlEezURWQMcJFkyaxQ',
      },
      {
        icon: '🥩',
        titleKO: '미미카츠 — 돈가스',
        titleEN: 'Mimikatsu — Tonkatsu',
        contentKO: '추천 메뉴: 돈가스\n\n맛있지만 시간이 지나면 눅눅해지는 편이라 빠르게 먹는 것을 추천합니다.',
        contentEN: 'Rec: Tonkatsu\n\nDelicious but gets soggy quickly — eat fast.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJow8U59hFezURBPLju5i66Rs',
      },
      {
        icon: '🌶️',
        titleKO: '얜시부 — 마라탕',
        titleEN: 'Yenshibu — Malatang',
        contentKO: '추천 메뉴: 마라탕, 마라샹궈, 꿔바로우, 계란볶음밥\n\n마라탕 맛집으로 정평이 나 있습니다. 마라탕과 계란볶음밥 조합이 일품.',
        contentEN: 'Rec: Malatang, malaguo, sweet & sour pork, egg fried rice\n\nThe go-to malatang spot. Malatang + egg fried rice combo is a must.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ_zJG5BpFezURN3GLNS7NHdE',
      },
      {
        icon: '🥢',
        titleKO: '짜마차이나 — 김치삼겹덮밥',
        titleEN: 'Jjamachina — Kimchi Pork Bowl',
        contentKO: '추천 메뉴: 김치삼겹덮밥',
        contentEN: 'Rec: Kimchi pork belly rice bowl',
        link: 'https://maps.app.goo.gl/D11jSRYZg4aeonq97',
      },
      {
        icon: '🌶️',
        titleKO: '두가지 떡볶이 — 로제',
        titleEN: 'Two Tteokbokki — Rose Sauce',
        contentKO: '추천 메뉴: 로제떡볶이, 닭껍질튀김, 오돌뼈\n\n로제떡볶이가 원픽. 조리 시간이 다소 걸리지만 기다릴 만한 맛입니다.',
        contentEN: 'Rec: Rose tteokbokki, fried chicken skin, cartilage\n\nRose tteokbokki is the top pick. Takes time but worth the wait.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJc6ng9NtEezURh560XwubxY8',
      },
      {
        icon: '🍱',
        titleKO: '분식나라 김밥마을',
        titleEN: 'Bunsik Nara Gimbap',
        contentKO: '추천 메뉴: 알밥, 카레칼국수',
        contentEN: 'Rec: Egg roe rice bowl, curry noodle soup',
        link: 'https://maps.app.goo.gl/dNku4UjpvkHZiGdn9',
      },
      {
        icon: '🧁',
        titleKO: '로코블링 — 마카롱',
        titleEN: 'Rocobring — Macarons',
        contentKO: '추천 메뉴: 마카롱 (전 메뉴)\n\n수원 마카롱 맛집으로 알려져 있습니다. 인스타그램에서 메뉴 확인 권장.',
        contentEN: 'Rec: Macarons (all flavors)\n\nWell-known macaron spot in Suwon. Check Instagram for current menu.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ_QG7bdxEezURHvehCDhvmIU',
      },
      {
        icon: '🍓',
        titleKO: '청춘과수원 — 과일 전문점',
        titleEN: 'Youth Orchard — Fruit Shop',
        contentKO: '추천 메뉴: 제철 과일컵, 바나나아몬드 생과일주스\n\n기숙사생에게 특히 강추하는 과일 전문점입니다. 쿠폰 적립 꼭 챙기세요. 사장님이 친절하기로 유명합니다.',
        contentEN: 'Rec: Seasonal fruit cup, banana almond fresh juice\n\nHighly recommended for dorm students. Collect stamp coupons. Owner is famously kind.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJ_1l6JdxEezURLfoVeMyhey4',
      },
      {
        icon: '☕',
        titleKO: '더마스터커피 — 숨은 카페',
        titleEN: 'The Master Coffee — Hidden Café',
        contentKO: '추천 메뉴: 초코케이크, 에그타르트 (데워서), 아메리카노\n\n얜시부에서 세븐일레븐 쪽으로 돌아가면 있는, 다소 숨어 있는 카페입니다. 꾸덕하고 달달한 초코케이크가 시그니처.',
        contentEN: 'Rec: Choco cake, egg tart (warmed), Americano\n\nHidden café near 7-Eleven off Yenshibu. Dense, sweet choco cake is the signature.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJSeSSR9lEezURYKbL9gQ8lzw',
      },
      {
        icon: '🍧',
        titleKO: '스노우화이트 — 팥빙수',
        titleEN: 'Snow White — Bingsu',
        contentKO: '추천 메뉴: 팥빙수 (2인분 / 4명이서 나눠먹기 최적)\n\n프랜차이즈 빙수 전문점입니다. 4명이 2인분으로 배불리 먹는 가성비가 포인트. 눈꽃얼음 스타일은 아님을 참고하세요.',
        contentEN: 'Rec: Red bean bingsu (2 servings = perfect for 4)\n\nFranchise shaved ice. Best value: 4 people share 2 servings. Not the soft snow-flake style.',
        link: 'https://maps.app.goo.gl/zGfhggDE2taLQZJ16',
      },
      {
        icon: '🥗',
        titleKO: '푸오코 — 샐러드',
        titleEN: 'Fuoco — Salad',
        contentKO: '추천 메뉴: 카야잼 샌드위치, 계란샐러드\n\n샐러드 전문점. 양이 많고 맛있습니다. 메뉴는 인스타그램 참고 권장.',
        contentEN: 'Rec: Kaya jam sandwich, egg salad\n\nSalad-focused. Generous portions. Check Instagram for menu.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJV_dl1aZFezURMNnXoJFWhDw',
      },
      {
        icon: '🍕',
        titleKO: '솔피 — 씬 도우 피자',
        titleEN: 'Solpi — Thin Crust Pizza',
        contentKO: '추천 메뉴: 씬 도우 피자, 사이드 메뉴\n\n파바 뒤 반지하에 위치. 얇은 도우를 선호한다면 강추. 내부 리모델링 완료. 피맥 조합으로 딱 좋습니다.',
        contentEN: 'Rec: Thin crust pizza, sides\n\nBasement behind Paris Baguette. Top for thin crust lovers. Freshly renovated. Pizza + beer = perfect.',
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJFxk7tC5FezURX7yjI4KoF5I',
      },
      {
        icon: '🌯',
        titleKO: '맥시모브리또 — 브리또',
        titleEN: 'Maximo Burrito',
        contentKO: '추천 메뉴: 브리또\n\n영통 브리또 맛집으로 도스마스보다 맛있다는 평가가 있습니다.',
        contentEN: "Rec: Burrito\n\nYeongton's top burrito spot — said to beat Dos Mas.",
        link: 'https://www.google.com/maps/place/?q=place_id:ChIJWzFvZNxEezURbyQQNSHcEmA',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 학교 사이트
  // ─────────────────────────────────────────────────────────────
  {
    id: 'CAMPUS_SITE',
    titleKO: '학교 사이트',
    titleEN: 'Campus Websites',
    emoji: '🔗',
    color: '#1565C0',
    tips: [
      {
        icon: '🏫',
        titleKO: '경희대 공식 홈페이지',
        titleEN: 'KHU Official Website',
        contentKO: '공지사항, 학교 전반 안내\nkhu.ac.kr',
        contentEN: 'Notices and general university information\nkhu.ac.kr',
        link: 'https://www.khu.ac.kr/',
      },
      {
        icon: '📋',
        titleKO: '인포21 — 수강신청·성적·학사',
        titleEN: 'Info21 — Academic Hub',
        contentKO: '수강신청, 성적 조회, 학사 일정 등 학사 전반 관리\ninfo21.khu.ac.kr',
        contentEN: 'Course registration, grades, academic calendar and more\ninfo21.khu.ac.kr',
        link: 'https://info21.khu.ac.kr/',
      },
      {
        icon: '💻',
        titleKO: 'e-Campus — 강의·과제·출결',
        titleEN: 'e-Campus — Lectures & Tasks',
        contentKO: '온라인 강의 수강, 과제 제출, 출결 관리\ne-campus.khu.ac.kr',
        contentEN: 'Online lectures, assignment submission, attendance\ne-campus.khu.ac.kr',
        link: 'https://e-campus.khu.ac.kr/',
      },
      {
        icon: '📚',
        titleKO: '국제캠퍼스 중앙도서관',
        titleEN: 'Central Library',
        contentKO: '도서 검색, 열람실 이용\nlib.khu.ac.kr',
        contentEN: 'Book search, reading room access\nlib.khu.ac.kr',
        link: 'https://lib.khu.ac.kr/',
      },
      {
        icon: '🗓️',
        titleKO: '스터디룸 예약',
        titleEN: 'Study Room Booking',
        contentKO: '그룹 스터디룸 온라인 예약\nkhu-kr.libcal.com',
        contentEN: 'Book group study rooms online\nkhu-kr.libcal.com',
        link: 'https://khu-kr.libcal.com/',
      },
      {
        icon: '🏛️',
        titleKO: '학사지원과 — 휴·복학·학적',
        titleEN: 'Academic Affairs Office',
        contentKO: '휴학, 복학, 학적 변동 등 학사 행정 처리\nghaksa.khu.ac.kr',
        contentEN: 'Leave of absence, re-enrollment, academic record changes\nghaksa.khu.ac.kr',
        link: 'http://ghaksa.khu.ac.kr/',
      },
      {
        icon: '🏠',
        titleKO: '생협 — 식당·매점·귀향버스',
        titleEN: 'Co-op — Cafeteria & Services',
        contentKO: '학생식당, 매점, 귀향버스 예약 등\nkhucoop.com',
        contentEN: 'Cafeteria, convenience store, hometown bus booking\nkhucoop.com',
        link: 'https://khucoop.com/',
      },
      {
        icon: '🏘️',
        titleKO: '국제캠퍼스 기숙사',
        titleEN: 'Dormitory',
        contentKO: '기숙사 신청, 생활 안내\ndorm2.khu.ac.kr',
        contentEN: 'Dormitory application and living guide\ndorm2.khu.ac.kr',
        link: 'https://dorm2.khu.ac.kr/',
      },
      {
        icon: '📱',
        titleKO: '에브리타임 — 강의평가',
        titleEN: 'Everytime — Lecture Reviews',
        contentKO: '재학생 커뮤니티, 강의평가 열람\n시간표 짜기 전 반드시 참고!\neverytime.kr',
        contentEN: 'Student community + lecture reviews\nMust-check before building your schedule!\neverytime.kr',
        link: 'https://everytime.kr/',
      },
      {
        icon: '📸',
        titleKO: '경희대 공식 인스타그램',
        titleEN: 'KHU Official Instagram',
        contentKO: '학교 소식, 이벤트 안내\n@kyunghee_university',
        contentEN: 'University news and events\n@kyunghee_university',
        link: 'https://www.instagram.com/kyunghee_university/',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 후마니타스 교양
  // ─────────────────────────────────────────────────────────────
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
        contentKO: '2024학년도 입학생 기준 필수교과 (총 17학점):\n\n• 인간의가치탐색 — 3학점 (1학년)\n• 세계와시민 — 3학점 (1학년)\n• 빅뱅에서문명까지 — 3학점 (전학년)\n• 성찰과표현 — 3학점 (1학년 필수, 주제연구 선수)\n• 주제연구 — 3학점 (2학년)\n• 대학영어 — 2학점 (1학년, 3시간 수업)\n\n국제캠퍼스: 대학영어를 한국어 과목으로 대체 가능',
        contentEN: 'Required courses for 2024 entrants (17 credits):\n\n• Value Exploration — 3 cr (1st yr)\n• World & Citizen — 3 cr (1st yr)\n• BigBang to Civilization — 3 cr (all yrs)\n• Reflection & Expression — 3 cr (1st yr, prereq for Thematic Research)\n• Thematic Research — 3 cr (2nd yr)\n• College English — 2 cr (1st yr, 3 hrs)\n\nIntl campus: may substitute English with a Korean course',
      },
      {
        icon: '✍️',
        titleKO: '성찰과표현 → 주제연구 선수',
        titleEN: 'Reflection → Prerequisite',
        contentKO: '"성찰과표현"은 1학년 필수 과목이자 "주제연구"의 선수과목입니다.\n1학년 때 반드시 이수해야 2학년에 주제연구 수강이 가능합니다.',
        contentEN: '"Reflection & Expression" is a 1st-year requirement AND prerequisite for "Thematic Research."\nMust complete in 1st year to take Thematic Research in 2nd year.',
      },
      {
        icon: '🌍',
        titleKO: '배분이수교과 — 5영역 중 3개',
        titleEN: 'Distribution — 3 of 5 Areas',
        contentKO: '5개 영역 중 3개 이상 선택, 9학점 이상 이수:\n\n① 생명·우주·인간\n② 분석·추론·논리\n③ 상징·문화·소통\n④ 사회·공동체·평화\n⑤ 지능·정보·미래\n\n각 과목: 3시간 3학점',
        contentEN: 'Choose 3+ of 5 areas, earn 9+ credits:\n\n① Life·Universe·Humanity\n② Analysis·Reasoning·Logic\n③ Symbol·Culture·Communication\n④ Society·Community·Peace\n⑤ Intelligence·Information·Future\n\nEach course: 3 hrs / 3 credits',
      },
      {
        icon: '📊',
        titleKO: '교양 이수학점 총정리',
        titleEN: 'Total Humanities Credits',
        contentKO: '• 필수교과: 17학점\n• 배분이수교과: 9학점 이상\n• 자유이수교과: 3학점 이상\n→ 합계 최소 29학점\n\n최대 인정:\n• 서울캠퍼스: 56학점\n• 국제캠퍼스: 50학점\n\n국제캠퍼스 자유이수: "전공탐색및기업가정신세미나" 필수 (외국인·편입생 면제)',
        contentEN: '• Required: 17 cr\n• Distribution: 9+ cr\n• Elective: 3+ cr\n→ Minimum total: 29 credits\n\nMax recognized:\n• Seoul campus: 56 cr\n• Intl campus: 50 cr\n\nIntl campus elective: "Major Exploration & Entrepreneurship" required (exempted for foreign/transfer students)',
      },
      {
        icon: '⚠️',
        titleKO: '2023년 이전 입학생 주의',
        titleEN: 'Note for Pre-2024 Entrants',
        contentKO: '2023학년도 이전 입학생은 "교육과정개편에 따른 경과조치"를 별도로 확인해야 합니다.\n\n일반편입학생: 배분이수교과 영역 구분 없이 9학점 이상 취득 시 배분이수영역 이수로 인정.',
        contentEN: 'Pre-2024 students must check the "Curriculum Reform Transition Measures" separately.\n\nTransfer students: 9+ credits in distribution courses (any area) counts as fulfilling the distribution requirement.',
      },
    ],
  },
];
