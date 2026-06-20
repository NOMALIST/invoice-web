// Cloudinary 이미지 업로드 헬퍼
// 서버 사이드 업로드 및 URL 변환 유틸리티

/**
 * Cloudinary 업로드 API 엔드포인트 URL 반환
 * 클라이언트 사이드에서 직접 업로드 시 사용
 */
export function getCloudinaryUploadUrl(): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 환경변수가 설정되지 않았습니다.");
  return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
}

/**
 * Cloudinary 서버 사이드 업로드
 * FormData에서 파일을 받아 Cloudinary에 업로드하고 URL을 반환합니다
 *
 * @param file - 업로드할 파일 객체
 * @param folder - Cloudinary 내 저장 폴더 경로 (예: 'family-blog/gallery')
 * @returns 업로드된 이미지의 공개 URL
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = "family-blog"
): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary 환경변수가 올바르게 설정되지 않았습니다.");
  }

  // 타임스탬프 생성 (서명에 필요)
  const timestamp = Math.round(Date.now() / 1000);

  // 서명 생성 (Node.js 환경에서 실행)
  const signature = await generateSignature({ folder, timestamp }, apiSecret);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Cloudinary 업로드 실패: ${error.error?.message ?? "알 수 없는 오류"}`);
  }

  const data = await response.json();
  return data.secure_url as string;
}

/**
 * Cloudinary 업로드 서명 생성
 * SHA-1 해시를 사용하여 보안 서명을 생성합니다
 */
async function generateSignature(
  params: Record<string, string | number>,
  apiSecret: string
): Promise<string> {
  // 파라미터를 알파벳 순으로 정렬하여 문자열 생성
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const message = `${sortedParams}${apiSecret}`;

  // Web Crypto API를 사용한 SHA-1 해시 생성
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Cloudinary URL에 이미지 변환 파라미터 적용
 *
 * @param url - 원본 Cloudinary URL
 * @param options - 변환 옵션
 * @returns 변환 파라미터가 적용된 URL
 */
export function transformCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "auto" | "webp" | "jpg" | "png";
  } = {}
): string {
  if (!url.includes("cloudinary.com")) return url;

  const { width, height, quality = 80, format = "auto" } = options;

  const transforms: string[] = [];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push(`q_${quality}`);
  transforms.push(`f_${format}`);

  // URL에서 /upload/ 부분에 변환 파라미터 삽입
  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
}
