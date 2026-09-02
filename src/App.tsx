import React, { useState, useEffect, lazy, Suspense } from 'react';
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
import { ToastNotification } from './components/common/ToastNotification';

// 1. Initial/Critical Page (Direct import for instant LCP)
import { HomePage } from './pages/HomePage';

// 2. Secondary & Dynamic Routes (Code-split with React.lazy)
const CatalogPage = lazy(() =>
  import('./pages/CatalogPage').then((m) => ({ default: m.CatalogPage }))
);
const CategoryPage = lazy(() =>
  import('./pages/CategoryPage').then((m) => ({ default: m.CategoryPage }))
);
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const CartPage = lazy(() =>
  import('./pages/CartPage').then((m) => ({ default: m.CartPage }))
);
const ChatPage = lazy(() =>
  import('./pages/ChatPage').then((m) => ({ default: m.ChatPage }))
);
const SellerPage = lazy(() =>
  import('./pages/SellerPage').then((m) => ({ default: m.SellerPage }))
);
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const FAQPage = lazy(() =>
  import('./pages/FAQPage').then((m) => ({ default: m.FAQPage }))
);
const WishlistPage = lazy(() =>
  import('./pages/WishlistPage').then((m) => ({ default: m.WishlistPage }))
);

// 3. Modals and Drawers (Lazy loaded on-demand to reduce initial JS payload)
const CartDrawer = lazy(() =>
  import('./components/cart/CartDrawer').then((m) => ({ default: m.CartDrawer }))
);
const QuickViewModal = lazy(() =>
  import('./components/common/QuickViewModal').then((m) => ({ default: m.QuickViewModal }))
);
const AuthModal = lazy(() =>
  import('./components/common/AuthModal').then((m) => ({ default: m.AuthModal }))
);

// Lightweight Page Loading Skeleton
const PageFallback: React.FC = () => (
  <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-4">
    <div className="h-8 bg-gray-200/80 rounded-2xl w-1/3"></div>
    <div className="h-4 bg-gray-200/80 rounded-xl w-1/2"></div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-square bg-gray-200/80 rounded-2xl"></div>
      ))}
    </div>
  </div>
);

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

    // 1. Home (Catalog-First - Instant load)
    if (currentRoute === '/' || currentRoute === '') {
      return <HomePage />;
    }

    // 2. Catalog / Products
    if (currentRoute === '/products') {
      return (
        <Suspense fallback={<PageFallback />}>
          <CatalogPage
            initialSearch={params?.search || ''}
            initialCategory={params?.category || ''}
          />
        </Suspense>
      );
    }

    // 3. Category Page
    if (currentRoute.startsWith('/category/') || currentRoute === '/category') {
      const categorySlug =
        params?.category ||
        currentRoute.replace('/category/', '').replace('/category', '');
      return (
        <Suspense fallback={<PageFallback />}>
          <CategoryPage categorySlug={categorySlug} />
        </Suspense>
      );
    }

    // 4. Product Detail Page
    if (currentRoute.startsWith('/product/') || currentRoute === '/product') {
      const productSlug =
        params?.slug ||
        currentRoute.replace('/product/', '').replace('/product', '');
      return (
        <Suspense fallback={<PageFallback />}>
          <ProductDetailPage slug={productSlug} />
        </Suspense>
      );
    }

    // 5. Cart / Troli Page
    if (currentRoute === '/cart') {
      return (
        <Suspense fallback={<PageFallback />}>
          <CartPage />
        </Suspense>
      );
    }

    // 6. In-Website Chat Page
    if (currentRoute === '/chat') {
      return (
        <Suspense fallback={<PageFallback />}>
          <ChatPage />
        </Suspense>
      );
    }

    // 7. Admin / Seller Interface
    if (currentRoute === '/seller' || currentRoute === '/admin') {
      return (
        <Suspense fallback={<PageFallback />}>
          <SellerPage />
        </Suspense>
      );
    }

    // 8. Profile Page
    if (currentRoute === '/profile') {
      return (
        <Suspense fallback={<PageFallback />}>
          <ProfilePage />
        </Suspense>
      );
    }

    // 9. About Page
    if (currentRoute === '/about') {
      return (
        <Suspense fallback={<PageFallback />}>
          <AboutPage />
        </Suspense>
      );
    }

    // 10. Contact Page
    if (currentRoute === '/contact') {
      return (
        <Suspense fallback={<PageFallback />}>
          <ContactPage />
        </Suspense>
      );
    }

    // 11. FAQ Page
    if (currentRoute === '/faq') {
      return (
        <Suspense fallback={<PageFallback />}>
          <FAQPage />
        </Suspense>
      );
    }

    // 12. Wishlist Page
    if (currentRoute === '/wishlist') {
      return (
        <Suspense fallback={<PageFallback />}>
          <WishlistPage />
        </Suspense>
      );
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

                  {/* Sliding Cart Drawer for Quick Access (Loaded lazily) */}
                  <Suspense fallback={null}>
                    {isCartDrawerOpen && (
                      <CartDrawer
                        isOpen={isCartDrawerOpen}
                        onClose={() => setIsCartDrawerOpen(false)}
                      />
                    )}
                  </Suspense>

                  {/* Quick View Product Modal (Loaded lazily) */}
                  <Suspense fallback={null}>
                    <QuickViewModal />
                  </Suspense>

                  {/* Global Lightweight Auth Modal (Loaded lazily) */}
                  <Suspense fallback={null}>
                    <AuthModal />
                  </Suspense>

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
