import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MessageCircle,
  User,
  Heart,
  ChevronDown,
  X,
  ArrowRight,
  Menu,
  ShoppingBag,
  Sparkles,
  Percent,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useProducts } from '../../context/ProductContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { BrandLogo } from './BrandLogo';
import { CATEGORIES } from '../../data/categories';
import { formatRupiah } from '../../utils/currency';
import { navigateTo } from '../../utils/router';

interface HeaderProps {
  currentPath?: string;
  onOpenCart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath = '', onOpenCart }) => {
  const { user, openAuthModal } = useAuth();
  const { unreadCountForCustomer } = useChat();
  const { products } = useProducts();
  const { wishlistIds } = useWishlist();
  const { totalItems } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Search live suggestions
  const searchSuggestions = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigateTo(`#/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCartClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      navigateTo('#/cart');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E7E7E7] shadow-xs">
      {/* 1. TOP BAR (Brand Logo, Search Bar, and Action Icons) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* BRAND LOGO */}
          <a
            href="#/"
            className="flex items-center gap-2 shrink-0 group py-1"
            id="brand-logo"
          >
            <BrandLogo size="md" />
          </a>

          {/* CENTER WIDE SEARCH BAR (Desktop) */}
          <div
            ref={searchContainerRef}
            className="relative flex-1 max-w-2xl hidden md:block"
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Cari perabot rumah, lemari, meja, kursi, dekorasi..."
                className="w-full bg-[#F5F6F8] hover:bg-[#EFF1F5] border border-[#E2E5EB] rounded-full pl-5 pr-12 py-3 text-sm text-[#242424] placeholder-[#8C95A6] focus:outline-hidden focus:border-[#8F1D2C] focus:bg-white focus:ring-2 focus:ring-[#8F1D2C]/10 transition-all shadow-2xs"
                id="header-desktop-search"
              />
              <button
                type="submit"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-[#667085] hover:text-[#8F1D2C] transition-colors cursor-pointer"
                aria-label="Cari"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E7E7E7] overflow-hidden z-50 p-2 animate-in fade-in">
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                  Hasil Pencarian ({searchSuggestions.length})
                </div>
                {searchSuggestions.length > 0 ? (
                  <div className="space-y-1">
                    {searchSuggestions.map((prod) => (
                      <a
                        key={prod.id}
                        href={`#/product/${prod.slug}`}
                        onClick={() => setIsSearchFocused(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8E9EB]/60 transition-colors group"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded-lg shrink-0 border border-[#E7E7E7]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-[#242424] truncate group-hover:text-[#8F1D2C]">
                            {prod.name}
                          </p>
                          <span className="text-xs font-bold text-[#8F1D2C]">
                            {formatRupiah(prod.discountPrice || prod.price)}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#667085] group-hover:text-[#8F1D2C] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full text-center py-2 text-xs font-bold text-[#8F1D2C] hover:bg-[#F8E9EB] rounded-lg mt-1 transition-colors cursor-pointer"
                    >
                      Buka Semua Hasil untuk "{searchQuery}" →
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-[#667085]">
                    Tidak ada produk yang cocok dengan "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT ACTION BUTTONS (Buyer Direct Icons: Troli, Chat, Wishlist, Profile) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* 1. Troli Belanja Button */}
            <button
              type="button"
              onClick={handleCartClick}
              className="relative p-2.5 text-[#3E4756] hover:text-[#8F1D2C] hover:bg-[#FAFAF9] rounded-xl transition-all flex items-center justify-center cursor-pointer group"
              title="Troli Belanja"
              id="header-cart-btn"
            >
              <ShoppingBag className="w-6 h-6 group-hover:scale-105 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 min-w-[19px] h-[19px] px-1 bg-[#8F1D2C] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* 2. Chat & Tanya Jawab Button */}
            <a
              href="#/chat"
              className="relative p-2.5 text-[#3E4756] hover:text-[#8F1D2C] hover:bg-[#FAFAF9] rounded-xl transition-all flex items-center justify-center group"
              title="Chat Penjual Bu Ngatmin"
              id="header-chat-btn"
            >
              <MessageCircle className="w-6 h-6 group-hover:scale-105 transition-transform" />
              {unreadCountForCustomer > 0 && (
                <span className="absolute top-1 right-1 min-w-[19px] h-[19px] px-1 bg-[#2E7D5B] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                  {unreadCountForCustomer}
                </span>
              )}
            </a>

            {/* 3. Wishlist / Favorit Icon */}
            <a
              href="#/products?filter=wishlist"
              className="relative p-2.5 text-[#3E4756] hover:text-[#8F1D2C] hover:bg-[#FAFAF9] rounded-xl transition-all flex items-center justify-center group hidden sm:flex"
              title="Favorit Saya"
              id="header-wishlist-btn"
            >
              <Heart className="w-6 h-6 group-hover:scale-105 transition-transform" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 min-w-[19px] h-[19px] px-1 bg-[#8F1D2C] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                  {wishlistIds.length}
                </span>
              )}
            </a>

            {/* Vertical Divider */}
            <div className="hidden sm:block h-6 w-px bg-[#E2E5EB] mx-0.5" />

            {/* 4. User Login / Profile Button */}
            {user ? (
              <a
                href="#/profile"
                className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl hover:bg-[#FAFAF9] text-[#242424] hover:text-[#8F1D2C] transition-all font-semibold text-xs sm:text-sm"
                title="Profil Pengguna"
                id="header-user-profile-btn"
              >
                <div className="w-7 h-7 rounded-full bg-[#8F1D2C] text-white flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline max-w-[100px] truncate">
                  {user.name}
                </span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="flex items-center gap-1.5 py-2 px-3 text-[#242424] hover:text-[#8F1D2C] hover:bg-[#FAFAF9] rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer"
                id="header-login-btn"
              >
                <User className="w-5 h-5 text-[#3E4756]" />
                <span className="hidden sm:inline">Masuk</span>
              </button>
            )}

            {/* Mobile Hamburger Button (Garis Tiga) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#242424] hover:bg-[#FAFAF9] rounded-xl md:hidden border border-[#E7E7E7] cursor-pointer"
              aria-label="Menu"
              id="mobile-menu-toggle-btn"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Directly under top bar for mobile) */}
        <div className="py-2.5 md:hidden border-t border-[#E7E7E7]/70">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari perabot di Bu Ngatmin..."
              className="w-full bg-[#F5F6F8] border border-[#E2E5EB] rounded-full pl-4 pr-10 py-2.5 text-xs text-[#242424] placeholder-[#8C95A6] focus:outline-hidden focus:border-[#8F1D2C]"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
              aria-label="Cari"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 2. DESKTOP SUB-NAVBAR (Categories & Catalog Navigation) */}
      <div className="hidden md:block border-t border-[#E7E7E7] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 text-xs font-semibold text-[#242424]">
            {/* Left Nav items */}
            <div className="flex items-center gap-6">
              {/* All Category Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                onMouseLeave={() => setIsCategoryDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => navigateTo('#/products')}
                  className="flex items-center gap-1.5 py-2 font-bold text-[#242424] hover:text-[#8F1D2C] transition-colors cursor-pointer"
                >
                  <span>Semua Kategori</span>
                  <ChevronDown className="w-4 h-4 text-[#667085]" />
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 pt-1 z-50 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl border border-[#E7E7E7] p-2 space-y-1">
                      {CATEGORIES.map((cat) => (
                        <a
                          key={cat.id}
                          href={cat.slug === 'all' ? '#/products' : `#/category/${cat.slug}`}
                          onClick={() => setIsCategoryDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#242424] hover:bg-[#F8E9EB] hover:text-[#8F1D2C] transition-colors"
                        >
                          <span>{cat.name}</span>
                          <span className="text-[10px] text-[#667085] bg-[#FAFAF9] px-1.5 py-0.5 rounded-md">
                            {cat.productCount}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Horizontal Sub-nav Links */}
              <a
                href="#/products"
                className={`py-2 transition-colors ${
                  currentPath === '/products'
                    ? 'text-[#8F1D2C] font-bold'
                    : 'text-[#242424] hover:text-[#8F1D2C]'
                }`}
              >
                Semua Perabot
              </a>

              <a
                href="#/products?filter=terbaru"
                className="py-2 text-[#242424] hover:text-[#8F1D2C] transition-colors flex items-center gap-1"
              >
                <span>Produk Baru</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8F1D2C]"></span>
              </a>

              <a
                href="#/products?filter=sale"
                className="py-2 text-[#8F1D2C] font-bold hover:text-[#64121D] transition-colors flex items-center gap-1"
              >
                <span>Promo & Diskon</span>
                <Percent className="w-3 h-3" />
              </a>

              <a
                href="#/category/panci-alat-masak"
                className="py-2 text-[#242424] hover:text-[#8F1D2C] transition-colors"
              >
                Panci & Masak
              </a>

              <a
                href="#/category/ember-gayung-baskom"
                className="py-2 text-[#242424] hover:text-[#8F1D2C] transition-colors"
              >
                Ember & Gayung
              </a>

              <a
                href="#/category/piring-sendok-makan"
                className="py-2 text-[#242424] hover:text-[#8F1D2C] transition-colors"
              >
                Piring & Sendok
              </a>

              <a
                href="#/category/sapu-pengki-kebersihan"
                className="py-2 text-[#242424] hover:text-[#8F1D2C] transition-colors hidden lg:inline-block"
              >
                Sapu & Pengki
              </a>

              <a
                href="#/category/toples-wadah-makanan"
                className="py-2 text-[#242424] hover:text-[#8F1D2C] transition-colors hidden xl:inline-block"
              >
                Toples & Wadah
              </a>
            </div>

            {/* Right links */}
            <div className="flex items-center gap-4 text-[#667085]">
              <a
                href="#/about"
                className="hover:text-[#8F1D2C] transition-colors text-xs font-medium"
              >
                Tentang Bu Ngatmin
              </a>
              <a
                href="#/faq"
                className="hover:text-[#8F1D2C] transition-colors text-xs font-medium"
              >
                Bantuan & FAQ
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (When hamburger menu is opened) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E7E7] bg-white px-4 py-5 shadow-xl space-y-4 animate-in slide-in-from-top-2">
          {/* Main Links */}
          <div className="space-y-1">
            <a
              href="#/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#242424] hover:bg-[#F8E9EB] hover:text-[#8F1D2C]"
            >
              <span>Beranda</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#667085]" />
            </a>
            <a
              href="#/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#242424] hover:bg-[#F8E9EB] hover:text-[#8F1D2C]"
            >
              <span>Semua Katalog Perabot</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#667085]" />
            </a>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleCartClick();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#242424] hover:bg-[#F8E9EB] hover:text-[#8F1D2C] text-left"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#8F1D2C]" />
                <span>Troli Belanja Saya</span>
              </div>
              {totalItems > 0 && (
                <span className="px-2 py-0.5 bg-[#8F1D2C] text-white text-[10px] font-bold rounded-full">
                  {totalItems} item
                </span>
              )}
            </button>
            <a
              href="#/products?filter=terbaru"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#242424] hover:bg-[#F8E9EB] hover:text-[#8F1D2C]"
            >
              <span>Produk Baru</span>
              <Sparkles className="w-3.5 h-3.5 text-[#8F1D2C]" />
            </a>
            <a
              href="#/products?filter=sale"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#8F1D2C] hover:bg-[#F8E9EB]"
            >
              <span>Promo Diskon (Sale)</span>
              <Percent className="w-3.5 h-3.5 text-[#8F1D2C]" />
            </a>
            <a
              href="#/chat"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#242424] hover:bg-[#F8E9EB] hover:text-[#8F1D2C]"
            >
              <span>💬 Chat Langsung dengan Bu Ngatmin</span>
              {unreadCountForCustomer > 0 && (
                <span className="px-2 py-0.5 bg-[#2E7D5B] text-white text-[10px] font-bold rounded-full">
                  {unreadCountForCustomer}
                </span>
              )}
            </a>
          </div>

          {/* Categories Grid */}
          <div className="pt-3 border-t border-[#E7E7E7]">
            <p className="text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-2.5">
              Kategori Perabot
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => (
                <a
                  key={cat.id}
                  href={`#/category/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-[#242424] bg-[#FAFAF9] hover:bg-[#F8E9EB] hover:text-[#8F1D2C] transition-colors"
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E7E7E7] flex justify-between text-xs text-[#667085]">
            <a
              href="#/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#8F1D2C]"
            >
              Tentang Bu Ngatmin
            </a>
            <a
              href="#/faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#8F1D2C]"
            >
              Bantuan & FAQ
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

