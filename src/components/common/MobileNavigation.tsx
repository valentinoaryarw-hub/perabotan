import React from 'react';
import { Home, Grid, ShoppingBag, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useCart } from '../../context/CartContext';

interface MobileNavigationProps {
  currentPath?: string;
  onOpenCart?: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentPath = '',
  onOpenCart,
}) => {
  const { user, openAuthModal } = useAuth();
  const { unreadCountForCustomer } = useChat();
  const { totalItems } = useCart();

  const isHome = currentPath === '/' || currentPath === '';
  const isProducts = currentPath === '/products' || currentPath.startsWith('/category');
  const isCart = currentPath === '/cart';
  const isChat = currentPath === '/chat';
  const isProfile = currentPath === '/profile';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7E7E7] px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Beranda */}
        <a
          href="#/"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
            isHome
              ? 'text-[#8F1D2C] font-bold'
              : 'text-[#667085] hover:text-[#242424]'
          }`}
          id="mobile-nav-home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Beranda</span>
        </a>

        {/* Kategori / Semua Produk */}
        <a
          href="#/products"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
            isProducts
              ? 'text-[#8F1D2C] font-bold'
              : 'text-[#667085] hover:text-[#242424]'
          }`}
          id="mobile-nav-products"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Kategori</span>
        </a>

        {/* Troli Belanja */}
        <button
          type="button"
          onClick={() => {
            if (onOpenCart) {
              onOpenCart();
            } else {
              window.location.hash = '#/cart';
            }
          }}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
            isCart
              ? 'text-[#8F1D2C] font-bold'
              : 'text-[#667085] hover:text-[#242424]'
          }`}
          id="mobile-nav-cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 bg-[#8F1D2C] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Troli</span>
        </button>

        {/* Chat Penjual */}
        <a
          href="#/chat"
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
            isChat
              ? 'text-[#8F1D2C] font-bold'
              : 'text-[#667085] hover:text-[#242424]'
          }`}
          id="mobile-nav-chat"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5" />
            {unreadCountForCustomer > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 bg-[#8F1D2C] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {unreadCountForCustomer}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Chat</span>
        </a>

        {/* Profil / Masuk */}
        {user ? (
          <a
            href="#/profile"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
              isProfile
                ? 'text-[#8F1D2C] font-bold'
                : 'text-[#667085] hover:text-[#242424]'
            }`}
            id="mobile-nav-profile"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium truncate max-w-[55px]">
              {user.name.split(' ')[0]}
            </span>
          </a>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal()}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors text-[#667085] hover:text-[#242424] cursor-pointer`}
            id="mobile-nav-login"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Masuk</span>
          </button>
        )}
      </div>
    </div>
  );
};
