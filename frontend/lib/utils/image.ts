/**
 * HTTP URL을 HTTPS로 변환 (Mixed Content 방지)
 */
function ensureHttps(url: string): string {
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://')
  }
  return url
}

/**
 * 블로그/프로필 이미지 URL을 가져오는 유틸리티
 * thumbnail_url이 없거나 비어있으면 profile_image_url(카카오 프로필)을 사용
 */
export function getBlogImageUrl(
  thumbnailUrl?: string | null,
  profileImageUrl?: string | null
): string | null {
  // thumbnail_url이 유효한 경우에만 사용
  if (thumbnailUrl && thumbnailUrl.trim().length > 0) {
    return ensureHttps(thumbnailUrl)
  }
  // 그 외에는 profile_image_url 사용
  if (profileImageUrl && profileImageUrl.trim().length > 0) {
    return ensureHttps(profileImageUrl)
  }
  return null
}
