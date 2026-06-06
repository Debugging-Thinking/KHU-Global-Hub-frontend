import { Platform } from 'react-native';
import apiClient, { unwrap } from './client';
import type { PickedImage } from '../lib/pickImages';

/**
 * 범용 이미지 업로드: POST /api/images (multipart) → S3 URL.
 * 댓글/Q&A/답변/채팅이 본문 전송 전에 먼저 이미지를 올리고 URL만 본문에 담는다.
 */
export const imageApi = {
  upload: async (asset: PickedImage): Promise<string> => {
    const form = new FormData();
    if (Platform.OS === 'web') {
      if (asset.file) {
        form.append('image', asset.file);
      } else {
        const res = await fetch(asset.uri);
        const blob = await res.blob();
        form.append('image', blob, asset.fileName ?? 'upload.jpg');
      }
      const r = await apiClient.post('/images', form);
      return unwrap<{ url: string }>(r).url;
    } else {
      form.append('image', { uri: asset.uri, type: asset.mimeType ?? 'image/jpeg', name: asset.fileName ?? 'upload.jpg' } as any);
      const r = await apiClient.post('/images', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      return unwrap<{ url: string }>(r).url;
    }
  },
};
