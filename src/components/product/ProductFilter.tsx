import React from 'react';
import {
  RotateCcw,
  SlidersHorizontal,
  Star,
  Check,
  ChevronDown,
  X,
} from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { FilterState } from '../../types';
import { formatRupiah } from '../../utils/currency';

interface ProductFilterProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  isMobileDrawerOpen?: boolean;
  setIsMobileDrawerOpen?: (open: boolean) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filterState,
  setFilterState,
  onReset,
  isMobileDrawerOpen = false,
  setIsMobileDrawerOpen,
}) => {
  const handleCategoryToggle = (slug: string) => {
    setFilterState((prev) => {
      if (slug === 'all') {
        return { ...prev, categories: [] };
      }
      const exists = prev.categories.includes(slug);
      let updated: string[];
      if (exists) {
        updated = prev.categories.filter((c) => c !== slug);
      } else {
        updated = [...prev.categories, slug];
      }
      return { ...prev, categories: updated };
    });
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    setFilterState((prev) => ({ ...prev, sortBy }));
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Category Section */}
      <div>
        <h4 className="text-xs font-bold text-[#242424] uppercase tracking-wider mb-3">
          Kategori Perabot
        </h4>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => handleCategoryToggle('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
              filterState.categories.length === 0
                ? 'bg-[#8F1D2C] text-white font-semibold shadow-xs'
                : 'text-[#242424] hover:bg-[#F8E9EB]/70'
            }`}
          >
            <span>Semua Kategori</span>
            <span className="text-[10px] opacity-80">24 item</span>
          </button>

          {CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => {
            const isSelected = filterState.categories.includes(cat.slug);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryToggle(cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-[#8F1D2C] text-white font-semibold shadow-xs'
                    : 'text-[#242424] hover:bg-[#F8E9EB]/70'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                      isSelected
                        ? 'bg-white border-white text-[#8F1D2C]'
                        : 'border-[#E7E7E7] bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{cat.name}</span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-white/20 text-white' : 'text-[#667085] bg-[#FAFAF9]'
                  }`}
                >
                  {cat.productCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider / Inputs */}
      <div className="pt-4 border-t border-[#E7E7E7]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
            Rentang Harga (Rp)
          </h4>
          <span className="text-[11px] font-semibold text-[#8F1D2C]">
            Max {formatRupiah(filterState.maxPrice)}
          </span>
        </div>

        <input
          type="range"
          min="50000"
          max="1000000"
          step="25000"
          value={filterState.maxPrice}
          onChange={(e) =>
            setFilterState((prev) => ({
              ...prev,
              maxPrice: Number(e.target.value),
            }))
          }
          className="w-full h-2 bg-[#E7E7E7] rounded-lg appearance-none cursor-pointer accent-[#8F1D2C]"
        />

        <div className="flex items-center justify-between text-[11px] text-[#667085] mt-2">
          <span>Rp 50.000</span>
          <span>Rp 1.000.000+</span>
        </div>
      </div>

      {/* Availability / In Stock */}
      <div className="pt-4 border-t border-[#E7E7E7]">
        <h4 className="text-xs font-bold text-[#242424] uppercase tracking-wider mb-2.5">
          Ketersediaan
        </h4>
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-[#242424] select-none">
          <input
            type="checkbox"
            checked={filterState.inStockOnly}
            onChange={(e) =>
              setFilterState((prev) => ({
                ...prev,
                inStockOnly: e.target.checked,
              }))
            }
            className="w-4 h-4 rounded text-[#8F1D2C] focus:ring-[#8F1D2C] accent-[#8F1D2C]"
          />
          <span>Hanya Tampilkan Stok Tersedia</span>
        </label>
      </div>

      {/* Rating Filter */}
      <div className="pt-4 border-t border-[#E7E7E7]">
        <h4 className="text-xs font-bold text-[#242424] uppercase tracking-wider mb-2.5">
          Rating Minimum
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {[0, 4, 4.5, 4.8].map((rating) => {
            const isSelected = filterState.minRating === rating;
            return (
              <button
                key={rating}
                type="button"
                onClick={() =>
                  setFilterState((prev) => ({ ...prev, minRating: rating }))
                }
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-[#8F1D2C] text-white border-[#8F1D2C]'
                    : 'bg-[#FAFAF9] text-[#242424] border-[#E7E7E7] hover:border-gray-400'
                }`}
              >
                {rating === 0 ? (
                  'Semua'
                ) : (
                  <>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{rating}+</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Button */}
      <div className="pt-4 border-t border-[#E7E7E7]">
        <button
          type="button"
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#FAFAF9] hover:bg-[#F8E9EB] text-[#667085] hover:text-[#8F1D2C] rounded-xl text-xs font-semibold border border-[#E7E7E7] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Semua Filter
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Filter */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white rounded-3xl border border-[#E7E7E7] p-5 shadow-xs h-fit sticky top-24">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#E7E7E7]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#8F1D2C]" />
            <h3 className="text-sm font-bold text-[#242424]">Filter Produk</h3>
          </div>
          {(filterState.categories.length > 0 ||
            filterState.maxPrice < 1000000 ||
            filterState.inStockOnly ||
            filterState.minRating > 0) && (
            <span className="w-2 h-2 rounded-full bg-[#8F1D2C]" title="Filter aktif" />
          )}
        </div>
        {filterContent}
      </aside>

      {/* Mobile Drawer Filter Modal */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E7E7E7]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#8F1D2C]" />
                  <h3 className="text-sm font-bold text-[#242424]">Filter Produk</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen?.(false)}
                  className="p-1.5 text-[#667085] hover:text-[#242424] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterContent}
            </div>

            <div className="pt-6 mt-6 border-t border-[#E7E7E7]">
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen?.(false)}
                className="w-full bg-[#8F1D2C] text-white py-2.5 rounded-xl text-xs font-semibold shadow-xs"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
