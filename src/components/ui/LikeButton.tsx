import React from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useLike } from '../../hooks/useLike';

interface LikeButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
  onLikeChange?: (isLiked: boolean, likeCount: number) => void;
}

export function LikeButton({ 
  productId, 
  size = 'md', 
  showCount = true, 
  className = '',
  onLikeChange
}: LikeButtonProps) {
  const { isLiked, likeCount, loading, toggling, toggleLike } = useLike(productId);

  const handleToggleLike = async () => {
    try {
      await toggleLike();
      if (onLikeChange) {
        onLikeChange(!isLiked, likeCount + (isLiked ? -1 : 1));
      }
    } catch (error) {
      console.error('Failed to update favorites:', error);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <Loader2 className={`${iconSizes[size]} animate-spin text-gray-400`} />
      </div>
    );
  }

  return (
    <button
      onClick={handleToggleLike}
      disabled={toggling}
      className={`
        ${sizeClasses[size]} 
        ${className}
        rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
        transition-colors duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center space-x-1
      `}
      title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
    >
      {toggling ? (
        <Loader2 className={`${iconSizes[size]} animate-spin text-gray-400`} />
      ) : (
        <Heart 
          className={`
            ${iconSizes[size]} 
            ${isLiked 
              ? 'text-red-500 fill-red-500' 
              : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
            }
            transition-colors duration-200
          `} 
        />
      )}
      
      {showCount && (
        <span className={`
          text-sm font-medium 
          ${isLiked 
            ? 'text-red-500' 
            : 'text-gray-500 dark:text-gray-400'
          }
        `}>
          {likeCount}
        </span>
      )}
    </button>
  );
}