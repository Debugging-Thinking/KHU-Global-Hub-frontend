import { pickImages } from './pickImages';
import { imageApi } from '../api/image';

/**
 * 이미지 1장 선택 → S3 업로드 → URL 반환. 취소/실패 시 null.
 * (웹은 파일 선택 다이얼로그, 네이티브는 갤러리 — pickImages가 분기)
 */
export async function pickAndUploadImage(): Promise<string | null> {
  const picked = await pickImages(false);
  if (!picked[0]) return null;
  try {
    return await imageApi.upload(picked[0]);
  } catch {
    return null;
  }
}
