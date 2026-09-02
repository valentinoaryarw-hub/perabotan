import React, { useState } from 'react';
import { getOptimizedImageUrl } from '../../utils/image';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  widthParam?: number;
  heightParam?: number;
  qualityParam?: number;
  priority?: boolean;
  fallbackSrc?: string;
  containerClassName?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  widthParam = 400,
  heightParam,
  qualityParam = 75,
  priority = false,
  fallbackSrc = 'https://images.unsplash.com/photo-1584990347449-39908cfd0c5a?auto=format&fit=crop&w=400&q=75',
  className = '',
  containerClassName = '',
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const optimizedSrc = getOptimizedImageUrl(hasError ? fallbackSrc : src, {
    width: widthParam,
    height: heightParam,
    quality: qualityParam,
  });

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setIsLoaded(true)}
      onError={() => {
        if (!hasError) setHasError(true);
      }}
      className={`${className} transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-90'
      }`}
      {...rest}
    />
  );
};
