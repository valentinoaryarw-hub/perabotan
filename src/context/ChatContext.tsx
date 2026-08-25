import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatConversation, ChatMessage, Product, ProductSummary } from '../types';
import { useAuth } from './AuthContext';

interface ChatContextType {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  startOrGetConversation: (product?: Product | ProductSummary, initialMessage?: string) => string;
  sendMessage: (
    conversationId: string,
    text: string,
    senderRole?: 'customer' | 'seller',
    orderSummary?: ChatMessage['orderSummaryDetails']
  ) => void;
  finalizeDeal: (
    conversationId: string,
    details: {
      productName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      variants?: Record<string, string>;
    }
  ) => void;
  markAsRead: (conversationId: string, role: 'customer' | 'seller') => void;
  getConversation: (conversationId: string) => ChatConversation | undefined;
  unreadCountForCustomer: number;
  unreadCountForSeller: number;
  deleteConversation: (conversationId: string) => void;
}

const STORAGE_KEY_CHATS = 'bu_ngatmin_chat_conversations_v4';

const INITIAL_SELLER_INFO = {
  id: 'seller-bu-ngatmin',
  name: 'Perabotan Bu Ngatmin',
  avatar: 'https://images.unsplash.com/photo-1584990347449-39908cfd0c5a?auto=format&fit=crop&w=200&q=80',
};

