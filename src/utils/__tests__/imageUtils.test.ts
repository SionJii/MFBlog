import { optimizeImageUrl, getImagePlaceholder } from '../imageUtils';

describe('optimizeImageUrl', () => {
  it('should return placeholder for empty url', () => {
    expect(optimizeImageUrl('')).toBe(getImagePlaceholder());
  });

  it('should optimize Firebase Storage url', () => {
    const url = 'https://firebasestorage.googleapis.com/v0/b/test/o/image.png?alt=media';
    expect(optimizeImageUrl(url, 400)).toContain('_400x');
  });

  it('should optimize Cloudinary url', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    expect(optimizeImageUrl(url, 500)).toContain('/upload/w_500,c_scale/');
  });

  it('should return placeholder for unsupported url', () => {
    const url = 'https://example.com/image.png';
    expect(optimizeImageUrl(url)).toBe(getImagePlaceholder());
  });
});

describe('getImagePlaceholder', () => {
  it('should return a valid svg data url', () => {
    const placeholder = getImagePlaceholder();
    expect(placeholder).toContain('data:image/svg+xml');
  });
});
