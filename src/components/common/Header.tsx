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
  LayoutGrid,
  Flame,
  HelpCircle,
  Info,
  Store,
  CheckCircle2,
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
import { OptimizedImage } from './OptimizedImage';

interface HeaderProps {
  currentPath?: string;
  onOpenCart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath = '', onOpenCart }) => {
  const { user, openAuthModal, requireAuth, activeRole, setActiveRole } = useAuth();
  const { unreadCountForCustomer, unreadCountForSeller } = useChat();
  const { products } = useProducts();
  const { wishlistIds } = useWishlist();
  const { totalItems } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Search live suggestions
  const searchSuggestions = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      setIsCategoryDropdownOpen(false);
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
      {/* 0. TOP UTILITY BAR (Tentang Bu Ngatmin & Bantuan at Far Right) */}
      <div className="bg-[#5A101A] text-[#FDE8EB] text-[11px]">
        <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between h-7 sm:h-8">
          <div className="flex items-center gap-2 text-[11px] font-medium text-[#F6D0D6] truncate">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="hidden sm:inline">Toko Perabot Rumah Tangga Bu Ngatmin • Melayani Eceran & Grosir</span>
            <span className="sm:hidden">Toko Perabot Bu Ngatmin</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 font-medium shrink-0">
            <a
              href="#/about"
              className="text-[#F6D0D6] hover:text-white transition-colors flex items-center gap-1.5 py-1"
              id="topbar-about-link"
            >
              <Info className="w-3.5 h-3.5 text-[#F6D0D6]" />
              <span>Tentang Bu Ngatmin</span>
            </a>
            <div className="h-3 w-px bg-white/20" />
            <a
              href="#/faq"
              className="text-[#F6D0D6] hover:text-white transition-colors flex items-center gap-1.5 py-1"
              id="topbar-faq-link"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#F6D0D6]" />
              <span>Bantuan</span>
            </a>
          </div>
        </div>
      </div>

      {/* 1. TOP MAIN BAR (Logo, Kategori Dropdown, Search Bar, Chat, Wishlist, Cart, User Profile) */}
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4 md:gap-5">
          {/* BRAND LOGO */}
          <a
            href="#/"
            className="flex items-center gap-2 shrink-0 group py-1"
            id="brand-logo"
          >
            <BrandLogo size="md" />
          </a>

          {/* KATEGORI NAVIGATION DROPDOWN (Right next to Logo / Left of Search) */}
          <div
            ref={categoryDropdownRef}
            className="relative hidden md:block shrink-0"
          >
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none ${
                isCategoryDropdownOpen
                  ? 'bg-[#8F1D2C] text-white border-[#8F1D2C] shadow-xs'
                  : 'bg-[#FAFAF9] text-[#242424] border-[#E7E7E7] hover:bg-[#F8E9EB] hover:text-[#8F1D2C] hover:border-[#8F1D2C]/30'
              }`}
              id="header-kategori-dropdown-btn"
              title="Buka Menu Kategori Lengkap"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Kategori</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isCategoryDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* FULL DROPDOWN COVERING ALL PRODUCT CATEGORIES & SPECIAL SELECTIONS */}
            {isCategoryDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-[440px] lg:w-[480px] bg-white rounded-2xl shadow-2xl border border-[#E7E7E7] overflow-hidden z-50 p-4 animate-in fade-in zoom-in-95 origin-top-left">
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Column: All Product Categories */}
                  <div className="space-y-1 border-r border-[#E7E7E7] pr-3">
                    <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-[#E7E7E7]">
                      <span className="text-[11px] font-extrabold text-[#667085] uppercase tracking-wider">
                        Kategori Perabot
                      </span>
                      <a
                        href="#/products"
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        className="text-[11px] font-bold text-[#8F1D2C] hover:underline"
                      >
                        Semua →
                      </a>
                    </div>
                    {CATEGORIES.map((cat) => (
                      <a
                        key={cat.id}
                        href={cat.slug === 'all' ? '#/products' : `#/category/${cat.slug}`}
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#242424] hover:bg-[#F8E9EB] hover:text-[#8F1D2C] transition-colors group"
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[10px] text-[#667085] group-hover:text-[#8F1D2C] bg-[#FAFAF9] group-hover:bg-white px-1.5 py-0.5 rounded-md font-bold shrink-0 ml-1">
                          {cat.productCount}
                        </span>
                      </a>
                    ))}
                  </div>

                  {/* Right Column: Special Selections & Collections */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="block text-[11px] font-extrabold text-[#667085] uppercase tracking-wider pb-1.5 mb-1 border-b border-[#E7E7E7]">
                        Pilihan Belanja
                      </span>
                      <a
                        href="#/products?filter=terbaru"
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-[#242424] hover:bg-[#F8E9EB] hover:text-[#8F1D2C] transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#8F1D2C]" />
                        <span>Produk Baru Masuk</span>
                      </a>
                      <a
                        href="#/products?filter=sale"
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-[#8F1D2C] hover:bg-[#F8E9EB] transition-colors"
                      >
                        <Percent className="w-3.5 h-3.5 text-[#8F1D2C]" />
                        <span>Promo Diskon Spesial</span>
                      </a>
                      <a
                        href="#/products?sort=popular"
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-[#242424] hover:bg-[#F8E9EB] hover:text-[#8F1D2C] transition-colors"
                      >
                        <Flame className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>Paling Laris & Populer</span>
                      </a>
                      <a
                        href="#/wishlist"
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-[#242424] hover:bg-[#F8E9EB] hover:text-[#8F1D2C] transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5 text-[#8F1D2C]" />
                        <span>Favorit & Wishlist ({wishlistIds.length})</span>
                      </a>
                    </div>

                    <div className="bg-[#FAFAF9] p-2.5 rounded-xl border border-[#E7E7E7] text-[11px] text-[#667085] leading-relaxed">
                      <p className="font-bold text-[#242424] mb-0.5 flex items-center gap-1 text-[#8F1D2C]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Jaminan Kualitas
                      </p>
                      Semua produk perabot dicek langsung sebelum dikirim untuk menjamin kepuasan belanja Anda.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CENTER WIDE EXPANSIVE SEARCH BAR (Desktop) */}
          <div
            ref={searchContainerRef}
            className="relative flex-1 hidden md:block"
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Cari perabot dapur, alat masak, ember, gayung, piring, toples..."
                className="w-full bg-[#F5F6F8] hover:bg-[#EFF1F5] border border-[#E2E5EB] rounded-full pl-5 pr-24 py-2.5 lg:py-3 text-xs lg:text-sm text-[#242424] placeholder-[#8C95A6] focus:outline-hidden focus:border-[#8F1D2C] focus:bg-white focus:ring-2 focus:ring-[#8F1D2C]/10 transition-all shadow-2xs"
                id="header-desktop-search"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-[#667085] hover:text-[#242424] rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                    aria-label="Hapus pencarian"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#8F1D2C] hover:bg-[#64121D] text-white rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  aria-label="Cari"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Cari</span>
                </button>
              </div>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E7E7E7] overflow-hidden z-50 p-2 animate-in fade-in">
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#667085] uppercase tracking-wider flex items-center justify-between">
                  <span>Hasil Pencarian ({searchSuggestions.length})</span>
                  <span className="text-[10px] text-[#8F1D2C] font-semibold">Toko Bu Ngatmin</span>
                </div>
                {searchSuggestions.length > 0 ? (
                  <div className="space-y-1 mt-1">
                    {searchSuggestions.map((prod) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => {
                          setIsSearchFocused(false);
                          requireAuth(() => {
                            navigateTo(`#/product/${prod.slug}`);
                          });
                        }}
                        className="w-full text-left flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8E9EB]/60 transition-colors group cursor-pointer"
                      >
                        <OptimizedImage
                          src={prod.images[0]}
                          alt={prod.name}
                          widthParam={80}
                          qualityParam={70}
                          className="w-10 h-10 object-cover rounded-lg shrink-0 border border-[#E7E7E7] bg-[#FAFAF9]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-[#242424] truncate group-hover:text-[#8F1D2C]">
                            {prod.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#8F1D2C]">
                              {formatRupiah(prod.discountPrice || prod.price)}
                            </span>
                            <span className="text-[10px] text-[#667085] truncate">
                              • {prod.categoryName}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#667085] group-hover:text-[#8F1D2C] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full text-center py-2 text-xs font-bold text-[#8F1D2C] hover:bg-[#F8E9EB] rounded-xl mt-1 transition-colors cursor-pointer"
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

          {/* RIGHT ACTION ICONS ONLY (Tanya Penjual, Wishlist, Troli, User Profile) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* 1. Tanya Penjual / Chat Icon */}
            <a
              href="#/chat"
              className="relative p-2.5 text-[#242424] hover:text-[#8F1D2C] hover:bg-[#F8E9EB] rounded-xl transition-all flex items-center justify-center group border border-transparent hover:border-[#8F1D2C]/20"
              title="Pesan & Tanya Penjual (Chat Langsung)"
              id="header-chat-icon-btn"
            >
              <MessageCircle className="w-5 h-5 text-[#8F1D2C] group-hover:scale-110 transition-transform" />
              {unreadCountForCustomer > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#2E7D5B] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs border-2 border-white animate-pulse">
                  {unreadCountForCustomer}
                </span>
              )}
            </a>

            {/* 2. Wishlist / Favorit Icon */}
            <a
              href="#/wishlist"
              className="relative p-2.5 text-[#3E4756] hover:text-[#8F1D2C] hover:bg-[#FAFAF9] rounded-xl transition-all flex items-center justify-center group hidden sm:flex border border-transparent hover:border-[#E7E7E7]"
              title="Favorit Saya"
              id="header-wishlist-icon-btn"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#8F1D2C] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                  {wishlistIds.length}
                </span>
              )}
            </a>

            {/* 3. Troli Belanja Icon */}
            <button
              type="button"
              onClick={handleCartClick}
              className="relative p-2.5 bg-[#F8E9EB]/60 hover:bg-[#8F1D2C] text-[#8F1D2C] hover:text-white border border-[#8F1D2C]/20 rounded-xl transition-all flex items-center justify-center cursor-pointer group shadow-2xs"
              title="Troli Belanja"
              id="header-cart-icon-btn"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#8F1D2C] group-hover:bg-[#242424] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Vertical Divider */}
            <div className="hidden sm:block h-6 w-px bg-[#E2E5EB] mx-1" />

            {/* 4. User Login / Profile Avatar Dropdown */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-[#FAFAF9] text-[#242424] hover:text-[#8F1D2C] border border-[#E7E7E7] transition-all cursor-pointer"
                  title="Profil & Pengaturan Akun"
                  id="header-user-profile-btn"
                >
                  {user.avatar && (user.avatar.startsWith('http') && !user.avatar.includes('dicebear')) ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-[#8F1D2C]/30 shadow-2xs"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#8F1D2C] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-[#242424] max-w-[100px] truncate hidden md:inline">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#667085] hidden sm:block" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal()}
                  className="p-2.5 sm:px-3 sm:py-2 text-[#242424] hover:text-[#8F1D2C] hover:bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl font-bold text-xs transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                  title="Masuk dengan Akun Google"
                  id="header-login-btn"
                >
                  <User className="w-4 h-4 text-[#3E4756]" />
                  <span className="hidden sm:inline">Masuk</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && user && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E7E7E7] p-2 z-50 animate-in fade-in space-y-1">
                  <div className="px-3 py-2 border-b border-[#E7E7E7]">
                    <p className="text-xs font-bold text-[#242424] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#667085] truncate">{user.email || user.phone || 'Pelanggan Toko'}</p>
                  </div>

                  <a
                    href="#/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#242424] hover:bg-[#F8E9EB] hover:text-[#8F1D2C] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Profil Saya</span>
                  </a>

                  <a
                    href="#/chat"
                    onClick={() => {
                      setActiveRole('customer');
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#242424] hover:bg-[#F8E9EB] hover:text-[#8F1D2C] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat Bu Ngatmin</span>
                    </div>
                    {unreadCountForCustomer > 0 && (
                      <span className="px-1.5 py-0.2 bg-[#2E7D5B] text-white text-[9px] font-bold rounded-full">
                        {unreadCountForCustomer}
                      </span>
                    )}
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#242424] hover:bg-[#FAFAF9] rounded-xl md:hidden border border-[#E7E7E7] cursor-pointer"
              aria-label="Menu"
              id="mobile-menu-toggle-btn"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#8F1D2C]" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Directly under top bar for mobile screen) */}
        <div className="py-2.5 md:hidden border-t border-[#E7E7E7]/70">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari perabot di Toko Bu Ngatmin..."
              className="w-full bg-[#F5F6F8] border border-[#E2E5EB] rounded-full pl-4 pr-10 py-2.5 text-xs text-[#242424] placeholder-[#8C95A6] focus:outline-hidden focus:border-[#8F1D2C]"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
              aria-label="Cari"
            >
              <Search className="w-4 h-4 text-[#8F1D2C]" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer (When hamburger menu is opened on mobile) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E7E7] bg-white px-4 py-5 shadow-xl space-y-4 animate-in slide-in-from-top-2">
          {/* Main Navigation Links */}
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
            <a
              href="#/chat"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#8F1D2C] bg-[#F8E9EB]/60 hover:bg-[#F8E9EB]"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#8F1D2C]" />
                <span>Pesan & Tanya Penjual</span>
              </div>
              {unreadCountForCustomer > 0 && (
                <span className="px-2 py-0.5 bg-[#2E7D5B] text-white text-[10px] font-bold rounded-full">
                  {unreadCountForCustomer} baru
                </span>
              )}
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
              <span>Produk Baru Masuk</span>
              <span className="text-[10px] bg-[#8F1D2C] text-white px-2 py-0.5 rounded-md">
                Baru
              </span>
            </a>
            <a
              href="#/products?filter=sale"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#8F1D2C] hover:bg-[#F8E9EB]"
            >
              <span>Promo & Diskon</span>
              <Percent className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Categories List in Mobile */}
          <div className="pt-2 border-t border-[#E7E7E7]">
            <p className="text-[10px] font-bold text-[#667085] uppercase tracking-wider px-3 mb-1">
              Kategori Perabot
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => (
                <a
                  key={cat.id}
                  href={`#/category/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs text-[#242424] hover:bg-[#F8E9EB] hover:text-[#8F1D2C] font-medium truncate"
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>

          {/* Secondary Links */}
          <div className="pt-2 border-t border-[#E7E7E7] space-y-1">
            <a
              href="#/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-1.5 text-xs text-[#667085] hover:text-[#8F1D2C]"
            >
              Tentang Toko Bu Ngatmin
            </a>
            <a
              href="#/faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-1.5 text-xs text-[#667085] hover:text-[#8F1D2C]"
            >
              Bantuan & FAQ
            </a>
          </div>
        </div>
      )}
    </header>
  );
};


