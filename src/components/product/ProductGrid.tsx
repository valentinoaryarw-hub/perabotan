import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { PackageSearch, RotateCcw } from 'lucide-react';
import { navigateTo } from '../../utils/router';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onResetFilters?: () => void;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onResetFilters,
  emptyTitle = 'Produk tidak ditemukan',
  emptySubtitle = 'Coba ubah kata kunci pencarian atau sesuaikan filter kategori Anda.',
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-[#E7E7E7] overflow-hidden p-3 space-y-3 animate-pulse"
          >
            <div className="aspect-square bg-gray-200 rounded-xl w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded-md w-2/3 pt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#E7E7E7] p-8 sm:p-12 text-center max-w-md mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center mx-auto mb-4">
          <PackageSearch className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h3 className="text-lg font-bold text-[#242424] mb-2">{emptyTitle}</h3>
        <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mb-6">
          {emptySubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#8F1D2C] hover:bg-[#64121D] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Semua Filter
            </button>
          )}
          <button
            type="button"
            onClick={() => navigateTo('#/products')}
            className="inline-flex items-center justify-center px-4 py-2 bg-[#FAFAF9] hover:bg-[#E7E7E7] text-[#242424] rounded-xl text-xs font-semibold border border-[#E7E7E7] transition-colors"
          >
            Lihat Semua Produk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
