export const optimizeImageUrl = (url: string, width: number = 800): string => {
  if (!url) return getImagePlaceholder();
  
  // Firebase Storage URL인 경우
  if (url.includes('firebasestorage.googleapis.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}_${width}x`;
  }
  
  // Cloudinary URL인 경우
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},c_scale/`);
  }
  
  // 기타 URL의 경우: 지원하지 않는 이미지 소스는 placeholder로 대체
  // console.warn(`지원하지 않는 이미지 소스: ${url}`);
  return getImagePlaceholder();
};

export const getImagePlaceholder = (): string => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E`;
};