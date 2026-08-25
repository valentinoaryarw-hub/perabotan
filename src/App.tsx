import React, { useState, useEffect } from 'react';
import { useRouter } from './utils/router';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { ChatProvider } from './context/ChatContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileNavigation } from './components/common/MobileNavigation';
import { AuthModal } from './components/common/AuthModal';
import { ToastNotification } from './components/common/ToastNotification';
import { CartDrawer } from './components/cart/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';

// Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { ChatPage } from './pages/ChatPage';
import { SellerPage } from './pages/SellerPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { WishlistPage } from './pages/WishlistPage';

export function App() {
  const { path, params } = useRouter();
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [path]);

  // Route render dispatcher
  const renderContent = () => {
    const currentRoute = path || '/';

    // 1. Home (Catalog-First)
    if (currentRoute === '/' || currentRoute === '') {
      return <HomePage />;
    }

    // 2. Catalog / Products
    if (currentRoute === '/products') {
      return (
        <CatalogPage
          initialSearch={params?.search || ''}
          initialCategory={params?.category || ''}
        />
      );
    }

    // 3. Category Page
    if (currentRoute.startsWith('/category/') || currentRoute === '/category') {
      const categorySlug =
        params?.category ||
        currentRoute.replace('/category/', '').replace('/category', '');
      return <CategoryPage categorySlug={categorySlug} />;
    }

    // 4. Product Detail Page
    if (currentRoute.startsWith('/product/') || currentRoute === '/product') {
      const productSlug =
        params?.slug ||
        currentRoute.replace('/product/', '').replace('/product', '');
      return <ProductDetailPage slug={productSlug} />;
    }

    // 5. Cart / Troli Page
    if (currentRoute === '/cart') {
      return <CartPage />;
    }

    // 6. In-Website Chat Page
    if (currentRoute === '/chat') {
      return <ChatPage />;
    }

    // 7. Admin / Seller Interface (Hidden at bottom of site)
    if (currentRoute === '/seller' || currentRoute === '/admin') {
      return <SellerPage />;
    }

    // 8. Profile Page
    if (currentRoute === '/profile') {
      return <ProfilePage />;
    }

    // 9. About Page
    if (currentRoute === '/about') {
      return <AboutPage />;
    }

    // 10. Contact Page
    if (currentRoute === '/contact') {
      return <ContactPage />;
    }

    // 11. FAQ Page
    if (currentRoute === '/faq') {
      return <FAQPage />;
    }

    // 12. Wishlist Page
    if (currentRoute === '/wishlist') {
      return <WishlistPage />;
    }

    // Fallback to Home
    return <HomePage />;
  };

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <ChatProvider>
            <WishlistProvider>
              <ToastProvider>
                <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#242424] font-sans antialiased selection:bg-[#8F1D2C]/20 selection:text-[#8F1D2C] pb-16 md:pb-0">
                  {/* Global Header */}
                  <Header
                    currentPath={path}
                    onOpenCart={() => setIsCartDrawerOpen(true)}
                  />

                  {/* Main View Area */}
                  <main className="flex-1 w-full">{renderContent()}</main>

                  {/* Global Footer */}
                  <Footer />

                  {/* Mobile Bottom Navigation Bar */}
                  <MobileNavigation
                    currentPath={path}
                    onOpenCart={() => setIsCartDrawerOpen(true)}
                  />

                  {/* Sliding Cart Drawer for Quick Access */}
                  <CartDrawer
                    isOpen={isCartDrawerOpen}
                    onClose={() => setIsCartDrawerOpen(false)}
                  />

                  {/* Quick View Product Modal */}
                  <QuickViewModal />

                  {/* Global Lightweight Auth Modal */}
                  <AuthModal />

                  {/* Global Toast Notifications */}
                  <ToastNotification />
                </div>
              </ToastProvider>
            </WishlistProvider>
          </ChatProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
