import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const StarRating = ({ rating, reviewCount, showCount = true, size = 'default' }) => {
  // Rating değerini 0-5 arasında sınırlandır
  const clampedRating = Math.min(5, Math.max(0, rating));
  
  // Tam ve yarım yıldızları hesapla
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Yıldız boyutu (small veya default)
  const starSize = size === 'small' ? 14 : 18;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            <div className="flex">
              {/* Dolu yıldızlar */}
              {Array.from({ length: fullStars }).map((_, i) => (
                <Star 
                  key={`full-${i}`} 
                  className="text-yellow-400 fill-yellow-400" 
                  size={starSize} 
                />
              ))}
              
              {/* Yarım yıldız (varsa) */}
              {hasHalfStar && (
                <StarHalf 
                  className="text-yellow-400 fill-yellow-400" 
                  size={starSize} 
                />
              )}
              
              {/* Boş yıldızlar */}
              {Array.from({ length: emptyStars }).map((_, i) => (
                <Star 
                  key={`empty-${i}`} 
                  className="text-gray-300" 
                  size={starSize} 
                />
              ))}
            </div>
            
            {/* Değerlendirme sayısı */}
            {showCount && reviewCount !== undefined && (
              <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-medium">{clampedRating.toFixed(1)} / 5</p>
            <p className="text-xs text-gray-500">{reviewCount} değerlendirme</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StarRating;