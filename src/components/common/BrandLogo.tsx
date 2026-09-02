import React from 'react';
import buNgatminLogoImg from '../../assets/images/bu_ngatmin_logo_1787711070554.jpg';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { avatarSize: 'w-8 h-8', textSize: 'text-sm', subSize: 'text-[9px]' };
      case 'lg':
        return { avatarSize: 'w-14 h-14', textSize: 'text-xl', subSize: 'text-xs' };
      case 'xl':
        return { avatarSize: 'w-20 h-20', textSize: 'text-2xl', subSize: 'text-sm' };
      case 'md':
      default:
        return { avatarSize: 'w-10 h-10 sm:w-11 sm:h-11', textSize: 'text-base sm:text-lg', subSize: 'text-[10px] sm:text-xs' };
    }
  };

  const dims = getDimensions();

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Visual Mascot Badge: Ibu Ngatmin with Maroon Hijab & Thumbs-up (Original Image) */}
      <div className="relative shrink-0">
        <div
          className={`${dims.avatarSize} rounded-2xl bg-white border-2 border-[#F8E9EB] shadow-xs flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300 relative`}
        >
          <img
            src={buNgatminLogoImg}
            alt="Logo Perabotan Bu Ngatmin"
            className="w-full h-full object-cover"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Small verified / online mini-badge */}
        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#2E7D5B] text-white flex items-center justify-center text-[8px] sm:text-[9px] font-black shadow-xs ring-1 ring-white">
          ✓
        </span>
      </div>

      {/* Brand Typography for Perabotan Bu Ngatmin */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#8F1D2C] leading-none">
              PERABOTAN
            </span>
          </div>
          <span
            className={`${dims.textSize} font-black tracking-tight text-[#242424] leading-tight font-serif sm:font-sans whitespace-nowrap`}
          >
            Bu <span className="text-[#8F1D2C]">Ngatmin</span>
          </span>
        </div>
      )}
    </div>
  );
};