const SEED_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-siti-01',
    customerId: 'usr-siti',
    customerName: 'Siti Rahma',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=siti',
    productId: 'prod-panci-01',
    productSnapshot: {
      id: 'prod-panci-01',
      slug: 'panci-stainless-gagang-kayu',
      name: 'Panci Susu / Rebus Stainless Gagang Kayu Anti Panas',
      price: 68000,
      discountPrice: 55000,
      image: 'https://images.unsplash.com/photo-1584990347449-39908cfd0c5a?auto=format&fit=crop&w=400&q=80',
      categoryName: 'Panci & Alat Masak',
      stock: 45,
    },
    messages: [
      {
        id: 'msg-s1',
        conversationId: 'conv-siti-01',
        senderId: 'usr-siti',
        senderRole: 'customer',
        senderName: 'Siti Rahma',
        text: 'Halo Bu Ngatmin, panci susu stainless ini gagang kayunya kokoh gak ya kalau diangkat pas kuah penuh?',
        timestamp: Date.now() - 1000 * 60 * 25,
      },
      {
        id: 'msg-s2',
        conversationId: 'conv-siti-01',
        senderId: INITIAL_SELLER_INFO.id,
        senderRole: 'seller',
        senderName: INITIAL_SELLER_INFO.name,
        text: 'Halo Bu Siti! Sangat kokoh nggih, sambungan gagang dipantek baut ganda baja anti goyang, kayunya juga tebal dan tidak panas saat dipegang.',
        timestamp: Date.now() - 1000 * 60 * 20,
      },
      {
        id: 'msg-s3',
        conversationId: 'conv-siti-01',
        senderId: 'usr-siti',
        senderRole: 'customer',
        senderName: 'Siti Rahma',
        text: 'Alhamdulillah, kalau pesan sekarang packing-nya aman pakai bubble tebal kan Bu?',
        timestamp: Date.now() - 1000 * 60 * 5,
      },
    ],
    lastMessage: 'Alhamdulillah, kalau pesan sekarang packing-nya aman pakai bubble tebal kan Bu?',
    lastMessageTimestamp: Date.now() - 1000 * 60 * 5,
    unreadBySeller: 1,
    unreadByCustomer: 0,
    status: 'negotiating',
  },
  {
    id: 'conv-wahyu-02',
    customerId: 'usr-wahyu',
    customerName: 'Wahyu Hidayat',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wahyu',
    productId: 'prod-sapu-01',
    productSnapshot: {
      id: 'prod-sapu-01',
      slug: 'sapu-ijuk-tebal-gagang-kayu-halus',
      name: 'Sapu Ijuk Super Tebal Gagang Kayu Halus (Anti Rontok)',
      price: 38000,
      discountPrice: 29000,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80',
      categoryName: 'Sapu, Pengki & Alat Bersih',
      stock: 75,
    },
    messages: [
      {
        id: 'msg-w1',
        conversationId: 'conv-wahyu-02',
        senderId: 'usr-wahyu',
        senderRole: 'customer',
        senderName: 'Wahyu Hidayat',
        text: 'Selamat sore Bu Ngatmin, sapu ijuknya apakah rontok pas awal pakai?',
        timestamp: Date.now() - 1000 * 60 * 60,
      },
      {
        id: 'msg-w2',
        conversationId: 'conv-wahyu-02',
        senderId: INITIAL_SELLER_INFO.id,
        senderRole: 'seller',
        senderName: INITIAL_SELLER_INFO.name,
        text: 'Sore Mas Wahyu! Sapu ijuk kami sudah dianyam kawat nilon ganda dan disisir bersih, jadi tidak rontok berserakan di lantai.',
        timestamp: Date.now() - 1000 * 60 * 50,
      },
      {
        id: 'msg-w3',
        conversationId: 'conv-wahyu-02',
        senderId: 'usr-wahyu',
        senderRole: 'customer',
        senderName: 'Wahyu Hidayat',
        text: 'Mantap Bu, saya sekalian mau ambil pengki serokan sampah ya.',
        timestamp: Date.now() - 1000 * 60 * 15,
      },
    ],
    lastMessage: 'Mantap Bu, saya sekalian mau ambil pengki serokan sampah ya.',
    lastMessageTimestamp: Date.now() - 1000 * 60 * 15,
    unreadBySeller: 1,
    unreadByCustomer: 0,
    status: 'active',
  },
  {
    id: 'conv-rudi-03',
    customerId: 'usr-rudi',
    customerName: 'Rudi Setiawan',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rudi',
    productId: 'prod-ember-01',
    productSnapshot: {
      id: 'prod-ember-01',
      slug: 'ember-air-plastik-jumbo-20-liter',
      name: 'Ember Air Plastik Jumbo 20 Liter + Tutup Rapat & Gagang Besi',
      price: 55000,
      discountPrice: 45000,
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
      categoryName: 'Ember, Gayung & Baskom',
      stock: 60,
    },
    messages: [
      {
        id: 'msg-r1',
        conversationId: 'conv-rudi-03',
        senderId: 'usr-rudi',
        senderRole: 'customer',
        senderName: 'Rudi Setiawan',
        text: 'Bu, ember 20 liter sama gayung mandi yang warna hijau tosca ready?',
        timestamp: Date.now() - 1000 * 60 * 120,
      },
      {
        id: 'msg-r2',
        conversationId: 'conv-rudi-03',
        senderId: INITIAL_SELLER_INFO.id,
        senderRole: 'seller',
        senderName: INITIAL_SELLER_INFO.name,
        text: 'Ready stok banyak Mas Rudi. Ember 20L + gayung tebal tosca siap kami kirim hari ini.',
        timestamp: Date.now() - 1000 * 60 * 110,
      },
      {
        id: 'msg-r3',
        conversationId: 'conv-rudi-03',
        senderId: 'usr-rudi',
        senderRole: 'customer',
        senderName: 'Rudi Setiawan',
        text: 'Oke Bu, langsung saya sepakati 2 ember dan 2 gayung.',
        timestamp: Date.now() - 1000 * 60 * 95,
      },
      {
        id: 'msg-r4',
        conversationId: 'conv-rudi-03',
        senderId: INITIAL_SELLER_INFO.id,
        senderRole: 'seller',
        senderName: INITIAL_SELLER_INFO.name,
        text: '✅ Kesepakatan dicatat: 2x Ember 20L + 2x Gayung Tosca = Rp 115.000. Siap dipacking aman ya Mas Rudi.',
        timestamp: Date.now() - 1000 * 60 * 90,
      },
    ],
    lastMessage: '✅ Kesepakatan dicatat: 2x Ember 20L + 2x Gayung Tosca = Rp 115.000. Siap dipacking aman ya Mas Rudi.',
    lastMessageTimestamp: Date.now() - 1000 * 60 * 90,
    unreadBySeller: 0,
    unreadByCustomer: 0,
    status: 'deal_agreed',
  },
];

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, activeRole } = useAuth();

  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CHATS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load chat conversations', e);
    }
    return SEED_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    return conversations[0]?.id || null;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save chat conversations', e);
    }
  }, [conversations]);

  const getConversation = (conversationId: string): ChatConversation | undefined => {
    return conversations.find((c) => c.id === conversationId);
  };

  const startOrGetConversation = (
    product?: Product | ProductSummary,
    initialMessage?: string
  ): string => {
    const currentCustomer = user || {
      id: 'guest-' + Date.now().toString(36),
      name: 'Pembeli',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
      role: 'customer' as const,
    };

    let productSnapshot: ProductSummary | undefined = undefined;
    if (product) {
      productSnapshot = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        image: 'images' in product && Array.isArray(product.images) ? product.images[0] : (product as any).image,
        categoryName: product.categoryName,
        stock: product.stock,
      };
    }

    // Look for existing conversation
    const existing = conversations.find(
      (c) =>
        c.customerId === currentCustomer.id &&
        (!productSnapshot || c.productId === productSnapshot.id)
    );

    if (existing) {
      setActiveConversationId(existing.id);
      if (initialMessage) {
        sendMessage(existing.id, initialMessage, 'customer');
      }
      return existing.id;
    }

    // Create new conversation
    const newConvId = 'conv-' + Date.now().toString(36);
    const initialMessages: ChatMessage[] = [];

    if (initialMessage) {
      initialMessages.push({
        id: 'msg-' + Date.now().toString(36),
        conversationId: newConvId,
        senderId: currentCustomer.id,
        senderRole: 'customer',
        senderName: currentCustomer.name,
        text: initialMessage,
        timestamp: Date.now(),
        productSnapshot: productSnapshot,
      });
    }

    const newConv: ChatConversation = {
      id: newConvId,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerAvatar: currentCustomer.avatar,
      productId: productSnapshot?.id,
      productSnapshot: productSnapshot,
      messages: initialMessages,
      lastMessage: initialMessage || 'Memulai percakapan dengan Bu Ngatmin...',
      lastMessageTimestamp: Date.now(),
      unreadBySeller: initialMessage ? 1 : 0,
      unreadByCustomer: 0,
      status: 'active',
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConvId);

    if (initialMessage) {
      triggerSellerAutoReply(newConvId, initialMessage, productSnapshot);
    }

    return newConvId;
  };

  const triggerSellerAutoReply = (
    conversationId: string,
    customerText: string,
    product?: ProductSummary
  ) => {
    setTimeout(() => {
      let replyText = 'Halo! Sugeng rawuh di Toko Perabotan Bu Ngatmin. Ada yang bisa Bu Ngatmin bantu untuk keperluan perabotan rumahnya?';
      const lower = customerText.toLowerCase();

      if (lower.includes('tersedia') || lower.includes('ready') || lower.includes('stok') || lower.includes('ada')) {
        const stockCount = product?.stock || 30;
        replyText = `Halo! Untuk ${product?.name || 'produk ini'} stoknya ready ${stockCount} unit siap kirim nggih. Mau kirim ke daerah mana?`;
      } else if (lower.includes('panci') || lower.includes('wajan') || lower.includes('masak')) {
        replyText = `Halo! Panci dan wajan kami berbahan tebal food grade, anti lengket, dan tahan karat. Sangat awet dipakai masak sehari-hari. Mau order berapa unit?`;
      } else if (lower.includes('gayung') || lower.includes('ember') || lower.includes('baskom')) {
        replyText = `Halo! Gayung, ember, dan baskom kami terbuat dari plastik murni elastis tebal anti pecah dan awet bertahun-tahun. Mau pilih warna apa nggih?`;
      } else if (lower.includes('sapu') || lower.includes('lidi') || lower.includes('pengki') || lower.includes('ijuk')) {
        replyText = `Halo! Sapu ijuk dan lidi kami dianyam kawat kencang, tidak mudah rontok dan gagang kayunya halus di tangan. Sangat bersih untuk menyapu lantai & halaman.`;
      } else if (lower.includes('piring') || lower.includes('sendok') || lower.includes('mangkok') || lower.includes('toples')) {
        replyText = `Halo! Untuk piring, sendok, mangkok, dan toples kaca/plastik kami bungkus ekstra bubble wrap tebal + kardus. Dijamin aman sampai rumah!`;
      } else if (lower.includes('diskon') || lower.includes('potongan') || lower.includes('harga') || lower.includes('grosir')) {
        replyText = `Halo! Untuk pembelian lebih dari 2 pcs atau grosir keperluan hajatan/rumah makan, Bu Ngatmin beri harga spesial nggih. Boleh tahu butuh berapa unit?`;
      } else if (lower.includes('kirim') || lower.includes('ongkir') || lower.includes('alamat')) {
        replyText = `Halo! Kami siap kirim cepat ke seluruh kecamatan & kota via kurir kargo, reguler, maupun instan. Silakan kirimkan alamat lengkapnya nggih!`;
      }

      const sellerMsg: ChatMessage = {
        id: 'msg-reply-' + Date.now().toString(36),
        conversationId: conversationId,
        senderId: INITIAL_SELLER_INFO.id,
        senderRole: 'seller',
        senderName: INITIAL_SELLER_INFO.name,
        text: replyText,
        timestamp: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: [...c.messages, sellerMsg],
              lastMessage: replyText,
              lastMessageTimestamp: Date.now(),
              unreadByCustomer: c.unreadByCustomer + 1,
            };
          }
          return c;
        })
      );
    }, 1000);
  };

  const sendMessage = (
    conversationId: string,
    text: string,
    senderRole?: 'customer' | 'seller',
    orderSummaryDetails?: ChatMessage['orderSummaryDetails']
  ) => {
    const role = senderRole || activeRole;
    const isCustomer = role === 'customer';

    const senderName = isCustomer ? user?.name || 'Pembeli' : INITIAL_SELLER_INFO.name;
    const senderId = isCustomer ? user?.id || 'usr-guest' : INITIAL_SELLER_INFO.id;

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      conversationId: conversationId,
      senderId: senderId,
      senderRole: role,
      senderName: senderName,
      text: text,
      timestamp: Date.now(),
      isOrderSummary: !!orderSummaryDetails,
      orderSummaryDetails: orderSummaryDetails,
    };

    let targetConv: ChatConversation | undefined;

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          targetConv = c;
          return {
            ...c,
            messages: [...c.messages, newMsg],
            lastMessage: text,
            lastMessageTimestamp: Date.now(),
            unreadBySeller: isCustomer ? c.unreadBySeller + 1 : c.unreadBySeller,
            unreadByCustomer: !isCustomer ? c.unreadByCustomer + 1 : c.unreadByCustomer,
            status: orderSummaryDetails ? 'deal_agreed' : c.status,
          };
        }
        return c;
      })
    );

    if (isCustomer && !orderSummaryDetails) {
      triggerSellerAutoReply(conversationId, text, targetConv?.productSnapshot);
    }
  };

  const finalizeDeal = (
    conversationId: string,
    details: {
      productName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      variants?: Record<string, string>;
    }
  ) => {
    const variantStr = details.variants
      ? Object.entries(details.variants)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')
      : '';

    const summaryText = `🤝 Rekap Pesanan Disepakati:\n• Produk: ${details.productName} (${details.quantity} unit)\n${
      variantStr ? `• Varian: ${variantStr}\n` : ''
    }• Total Nilai: Rp ${details.totalPrice.toLocaleString('id-ID')}\n\nPenjual & Pembeli telah menyepakati rincian pesanan.`;

    sendMessage(conversationId, summaryText, 'seller', {
      productName: details.productName,
      quantity: details.quantity,
      unitPrice: details.unitPrice,
      totalPrice: details.totalPrice,
      variants: details.variants,
      status: 'deal_agreed',
    });
  };

  const markAsRead = (conversationId: string, role: 'customer' | 'seller') => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            unreadBySeller: role === 'seller' ? 0 : c.unreadBySeller,
            unreadByCustomer: role === 'customer' ? 0 : c.unreadByCustomer,
          };
        }
        return c;
      })
    );
  };

  const deleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    if (activeConversationId === conversationId) {
      setActiveConversationId(conversations.find((c) => c.id !== conversationId)?.id || null);
    }
  };

  const unreadCountForCustomer = conversations.reduce((acc, c) => acc + (c.unreadByCustomer || 0), 0);
  const unreadCountForSeller = conversations.reduce((acc, c) => acc + (c.unreadBySeller || 0), 0);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        setActiveConversationId,
        startOrGetConversation,
        sendMessage,
        finalizeDeal,
        markAsRead,
        getConversation,
        unreadCountForCustomer,
        unreadCountForSeller,
        deleteConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
