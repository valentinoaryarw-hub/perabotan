import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../data/categories';
import { FilterState, Product } from '../types';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilter } from '../components/product/ProductFilter';

interface CatalogPageProps {
  initialSearch?: string;
  initialCategory?: string;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  initialSearch = '',
  initialCategory = '',
}) => {
  const { products } = useProducts();
  const [filterState, setFilterState] = useState<FilterState>({
    search: initialSearch,
    categories: initialCategory ? [initialCategory] : [],
    minPrice: 0,
    maxPrice: 1500000,
    inStockOnly: false,
    minRating: 0,
    sortBy: 'terbaru',
  });

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Sync with prop changes if navigation occurs
  useEffect(() => {
    if (initialSearch !== undefined) {
      setFilterState((prev) => ({ ...prev, search: initialSearch }));
    }
  }, [initialSearch]);

  useEffect(() => {
    if (initialCategory) {
      setFilterState((prev) => ({ ...prev, categories: [initialCategory] }));
    }
  }, [initialCategory]);

  const handleResetFilters = () => {
    setFilterState({
      search: '',
      categories: [],
      minPrice: 0,
      maxPrice: 1000000,
      inStockOnly: false,
      minRating: 0,
      sortBy: 'terbaru',
    });
  };

  const handleCategoryChipClick = (slug: string) => {
    if (slug === 'all') {
      setFilterState((prev) => ({ ...prev, categories: [] }));
    } else {
      setFilterState((prev) => {
        const exists = prev.categories.includes(slug);
        return {
          ...prev,
          categories: exists
            ? prev.categories.filter((c) => c !== slug)
            : [...prev.categories, slug],
        };
      });
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query
    if (filterState.search.trim()) {
      const q = filterState.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.specifications.material.toLowerCase().includes(q)
      );
    }

    // 2. Categories
    if (filterState.categories.length > 0) {
      result = result.filter((p) => filterState.categories.includes(p.category));
    }

    // 3. Price
    result = result.filter((p) => {
      const effectivePrice = p.discountPrice || p.price;
      return (
        effectivePrice >= filterState.minPrice &&
        effectivePrice <= filterState.maxPrice
      );
    });

    // 4. In Stock
    if (filterState.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // 5. Rating
    if (filterState.minRating > 0) {
      result = result.filter((p) => p.rating >= filterState.minRating);
    }

    // 6. Sort
    switch (filterState.sortBy) {
      case 'terlaris':
        result.sort((a, b) => b.soldCount - a.soldCount);
        break;
      case 'harga-terendah':
        result.sort(
          (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)
        );
        break;
      case 'harga-tertinggi':
        result.sort(
          (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)
        );
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'terbaru':
      default:
        // default list order
        break;
    }

    return result;
  }, [products, filterState]);

  const activeFiltersCount =
    (filterState.search ? 1 : 0) +
    filterState.categories.length +
    (filterState.maxPrice < 1500000 ? 1 : 0) +
    (filterState.inStockOnly ? 1 : 0) +
    (filterState.minRating > 0 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-[#667085] mb-1">
          <a href="#/" className="hover:text-[#8F1D2C]">Home</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#242424] font-medium">Katalog Perabot</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242424] tracking-tight">
          Katalog Perabot & Home Living
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Menampilkan {filteredProducts.length} produk pilihan berkualitas untuk rumah Anda.
        </p>
      </div>

      {/* Search and Category Quick Chips */}
      <div className="space-y-3 bg-white p-4 sm:p-5 rounded-3xl border border-[#E7E7E7] shadow-xs">
        {/* Search Bar Input */}
        <div className="relative">
          <input
            type="text"
            value={filterState.search}
            onChange={(e) =>
              setFilterState((prev) => ({ ...prev, search: e.target.value }))
            }
            placeholder="Cari perabotan yang kamu butuhkan (meja, rak, kursi, storage)..."
            className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-2xl pl-11 pr-10 py-3 text-sm text-[#242424] placeholder-[#667085] focus:outline-hidden focus:border-[#8F1D2C] focus:bg-white focus:ring-2 focus:ring-[#8F1D2C]/10 transition-all"
          />
          <Search className="w-5 h-5 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {filterState.search && (
            <button
              type="button"
              onClick={() => setFilterState((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#242424]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Horizontal Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          <button
            type="button"
            onClick={() => handleCategoryChipClick('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filterState.categories.length === 0
                ? 'bg-[#8F1D2C] text-white shadow-xs'
                : 'bg-[#FAFAF9] text-[#242424] hover:bg-[#F8E9EB] border border-[#E7E7E7]'
            }`}
          >
            Semua
          </button>
          {CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => {
            const isSelected = filterState.categories.includes(cat.slug);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChipClick(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#8F1D2C] text-white shadow-xs'
                    : 'bg-[#FAFAF9] text-[#242424] hover:bg-[#F8E9EB] border border-[#E7E7E7]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Catalog Body (Sidebar + Grid) */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Filter Sidebar (Desktop) + Mobile Drawer */}
        <ProductFilter
          filterState={filterState}
          setFilterState={setFilterState}
          onReset={handleResetFilters}
          isMobileDrawerOpen={isMobileDrawerOpen}
          setIsMobileDrawerOpen={setIsMobileDrawerOpen}
        />

        {/* Right Content Area */}
        <div className="flex-1 space-y-4">
          {/* Controls Bar: Mobile Filter Button, Result Count, Sort Dropdown */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E7E7E7] shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAFAF9] hover:bg-[#F8E9EB] text-[#242424] border border-[#E7E7E7] rounded-xl text-xs font-semibold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8F1D2C]" />
              <span>Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* Total Results */}
            <div className="text-xs text-[#667085]">
              Menampilkan <strong className="text-[#242424]">{filteredProducts.length}</strong> produk
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#667085] hidden sm:inline">Urutkan:</span>
              <select
                value={filterState.sortBy}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    sortBy: e.target.value as FilterState['sortBy'],
                  }))
                }
                className="bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#242424] focus:outline-hidden focus:border-[#8F1D2C]"
              >
                <option value="terbaru">Terbaru</option>
                <option value="terlaris">Terlaris (Paling Banyak Terjual)</option>
                <option value="harga-terendah">Harga Terendah → Tertinggi</option>
                <option value="harga-tertinggi">Harga Tertinggi → Terendah</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Active Filter Tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[#667085] text-[11px]">Filter Aktif:</span>
              {filterState.search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8E9EB] text-[#8F1D2C] rounded-lg text-xs font-medium">
                  Cari: "{filterState.search}"
                  <button
                    type="button"
                    onClick={() => setFilterState((p) => ({ ...p, search: '' }))}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterState.categories.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8E9EB] text-[#8F1D2C] rounded-lg text-xs font-medium"
                >
                  {CATEGORIES.find((cat) => cat.slug === c)?.name || c}
                  <button
                    type="button"
                    onClick={() => handleCategoryChipClick(c)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filterState.maxPrice < 1000000 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8E9EB] text-[#8F1D2C] rounded-lg text-xs font-medium">
                  Maks Rp {filterState.maxPrice.toLocaleString('id-ID')}
                  <button
                    type="button"
                    onClick={() => setFilterState((p) => ({ ...p, maxPrice: 1000000 }))}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterState.inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8E9EB] text-[#8F1D2C] rounded-lg text-xs font-medium">
                  Stok Tersedia Saja
                  <button
                    type="button"
                    onClick={() => setFilterState((p) => ({ ...p, inStockOnly: false }))}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterState.minRating > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8E9EB] text-[#8F1D2C] rounded-lg text-xs font-medium">
                  Rating {filterState.minRating}+
                  <button
                    type="button"
                    onClick={() => setFilterState((p) => ({ ...p, minRating: 0 }))}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-semibold text-[#8F1D2C] hover:underline ml-1"
              >
                Reset Semua
              </button>
            </div>
          )}

          {/* Product Grid Component */}
          <ProductGrid
            products={filteredProducts}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
};
