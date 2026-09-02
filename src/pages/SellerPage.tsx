import React, { useState } from 'react';
import {
  Store,
  MessageCircle,
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  ExternalLink,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  TrendingUp,
  Lock,
  KeyRound,
  ShieldAlert,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { CATEGORIES } from '../data/categories';
import { formatRupiah } from '../utils/currency';
import { navigateTo } from '../utils/router';
import { OptimizedImage } from '../components/common/OptimizedImage';

export const SellerPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, resetToDefaultProducts } = useProducts();
  const { conversations, setActiveConversationId, unreadCountForSeller } = useChat();
  const { setActiveRole } = useAuth();

  // Admin PIN Protection (PIN: 110203)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('bu_ngatmin_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState<'chats' | 'products' | 'store'>('chats');
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '110203') {
      sessionStorage.setItem('bu_ngatmin_admin_auth', 'true');
      setIsAuthenticated(true);
      setActiveRole('seller');
      setPinError('');
    } else {
      setPinError('PIN salah! Akses khusus untuk pemilik Toko Bu Ngatmin.');
      setPinInput('');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('bu_ngatmin_admin_auth');
    setIsAuthenticated(false);
    setActiveRole('customer');
    navigateTo('#/');
  };

  // If not authenticated, show PIN Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#E7E7E7] p-6 sm:p-8 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAFAF9] border border-[#E7E7E7] text-[#667085] text-[11px] font-bold uppercase tracking-wider">
              <KeyRound className="w-3 h-3 text-[#8F1D2C]" />
              Akses Khusus Pemilik
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#242424]">
              Panel Pengelola Toko
            </h1>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Halaman ini bersifat privat dan hanya dapat diakses oleh pemilik Toko Perabot Bu Ngatmin.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-[#242424] mb-1.5">
                Masukkan PIN Keamanan Admin:
              </label>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (pinError) setPinError('');
                }}
                placeholder="••••"
                autoFocus
                className="w-full text-center tracking-[0.5em] text-lg font-mono px-4 py-3 bg-[#FAFAF9] border border-[#E7E7E7] rounded-2xl text-[#242424] focus:outline-hidden focus:border-[#8F1D2C] focus:bg-white focus:ring-2 focus:ring-[#8F1D2C]/10 transition-all font-bold"
              />
              {pinError && (
                <p className="text-[11px] text-[#8F1D2C] font-semibold mt-1.5 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#8F1D2C] hover:bg-[#64121D] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>Buka Panel Pengelola</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('#/')}
              className="w-full py-2.5 bg-transparent hover:bg-gray-100 text-[#667085] hover:text-[#242424] rounded-2xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda Belanja</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Form states for Add/Edit product
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('storage');
  const [formPrice, setFormPrice] = useState<number>(250000);
  const [formDiscountPrice, setFormDiscountPrice] = useState<number | ''>('');
  const [formStock, setFormStock] = useState<number>(20);
  const [formImage, setFormImage] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formMaterial, setFormMaterial] = useState('');
  const [formDimensions, setFormDimensions] = useState('');

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormDiscountPrice(p.discountPrice || '');
    setFormStock(p.stock);
    setFormImage(p.images[0] || '');
    setFormShortDesc(p.shortDescription);
    setFormMaterial(p.specifications.material);
    setFormDimensions(p.specifications.dimensions);
    setIsAddModalOpen(true);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('storage');
    setFormPrice(250000);
    setFormDiscountPrice('');
    setFormStock(20);
    setFormImage('https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80');
    setFormShortDesc('Perabot berkualitas dengan desain modern minimalis.');
    setFormMaterial('Kayu Olahan MDF & Besi Powder Coated');
    setFormDimensions('60 × 30 × 120 cm');
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const catObj = CATEGORIES.find((c) => c.slug === formCategory);

    const productPayload = {
      slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: formName,
      category: formCategory,
      categoryName: catObj ? catObj.name : 'Perabot',
      price: Number(formPrice),
      discountPrice: formDiscountPrice ? Number(formDiscountPrice) : undefined,
      images: [formImage || 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80'],
      shortDescription: formShortDesc,
      description: formShortDesc,
      specifications: {
        material: formMaterial || 'Kayu Olahan Berkualitas',
        dimensions: formDimensions || 'Standar Ruangan',
        weight: '5 kg',
        color: 'Natural Wood',
        assemblyRequired: true,
      },
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      soldCount: editingProduct ? editingProduct.soldCount : 0,
      stock: Number(formStock),
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsAddModalOpen(false);
    setEditingProduct(null);
  };

  const handleOpenChat = (conversationId: string) => {
    setActiveRole('seller');
    setActiveConversationId(conversationId);
    navigateTo('#/chat');
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-[#E7E7E7] p-5 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#8F1D2C] text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F8E9EB] text-[#8F1D2C] text-[11px] font-bold uppercase tracking-wider mb-1">
              DASHBOARD PENJUAL UMKM
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#242424]">
              Toko Perabotan Bu Ngatmin
            </h1>
            <p className="text-xs sm:text-sm text-[#667085]">
              Kelola pesan masuk dari calon pembeli dan perbarui data katalog perabotan Anda.
            </p>
          </div>
        </div>

        {/* Quick Tab Switcher & Logout */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#FAFAF9] p-1.5 rounded-2xl border border-[#E7E7E7]">
            <button
              type="button"
              onClick={() => setActiveTab('chats')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'chats'
                  ? 'bg-[#8F1D2C] text-white shadow-xs'
                  : 'text-[#242424] hover:text-[#8F1D2C]'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pesan Masuk ({conversations.length})</span>
              {unreadCountForSeller > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#8F1D2C] text-white shadow-xs'
                  : 'text-[#242424] hover:text-[#8F1D2C]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Katalog Produk ({products.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdminLogout}
            className="px-3.5 py-2.5 rounded-2xl text-xs font-bold text-[#667085] hover:text-[#8F1D2C] hover:bg-[#F8E9EB] bg-[#FAFAF9] border border-[#E7E7E7] transition-all flex items-center gap-1.5 cursor-pointer"
            title="Kunci Panel Admin & Keluar"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Kunci Admin</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CHATS / PESAN MASUK */}
      {activeTab === 'chats' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#242424]">
              Daftar Diskusi Pembeli ({conversations.length})
            </h2>
            <button
              type="button"
              onClick={() => {
                setActiveRole('seller');
                navigateTo('#/chat');
              }}
              className="text-xs font-bold text-[#8F1D2C] hover:underline flex items-center gap-1"
            >
              <span>Buka Ruang Chat Lengkap</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#E7E7E7] shadow-xs divide-y divide-[#E7E7E7] overflow-hidden">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#667085]">
                Belum ada pesan masuk dari pembeli.
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-4 sm:p-5 hover:bg-[#FAFAF9] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <img
                      src={
                        conv.customerAvatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.customerUsername}`
                      }
                      alt=""
                      className="w-12 h-12 rounded-2xl object-cover border border-[#E7E7E7] bg-white shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-[#242424]">
                          {conv.customerName}
                        </h4>
                        <span className="text-xs text-[#667085]">
                          {conv.customerUsername}
                        </span>
                        {conv.unreadBySeller > 0 && (
                          <span className="px-2 py-0.5 bg-[#8F1D2C] text-white text-[10px] font-bold rounded-full">
                            Pesan Baru
                          </span>
                        )}
                      </div>

                      {conv.productSnapshot && (
                        <div className="flex items-center gap-2 text-xs text-[#8F1D2C] font-semibold mb-1">
                          <Package className="w-3.5 h-3.5" />
                          <span>Membahas: {conv.productSnapshot.name}</span>
                          <span className="text-[#667085]">
                            ({formatRupiah(conv.productSnapshot.discountPrice || conv.productSnapshot.price)})
                          </span>
                        </div>
                      )}

                      <p className="text-xs text-[#667085] line-clamp-1">
                        "{conv.lastMessage}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <span className="text-[11px] text-[#667085] mr-2">
                      {new Date(conv.lastMessageTimestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenChat(conv.id)}
                      className="px-4 py-2 bg-[#8F1D2C] hover:bg-[#64121D] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Balas Chat</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#242424]">
                Kelola Koleksi Produk ({products.length})
              </h2>
              <p className="text-xs text-[#667085]">
                Tambah produk baru atau ubah harga & stok perabot Anda.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openAddModal}
                className="px-4 py-2.5 bg-[#8F1D2C] hover:bg-[#64121D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Produk</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Cari perabot dalam katalog..."
              className="w-full bg-white border border-[#E7E7E7] rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#242424] focus:outline-hidden focus:border-[#8F1D2C]"
            />
            <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Product table */}
          <div className="bg-white rounded-3xl border border-[#E7E7E7] shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E7E7E7] bg-[#FAFAF9] text-[#667085]">
                  <th className="py-3 px-4 font-bold">Produk</th>
                  <th className="py-3 px-4 font-bold">Kategori</th>
                  <th className="py-3 px-4 font-bold">Harga</th>
                  <th className="py-3 px-4 font-bold">Stok</th>
                  <th className="py-3 px-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E7E7]">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAFAF9]/60">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <OptimizedImage
                          src={p.images[0]}
                          alt=""
                          widthParam={100}
                          qualityParam={70}
                          className="w-10 h-10 rounded-xl object-cover border border-[#E7E7E7] bg-[#FAFAF9]"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-[#242424] truncate max-w-xs">
                            {p.name}
                          </h4>
                          <span className="text-[11px] text-[#667085]">
                            {p.specifications.material}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#667085]">{p.categoryName}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#8F1D2C]">
                        {formatRupiah(p.discountPrice || p.price)}
                      </div>
                      {p.discountPrice && (
                        <span className="text-[10px] text-[#667085] line-through">
                          {formatRupiah(p.price)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">
                        {p.stock} unit
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 bg-[#FAFAF9] hover:bg-gray-200 text-[#242424] rounded-lg transition-colors"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus ${p.name}?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E7E7E7] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E7E7]">
              <h3 className="text-base font-bold text-[#242424]">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-[#667085] hover:text-[#242424] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#242424] block mb-1">
                  Nama Produk
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Meja Belajar Lipat Minimalis"
                  className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3.5 py-2 text-xs text-[#242424]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#242424] block mb-1">
                    Kategori
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3 py-2 text-xs text-[#242424]"
                  >
                    {CATEGORIES.filter((c) => c.slug !== 'all').map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#242424] block mb-1">
                    Jumlah Stok
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3.5 py-2 text-xs text-[#242424]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#242424] block mb-1">
                    Harga Normal (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3.5 py-2 text-xs text-[#242424]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#242424] block mb-1">
                    Harga Diskon (Opsional)
                  </label>
                  <input
                    type="number"
                    value={formDiscountPrice}
                    onChange={(e) =>
                      setFormDiscountPrice(
                        e.target.value === '' ? '' : Number(e.target.value)
                      )
                    }
                    placeholder="Kosongkan jika tidak ada"
                    className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3.5 py-2 text-xs text-[#242424]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#242424] block mb-1">
                  URL Foto Produk
                </label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3.5 py-2 text-xs text-[#242424]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#242424] block mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3.5 py-2 text-xs text-[#242424]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#242424] block mb-1">
                    Material
                  </label>
                  <input
                    type="text"
                    value={formMaterial}
                    onChange={(e) => setFormMaterial(e.target.value)}
                    placeholder="Kayu Pinus Solid / MDF"
                    className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3.5 py-2 text-xs text-[#242424]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#242424] block mb-1">
                    Dimensi (P × L × T)
                  </label>
                  <input
                    type="text"
                    value={formDimensions}
                    onChange={(e) => setFormDimensions(e.target.value)}
                    placeholder="80 × 50 × 75 cm"
                    className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3.5 py-2 text-xs text-[#242424]"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/3 py-2.5 bg-[#FAFAF9] hover:bg-gray-200 text-[#242424] rounded-xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-[#8F1D2C] hover:bg-[#64121D] text-white rounded-xl text-xs font-bold shadow-md"
                >
                  {editingProduct ? 'Simpan Perubahan' : 'Tambah ke Katalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
