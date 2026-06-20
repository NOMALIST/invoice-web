// 갤러리(앨범 및 사진) 관련 타입 정의

/** 갤러리 앨범 */
export interface Album {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string | null;
  /** 촬영/앨범 날짜 (ISO 문자열) */
  date: string | null;
  published: boolean;
  /** 앨범에 속한 사진 수 (목록 조회 시) */
  photoCount?: number;
}

/** 갤러리 사진 */
export interface Photo {
  id: string;
  title: string;
  /** 연결된 앨범 ID */
  albumId: string;
  /** Cloudinary 또는 외부 이미지 URL */
  imageUrl: string;
  /** 촬영 날짜 (ISO 문자열) */
  takenAt: string | null;
  /** 앨범 내 정렬 순서 */
  order: number;
}
