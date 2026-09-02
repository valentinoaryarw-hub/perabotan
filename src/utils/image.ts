/**
 * Image Optimization Utilities
 * Optimizes image URLs (e.g. Unsplash dynamic format & resizing)
 * to minimize network payload while preserving crisp visual presentation.
 */

export interface OptimizeImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
}

/**
 * Optimizes an image URL for specific dimensions and quality settings.
 * For Unsplash images, dynamically adjusts query parameters to deliver WebP/AVIF
 * and exact pixel dimensions rather than full-resolution 4K/8K source files.
 */
export function getOptimizedImageUrl(
  src: string | undefined,
  options: OptimizeImageOptions = {}
): string {
  if (!src) return '';

  const { width = 400, quality = 75, format = 'auto' } = options;

  // Unsplash dynamic image parameters optimization
  if (src.includes('images.unsplash.com')) {
    try {
      const url = new URL(src);
      url.searchParams.set('auto', format);
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('w', width.toString());
      url.searchParams.set('q', quality.toString());
      if (options.height) {
        url.searchParams.set('h', options.height.toString());
      }
      return url.toString();
    } catch {
      // Fallback regex replacement if URL constructor fails
      let optimized = src;
      if (optimized.includes('w=')) {
        optimized = optimized.replace(/w=\d+/, `w=${width}`);
      } else {
        optimized += `&w=${width}`;
      }
      if (optimized.includes('q=')) {
        optimized = optimized.replace(/q=\d+/, `q=${quality}`);
      } else {
        optimized += `&q=${quality}`;
      }
      if (!optimized.includes('auto=')) {
        optimized += `&auto=${format}`;
      }
      return optimized;
    }
  }

  return src;
}
