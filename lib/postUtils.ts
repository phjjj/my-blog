/**
 * 마크다운 본문에서 첫 번째 이미지 URL을 추출합니다.
 * http(s) URL만 추출하며, 로컬 경로(./foo.png)는 무시합니다.
 */
export function extractFirstImageUrl(content: string): string | null {
  const match = content.match(/!\[.*?\]\((https?:\/\/[^)]+)\)/);
  return match ? match[1] : null;
}

/**
 * post.image_url이 없으면 본문 첫 번째 이미지를 대신 사용합니다.
 */
export function resolveThumbnail(imageUrl: string, content: string): string | null {
  return imageUrl.trim() || extractFirstImageUrl(content);
}
