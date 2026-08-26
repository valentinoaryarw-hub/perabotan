import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  MessageCircle,
  Package,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../data/categories';
import { FilterState } from '../types';
import { ProductGrid } from '../components/product/ProductGrid';

export const HomePage: React.FC = () => {
  const { products } = useProducts();

  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    categories: [],
    minPrice: 0,
    maxPrice: 1500000,
    inStockOnly: false,
    minRating: 0,
    sortBy: 'terbaru',
  });

  const handleCategoryClick = (slug: string) => {
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

  const handleResetFilters = () => {
    setFilterState({
      search: '',
      categories: [],
      minPrice: 0,
      maxPrice: 1500000,
      inStockOnly: false,
      minRating: 0,
      sortBy: 'terbaru',
    });
  };

  // Filter & Sort
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

    // 3. In Stock Only
    if (filterState.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // 4. Sort
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
        break;
    }

    return result;
  }, [products, filterState]);

  const activeCategoryName =
    filterState.categories.length === 1
      ? CATEGORIES.find((c) => c.slug === filterState.categories[0])?.name
      : null;

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 space-y-6">
      {/* 1. COMPACT STORE INTRO & SEARCH BAR */}
      <div className="bg-white rounded-3xl border border-[#E7E7E7] p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F8E9EB] text-[#8F1D2C] text-[11px] font-bold tracking-wide uppercase mb-1">
              <Sparkles className="w-3 h-3" />
              TOKO PERABOTAN BU NGATMIN
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#242424] tracking-tight">
              Pilihan Perabot Kecil & Perlengkapan Rumah Tangga
            </h1>
            <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
              Panci, gayung, piring, sendok, sapu ijuk/lidi, pengki, ember, baskom, toples, dan kebutuhan harian dapur.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs text-[#2E7D5B] bg-[#F8FAF9] px-3 py-1.5 rounded-xl border border-[#E7E7E7]">
            <span className="w-2 h-2 rounded-full bg-[#2E7D5B] animate-pulse"></span>
            <span>Bu Ngatmin Online • Siap Diskusi</span>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <input
            type="text"
            value={filterState.search}
            onChange={(e) =>
              setFilterState((prev) => ({ ...prev, search: e.target.value }))
            }
            placeholder="Cari panci, gayung, piring, sendok, sapu lidi, pengki, ember, baskom, toples..."
            className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-2xl pl-11 pr-10 py-3 text-sm text-[#242424] placeholder-[#667085] focus:outline-hidden focus:border-[#8F1D2C] focus:bg-white focus:ring-2 focus:ring-[#8F1D2C]/10 transition-all shadow-2xs"
            id="home-search-input"
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

        {/* 2. CATEGORY FILTER CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-3.5 no-scrollbar">
          <button
            type="button"
            onClick={() => handleCategoryClick('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterState.categories.length === 0
                ? 'bg-[#8F1D2C] text-white shadow-xs'
                : 'bg-[#FAFAF9] text-[#242424] hover:bg-[#F8E9EB] border border-[#E7E7E7]'
            }`}
          >
            Semua Produk ({products.length})
          </button>
          {CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => {
            const isSelected = filterState.categories.includes(cat.slug);
            const count = products.filter((p) => p.category === cat.slug).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#8F1D2C] text-white shadow-xs'
                    : 'bg-[#FAFAF9] text-[#242424] hover:bg-[#F8E9EB] border border-[#E7E7E7]'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#E7E7E7] text-[#667085]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CATALOG CONTROLS BAR (Count, Sort, In-Stock) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E7E7E7] shadow-xs">
        <div className="text-xs text-[#667085] flex items-center gap-2">
          <span>
            Menampilkan <strong className="text-[#242424]">{filteredProducts.length}</strong> produk
            {activeCategoryName && <span> dalam kategori <strong>{activeCategoryName}</strong></span>}
            {filterState.search && <span> untuk "<strong>{filterState.search}</strong>"</span>}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* In stock toggle */}
          <label className="inline-flex items-center gap-2 text-xs text-[#242424] cursor-pointer">
            <input
              type="checkbox"
              checked={filterState.inStockOnly}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, inStockOnly: e.target.checked }))
              }
              className="w-4 h-4 rounded text-[#8F1D2C] accent-[#8F1D2C] focus:ring-0"
            />
            <span>Stok Ready Saja</span>
          </label>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
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
              <option value="terlaris">Terlaris</option>
              <option value="harga-terendah">Harga Terendah</option>
              <option value="harga-tertinggi">Harga Tertinggi</option>
              <option value="rating">Rating Tertinggi</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. PRODUCT GRID */}
      <ProductGrid
        products={filteredProducts}
        onResetFilters={handleResetFilters}
        columnsDesktop="sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      />
    </div>
  );
};
