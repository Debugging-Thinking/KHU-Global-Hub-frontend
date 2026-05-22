import type { QuizQuestion } from '@/src/types/quiz';

interface LocalQuizQuestion extends QuizQuestion {
  answer: number;
  explanation: string;
}

export const LOCAL_QUIZ_QUESTIONS: LocalQuizQuestion[] = [
  { id: 1, category: '수강신청', question: '신입생이 수강신청 시 PC로만 신청 가능한 이유는?', options: ['앱에 오류가 자주 발생해서', '희망과목 담기 / 예비과목 담기를 사전에 진행하지 않았기 때문', '학교 규정상 신입생은 무조건 PC 사용', '모바일 앱은 2학년 이상만 사용 가능'], answer: 1, explanation: '신입생은 사전 희망과목 담기/예비과목 담기를 진행하지 않았기 때문에 PC 웹사이트로만 수강신청이 가능합니다.' },
  { id: 2, category: '수강신청', question: '수강신청 시 정각 타이밍 확인에 권장되는 서버시간 도구는?', options: ['네이버 시계', '카카오 시계', '네이비즘', '윈도우 내장 시계'], answer: 2, explanation: '네이비즘을 사용해야 하며, 밀리초 ON / 날짜 OFF 설정을 권장합니다. 0.001초 차이가 수백~수천 명의 순위 차이를 만들 수 있습니다.' },
  { id: 3, category: '수강신청', question: '수강신청 도중 절대 눌러서는 안 되는 키는?', options: ['Enter', 'Space', 'Tab', 'F5'], answer: 3, explanation: 'F5(새로고침)는 수강신청 중 절대 사용하면 안 됩니다. 또한 ESC를 약 1,000회 연타하면 수강신청 내역 전체가 초기화됩니다.' },
  { id: 4, category: '수강신청', question: '수강신청 당일, 신청 완료 확인창이 뜨면 어떤 키로 닫아야 하나요?', options: ['Enter', 'ESC', 'Delete', 'Backspace'], answer: 1, explanation: '확인창이 뜨면 ESC 키로 닫고 다음 학수번호를 바로 신청해야 합니다.' },
  { id: 5, category: '수강신청', question: '취소지연제는 몇 시경부터 적용되나요?', options: ['10시', '11시', '11시 30분', '12시'], answer: 2, explanation: '취소지연제는 11시 30분경부터 적용됩니다.' },
  { id: 6, category: '수강신청', question: '학점세이브제를 활용하면 다음 학기 최대 몇 학점까지 신청 가능한가요?', options: ['18학점', '19학점', '20학점', '21학점'], answer: 3, explanation: '학점세이브제는 F학점이 없는 경우 최대 3학점까지 세이브할 수 있으며, 다음 학기에 최대 21학점 신청이 가능합니다.' },
  { id: 7, category: '교통수단', question: '경희대 교내 구간 버스를 무료로 타는 방법은?', options: ['학생증을 기사님께 보여준다', '카드를 찍지 않으면 된다', '앱에서 무료 탑승 쿠폰을 발급받는다', '기사님께 학생임을 말한다'], answer: 1, explanation: '교내 구간에서는 카드를 찍지 않으면 무료입니다.' },
  { id: 8, category: '교통수단', question: '1550-1 버스에서 강남 방면으로 탑승하는 정류장은?', options: ['정건 (경희대학교 정류장)', '영통역 6번 출구', '정문 (경희대정문 정류장)', '학생회관 앞'], answer: 2, explanation: '강남 방면은 정문(경희대정문 정류장), 한신대 방면은 정건(경희대학교 정류장)에서 탑승해야 합니다.' },
  { id: 9, category: '교통수단', question: 'G5100 버스의 특징은?', options: ['교내 무료 구간이 없는 버스', '2층 버스', 'M버스 (광역급행버스)', '경희대 기점이 아닌 버스'], answer: 1, explanation: 'G5100은 강남행 2층 버스입니다.' },
  { id: 10, category: '교통수단', question: '영통역에서 경희대 정문까지 도보로 약 몇 분 거리인가요?', options: ['5분', '10분', '15분', '20분'], answer: 2, explanation: '영통역에서 학교까지 도보 약 15분 거리입니다.' },
  { id: 11, category: '후마니타스 교양', question: '2024학년도 입학생 기준 필수교과 이수학점은 총 몇 학점인가요?', options: ['12학점', '15학점', '17학점', '20학점'], answer: 2, explanation: '필수교과는 인간의가치탐색(3), 세계와시민(3), 빅뱅에서문명까지(3), 성찰과표현(3), 주제연구(3), 대학영어(2) 총 17학점입니다.' },
  { id: 12, category: '후마니타스 교양', question: "글쓰기 필수과목 '주제연구'를 수강하기 위한 선수과목은?", options: ['세계와시민', '인간의가치탐색', '성찰과표현', '대학영어'], answer: 2, explanation: "'성찰과표현'은 1학년 필수 과목이자 '주제연구'의 선수과목입니다." },
  { id: 13, category: '학교 사이트', question: '수강신청, 성적 조회, 학사 일정 확인을 모두 할 수 있는 사이트는?', options: ['e-Campus (이캠퍼스)', '인포21 (Info21)', '경희대 공식 홈페이지', '에브리타임'], answer: 1, explanation: '인포21(info21.khu.ac.kr)은 수강신청, 성적 조회, 학사 일정 등 학사 전반을 관리하는 핵심 사이트입니다.' },
  { id: 14, category: '학교 사이트', question: '그룹 스터디룸 온라인 예약이 가능한 사이트는?', options: ['인포21', 'lib.khu.ac.kr (중앙도서관)', 'khu-kr.libcal.com', 'khucoop.com (생협)'], answer: 2, explanation: '스터디룸 예약은 khu-kr.libcal.com에서 온라인으로 가능합니다.' },
];

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
