export interface ProductVariant {
  id: string;
  name: string; // e.g. "Ukuran", "Warna", "Finishing"
  options: string[]; // e.g. ["Natural Wood", "Dark Walnut", "Off-White"] or ["60x40 cm", "80x40 cm"]
  priceAdjustments?: Record<string, number>; // optional price delta
}

export interface ProductSpecification {
  material: string;
  dimensions: string;
  weight: string;
  color: string;
  assemblyRequired?: boolean;
  warranty?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // e.g., 'ruang-tamu', 'kamar-tidur', 'dapur', 'storage', 'meja-kursi', 'dekorasi'
  categoryName: string;
  price: number;
  discountPrice?: number;
  images: string[];
  description: string;
  shortDescription: string;
  specifications: ProductSpecification;
  rating: number;
  reviewCount: number;
  soldCount: number;
  stock: number;
  badge?: 'BEST SELLER' | 'HEMAT 20%' | 'PRODUK BARU' | 'PROMO' | 'TERLARIS' | 'LIMITED' | string;
  variants?: ProductVariant[];
  featured?: boolean;
  isBestSeller?: boolean;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  iconName: string;
}

export interface CartItem {
  id: string; // unique item id (productId + JSON.stringify(selectedVariants))
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>; // { "Warna": "Dark Walnut", "Ukuran": "80x40 cm" }
  unitPrice: number;
}

export interface CustomerOrderData {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  deliveryOption?: string;
}

export interface FilterState {
  search: string;
  categories: string[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  minRating: number;
  sortBy: 'terbaru' | 'terlaris' | 'harga-terendah' | 'harga-tertinggi' | 'rating';
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  comment: string;
  productBought: string;
  date: string;
  avatar?: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface FAQItem {
  id: string;
  category: 'Pemesanan' | 'Pembayaran' | 'Pengiriman' | 'Kualitas & Garansi' | 'Custom & Stok';
  question: string;
  answer: string;
}

export interface UserIdentity {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  role: 'customer' | 'seller';
  createdAt?: number;
}

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  categoryName?: string;
  stock?: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'customer' | 'seller';
  senderName: string;
  senderUsername?: string;
  text: string;
  timestamp: number;
  productSnapshot?: ProductSummary;
  isOrderSummary?: boolean;
  orderSummaryDetails?: {
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    variants?: Record<string, string>;
    status: 'deal_agreed' | 'pending';
  };
}

export interface ChatConversation {
  id: string;
  customerId: string;
  customerName: string;
  customerUsername?: string;
  customerAvatar?: string;
  productId?: string;
  productSnapshot?: ProductSummary;
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageTimestamp: number;
  unreadBySeller: number;
  unreadByCustomer: number;
  status: 'active' | 'negotiating' | 'deal_agreed' | 'completed';
}

