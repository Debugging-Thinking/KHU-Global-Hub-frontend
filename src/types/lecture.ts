import type { Language } from './board';

export type AttendanceType = 'OFFLINE' | 'ONLINE' | 'BLENDED';
export type FrequencyLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface LectureSummary {
  lectureId: number;
  code: string;
  name: string;
  professor: string;
  college: string | null;
  type: string | null;
  credits: number | null;
  reviewCount: number;
  avgRating: number;
}

export interface CourseReview {
  reviewId: number;
  rating: number;
  content: string;
  originalContent: string;
  originalLanguage: Language;
  isMine: boolean;
  attendanceType: AttendanceType | null;
  presentationFreq: FrequencyLevel | null;
  groupWorkFreq: FrequencyLevel | null;
  assignmentFreq: FrequencyLevel | null;
  koreanUsage: FrequencyLevel | null;
  createdAt: string;
}

/** 옵션(enum name)별 응답 수. 0 버킷 포함. */
export interface IndicatorSummary {
  attendance: Record<string, number>;
  presentation: Record<string, number>;
  groupWork: Record<string, number>;
  assignment: Record<string, number>;
  koreanUsage: Record<string, number>;
}

export interface LectureDetail extends LectureSummary {
  semester: string;
  indicators: IndicatorSummary;
  reviews: CourseReview[];
}

export interface CreateReviewRequest {
  rating: number;
  content: string;
  attendanceType?: AttendanceType | null;
  presentationFreq?: FrequencyLevel | null;
  groupWorkFreq?: FrequencyLevel | null;
  assignmentFreq?: FrequencyLevel | null;
  koreanUsage?: FrequencyLevel | null;
  language?: Language;
}
