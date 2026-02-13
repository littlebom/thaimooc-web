"use client";

import Image from "next/image";
import { ImageProps } from "next/image";
import { useState } from "react";
import { useDefaultImages } from "@/hooks/use-default-images";

// Helper function to check if a string is a valid image URL
const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
};

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallbackType?: 'course' | 'institution' | 'news' | 'instructor';
}

// Wrapper component that safely handles image URLs with fallback support
export function SafeImage({
  src,
  alt,
  fill,
  className,
  priority,
  fallbackType,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const { defaultImages } = useDefaultImages();

  // Filter out Next.js Image-specific props for HTML img tag
  const { loading, quality, placeholder, blurDataURL, ...htmlProps } = props as any;

  // Get fallback image based on type
  const getFallbackSrc = () => {
    if (fallbackType === 'course') {
      return defaultImages.defaultCourseThumbnail || `https://placehold.co/900x506?text=${encodeURIComponent('Course')}`;
    }
    if (fallbackType === 'institution') {
      return defaultImages.defaultInstitutionLogo || `https://placehold.co/400x400?text=${encodeURIComponent('Institution')}`;
    }
    if (fallbackType === 'news') {
      return defaultImages.defaultNewsImage || `https://placehold.co/900x506?text=${encodeURIComponent('News')}`;
    }
    if (fallbackType === 'instructor') {
      return defaultImages.defaultInstitutionLogo || `https://placehold.co/400x400?text=${encodeURIComponent('Instructor')}`;
    }
    return `https://placehold.co/600x400?text=${encodeURIComponent(alt || 'Image')}`;
  };

  // Determine which image source to use
  const imageSrc = error || !isValidImageUrl(src as string) ? getFallbackSrc() : (src as string);
  const isUploadedImage = imageSrc.startsWith('/uploads/');

  // Use plain <img> tag for uploaded images to avoid Next.js optimization issues
  if (isUploadedImage) {
    if (fill) {
      return (
        <img
          src={imageSrc}
          alt={alt}
          className={`${className || ''} absolute inset-0 w-full h-full object-cover`}
          onError={() => setError(true)}
          {...htmlProps}
        />
      );
    }
    return (
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        onError={() => setError(true)}
        {...htmlProps}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      className={className}
      priority={priority}
      onError={() => setError(true)}
      {...props}
    />
  );
}
