import apiClient, { unwrap } from './client';
import type { BadgeId, BadgeInfo } from '../types/badge';

export const badgeApi = {
  earnBadge: (badgeId: BadgeId) =>
    apiClient
      .post(`/badges/${badgeId}`)
      .then(unwrap<BadgeInfo>),

  getMyBadges: () =>
    apiClient.get('/badges/me').then(unwrap<BadgeInfo[]>),

  getMemberBadges: (memberId: number) =>
    apiClient.get(`/members/${memberId}/badges`).then(unwrap<BadgeInfo[]>),
};
