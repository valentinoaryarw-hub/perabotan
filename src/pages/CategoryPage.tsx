import React from 'react';
import { CATEGORIES } from '../data/categories';
import { useProducts } from '../context/ProductContext';
import { ProductGrid } from '../components/product/ProductGrid';
import { ChevronRight, ArrowLeft, Layers } from 'lucide-react';
import { navigateTo } from '../utils/router';

interface CategoryPageProps {
  categorySlug: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug }) => {
  const { products } = useProducts();
  const currentCategory = CATEGORIES.find((c) => c.slug === categorySlug) || {
    id: categorySlug,
    slug: categorySlug,
    name: 'Kategori Perabot',
    description: 'Koleksi perabot rumah tangga pilihan RumaRasa.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    productCount: 0,
    iconName: 'Layers',
  };

  const categoryProducts = products.filter((p) => p.category === categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#667085]">
        <a href="#/" className="hover:text-[#8F1D2C]">Home</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <a href="#/products" className="hover:text-[#8F1D2C]">Kategori</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#242424] font-semibold">{currentCategory.name}</span>
      </div>

      {/* Category Hero Banner */}
      <div className="relative bg-[#F8E9EB] rounded-3xl border border-[#8F1D2C]/15 p-6 sm:p-10 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="text-[11px] font-bold text-[#8F1D2C] uppercase tracking-wider bg-white px-2.5 py-1 rounded-md">
              Koleksi Ruangan
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#242424] tracking-tight">
              {currentCategory.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed max-w-xl">
              {currentCategory.description}
            </p>
            <div className="text-xs text-[#8F1D2C] font-semibold pt-1">
              Menampilkan {categoryProducts.length} produk siap pesan
            </div>
          </div>
          <div className="md:col-span-4 aspect-video md:aspect-4/3 rounded-2xl overflow-hidden shadow-md">
            <img
              src={currentCategory.image}
              alt={currentCategory.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Other Category Quick Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={cat.slug === 'all' ? '#/products' : `#/category/${cat.slug}`}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              cat.slug === categorySlug
                ? 'bg-[#8F1D2C] text-white shadow-xs'
                : 'bg-white text-[#242424] hover:bg-[#F8E9EB] border border-[#E7E7E7]'
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={categoryProducts}
        emptyTitle={`Belum ada produk di kategori ${currentCategory.name}`}
        emptySubtitle="Silakan cek kategori perabot lainnya atau hubungi kami via WhatsApp untuk custom order."
      />
    </div>
  );
};
