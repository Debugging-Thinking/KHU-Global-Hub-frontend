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
