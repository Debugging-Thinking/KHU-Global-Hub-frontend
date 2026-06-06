import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

/** 업로드 함수들이 사용하는 최소 자산 형태. 웹은 File 포함, 네이티브는 uri 기반. */
export type PickedImage = {
  uri: string;
  file?: File;
  mimeType?: string;
  fileName?: string;
};

/**
 * 이미지 선택 (크로스 플랫폼).
 * - **웹**: 숨은 `<input type="file">`로 직접 선택. expo-image-picker의 미디어
 *   라이브러리 권한 게이트가 웹에서 'granted'를 안 줘서 업로드가 조용히 막히는
 *   문제를 회피한다. 선택된 File을 그대로 반환(= 첨부파일 다이얼로그).
 * - **네이티브**: expo-image-picker (미디어 라이브러리 권한 요청).
 *
 * 취소/권한거부 시 빈 배열.
 */
export async function pickImages(multiple = false): Promise<PickedImage[]> {
  if (Platform.OS === 'web') {
    return pickViaInput(multiple, 'image/*');
  }
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (perm.status !== 'granted') return [];
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: multiple,
    quality: 0.8,
  });
  if (res.canceled) return [];
  return res.assets.map((a) => ({
    uri: a.uri,
    mimeType: a.mimeType,
    fileName: a.fileName ?? undefined,
  }));
}

/**
 * 임의 파일 첨부 (이미지·PDF·문서 등).
 * - 웹: 파일 선택 다이얼로그(모든 형식).
 * - 네이티브: expo-document-picker 미설치 → 이미지 선택으로 폴백(데모는 웹 기준).
 */
export async function pickFiles(multiple = false): Promise<PickedImage[]> {
  if (Platform.OS === 'web') {
    return pickViaInput(multiple, '*/*');
  }
  return pickImages(multiple);
}

/** 웹 전용: 네이티브 파일 선택 다이얼로그를 띄워 File[] 을 받는다. */
function pickViaInput(multiple: boolean, accept: string): Promise<PickedImage[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    if (accept && accept !== '*/*') input.accept = accept;
    input.multiple = multiple;
    input.style.display = 'none';

    let settled = false;
    const finish = (picked: PickedImage[]) => {
      if (settled) return;
      settled = true;
      window.removeEventListener('focus', onFocus);
      if (input.parentNode) input.parentNode.removeChild(input);
      resolve(picked);
    };

    // 다이얼로그를 취소로 닫으면 change 이벤트가 안 와서 영원히 대기 → 포커스 복귀로 취소 감지.
    const onFocus = () => {
      setTimeout(() => {
        if (!settled && (!input.files || input.files.length === 0)) finish([]);
      }, 400);
    };

    input.onchange = () => {
      const files = input.files ? Array.from(input.files) : [];
      finish(
        files.map((f) => ({
          uri: URL.createObjectURL(f),
          file: f,
          mimeType: f.type,
          fileName: f.name,
        }))
      );
    };

    window.addEventListener('focus', onFocus);
    document.body.appendChild(input);
    input.click();
  });
}
