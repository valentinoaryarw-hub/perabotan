import React from 'react';

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
      {/* Visual Mascot Badge: Ibu Ngatmin with Maroon Hijab & Thumbs-up */}
      <div className="relative shrink-0">
        <div
          className={`${dims.avatarSize} rounded-2xl bg-gradient-to-br from-[#8F1D2C] via-[#731421] to-[#540D17] border-2 border-[#F8E9EB] shadow-sm flex items-center justify-center text-white overflow-hidden group-hover:scale-105 transition-transform duration-300 relative`}
        >
          {/* Detailed SVG Illustration matching "Bu Ngatmin" mascot */}
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Background Furniture Accent (Wardrobe / Cabinet) */}
            <rect x="62" y="16" width="28" height="48" rx="2" fill="#540D17" opacity="0.6" />
            <line x1="76" y1="16" x2="76" y2="64" stroke="#8F1D2C" strokeWidth="1" />
            <circle cx="73" cy="40" r="1.5" fill="#F8E9EB" />
            <circle cx="79" cy="40" r="1.5" fill="#F8E9EB" />

            {/* Hijab Silhouette (Maroon #8F1D2C) */}
            <path
              d="M50 12 C32 12 24 24 24 44 C24 64 30 84 50 88 C70 84 76 64 76 44 C76 24 68 12 50 12 Z"
              fill="#8F1D2C"
            />
            {/* Hijab folds & highlights */}
            <path
              d="M50 12 C40 12 32 20 30 35 C38 28 62 28 70 35 C68 20 60 12 50 12 Z"
              fill="#A62838"
            />

            {/* Face Oval */}
            <ellipse cx="50" cy="43" rx="17" ry="19" fill="#FDDEC7" />

            {/* Glasses */}
            <circle cx="43" cy="40" r="5.5" stroke="#4A2511" strokeWidth="1.8" fill="none" />
            <circle cx="57" cy="40" r="5.5" stroke="#4A2511" strokeWidth="1.8" fill="none" />
            <path d="M48.5 40 L51.5 40" stroke="#4A2511" strokeWidth="1.8" />

            {/* Smiling Eyes inside glasses */}
            <path
              d="M40 39 Q43 36 46 39"
              stroke="#4A2511"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M54 39 Q57 36 60 39"
              stroke="#4A2511"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />

            {/* Rosy Cheeks */}
            <circle cx="37" cy="46" r="3" fill="#F88C98" opacity="0.6" />
            <circle cx="63" cy="46" r="3" fill="#F88C98" opacity="0.6" />

            {/* Happy Smile */}
            <path
              d="M44 48 Q50 56 56 48"
              stroke="#64121D"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="#8F1D2C"
            />

            {/* Apron / Outfit */}
            <path
              d="M28 75 C34 68 66 68 72 75 L76 100 L24 100 Z"
              fill="#EFE8DC"
            />
            <path
              d="M38 72 L38 100 M62 72 L62 100"
              stroke="#D2C4AF"
              strokeWidth="1.5"
            />

            {/* Thumbs Up Hand on Left */}
            <g transform="translate(14, 46)">
              <circle cx="8" cy="14" r="7" fill="#FDDEC7" />
              {/* Thumb */}
              <path
                d="M8 8 C8 3 13 3 13 8 L13 14 L8 14 Z"
                fill="#FDDEC7"
                stroke="#64121D"
                strokeWidth="1.2"
              />
              <path
                d="M4 14 Q10 14 13 17"
                stroke="#64121D"
                strokeWidth="1.2"
                fill="none"
              />
            </g>

            {/* House Roof Accent on Top-Right */}
            <path
              d="M72 8 L80 15 L78 15 L78 22 L72 22 Z"
              fill="#F8E9EB"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Small thumbs up mini-badge */}
        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#2E7D5B] text-white flex items-center justify-center text-[9px] font-black shadow-xs ring-1 ring-white">
          ✓
        </span>
      </div>

      {/* Brand Typography matching "Perabotan Bu Ngatmin" */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#8F1D2C] leading-none">
              PERABOTAN
            </span>
          </div>
          <span
            className={`${dims.textSize} font-black tracking-tight text-[#242424] leading-tight font-serif sm:font-sans`}
          >
            Bu <span className="text-[#8F1D2C]">Ngatmin</span>
          </span>
          <span className={`${dims.subSize} text-[#667085] hidden sm:block -mt-0.5 font-medium`}>
            Pusat Perabot & Perlengkapan Rumah
          </span>
        </div>
      )}
    </div>
  );
};
