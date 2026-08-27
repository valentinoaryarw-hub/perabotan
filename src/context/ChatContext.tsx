import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
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
    orderSummary?: ChatMessage['orderSummaryDetails'],
    productSnapshot?: ProductSummary
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
  clearAllConversations: () => void;
}

const STORAGE_KEY_CHATS = 'bu_ngatmin_firestore_chats_v1';

const INITIAL_SELLER_INFO = {
  id: 'seller-bu-ngatmin',
  name: 'Perabotan Bu Ngatmin',
  avatar: 'https://images.unsplash.com/photo-1584990347449-39908cfd0c5a?auto=format&fit=crop&w=200&q=80',
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, activeRole } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHATS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load local cached chats', e);
    }
    return [];
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const autoReplyTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  // Sync to local cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save chats to storage', e);
    }
  }, [conversations]);

  // Real-time Firestore sync based on user identity and active role
  useEffect(() => {
    if (!user) {
      return;
    }

    try {
      let q;
      if (activeRole === 'seller') {
        q = query(collection(db, 'conversations'), orderBy('lastMessageTimestamp', 'desc'));
      } else {
        q = query(
          collection(db, 'conversations'),
          where('customerId', '==', user.id)
        );
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: ChatConversation[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              customerId: data.customerId,
              customerName: data.customerName || 'Pelanggan',
              customerAvatar: data.customerAvatar,
              productId: data.productId,
              productSnapshot: data.productSnapshot,
              messages: Array.isArray(data.messages) ? data.messages : [],
              lastMessage: data.lastMessage || '',
              lastMessageTimestamp: data.lastMessageTimestamp || Date.now(),
              unreadBySeller: data.unreadBySeller || 0,
              unreadByCustomer: data.unreadByCustomer || 0,
              status: data.status || 'active',
            });
          });

          // Sort by timestamp desc
          list.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
          setConversations(list);
        },
        (error) => {
          console.warn('Firestore chats subscription note:', error.message);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error attaching firestore chat listener', err);
    }
  }, [user?.id, activeRole]);

  // Helper to persist conversation to Firestore
  const saveConvToFirestore = async (conv: ChatConversation) => {
    try {
      const convRef = doc(db, 'conversations', conv.id);
      await setDoc(convRef, {
        ...conv,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.warn('Firestore conv save fallback to local:', err);
    }
  };

  const getConversation = (id: string) => {
    return conversations.find((c) => c.id === id);
  };

  const startOrGetConversation = (
    product?: Product | ProductSummary,
    initialMessage?: string
  ): string => {
    const currentCustomer = user || {
      id: 'usr-guest-' + Date.now().toString(36),
      name: 'Tamu Toko',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tamu',
      role: 'customer' as const,
    };

    let productSnapshot: ProductSummary | undefined;
    if (product) {
      productSnapshot = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        image: 'images' in product ? product.images[0] : product.image,
        categoryName:
          'categoryName' in product ? product.categoryName : undefined,
        stock: product.stock,
      };
    }

    // Check existing conversation
    const existing = conversations.find(
      (c) =>
        c.customerId === currentCustomer.id &&
        (!productSnapshot || c.productId === productSnapshot.id)
    );

    const messageText =
      initialMessage ||
      (productSnapshot
        ? `Halo Bu Ngatmin, saya ingin menanyakan informasi seputar produk ${productSnapshot.name}:`
        : 'Halo Bu Ngatmin, saya ingin bertanya seputar produk perabot.');

    if (existing) {
      setActiveConversationId(existing.id);
      if (productSnapshot) {
        const updated = {
          ...existing,
          productId: productSnapshot.id,
          productSnapshot: productSnapshot,
        };
        setConversations((prev) =>
          prev.map((c) => (c.id === existing.id ? updated : c))
        );
        saveConvToFirestore(updated);
      }
      if (initialMessage || productSnapshot) {
        sendMessage(existing.id, messageText, 'customer', undefined, productSnapshot);
      }
      return existing.id;
    }

    // Create new clean conversation
    const newConvId = 'conv-' + Date.now().toString(36);
    const initialMessages: ChatMessage[] = [
      {
        id: 'msg-' + Date.now().toString(36),
        conversationId: newConvId,
        senderId: currentCustomer.id,
        senderRole: 'customer',
        senderName: currentCustomer.name,
        text: messageText,
        timestamp: Date.now(),
        productSnapshot: productSnapshot,
      },
    ];

    const newConv: ChatConversation = {
      id: newConvId,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerAvatar: currentCustomer.avatar,
      productId: productSnapshot?.id,
      productSnapshot: productSnapshot,
      messages: initialMessages,
      lastMessage: messageText,
      lastMessageTimestamp: Date.now(),
      unreadBySeller: 1,
      unreadByCustomer: 0,
      status: 'active',
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConvId);
    saveConvToFirestore(newConv);

    triggerSellerAutoReply(newConvId, messageText, productSnapshot);

    return newConvId;
  };

  const triggerSellerAutoReply = (
    conversationId: string,
    customerText: string,
    product?: ProductSummary
  ) => {
    // Clear previous pending timeout if any
    if (autoReplyTimeouts.current[conversationId]) {
      clearTimeout(autoReplyTimeouts.current[conversationId]);
    }

    autoReplyTimeouts.current[conversationId] = setTimeout(() => {
      setConversations((prev) => {
        const target = prev.find((c) => c.id === conversationId);
        if (!target) return prev;

        const hasSellerReply = target.messages.some((m) => m.senderRole === 'seller');
        if (hasSellerReply) {
          return prev; // Do not reply continuously
        }

        let replyText =
          'Halo! Sugeng rawuh di Toko Perabotan Bu Ngatmin. Ada yang bisa Bu Ngatmin bantu untuk keperluan perabotan rumahnya?';
        const lower = customerText.toLowerCase();

        if (
          lower.includes('tersedia') ||
          lower.includes('ready') ||
          lower.includes('stok') ||
          lower.includes('ada')
        ) {
          const stockCount = product?.stock || 30;
          replyText = `Halo! Untuk ${
            product?.name || 'produk ini'
          } stoknya ready ${stockCount} unit siap kirim nggih. Mau dikirim ke alamat mana?`;
        } else if (
          lower.includes('panci') ||
          lower.includes('wajan') ||
          lower.includes('masak')
        ) {
          replyText =
            'Halo! Panci dan wajan kami berbahan tebal food grade, anti lengket, dan tahan karat. Sangat awet dipakai masak sehari-hari. Mau order berapa unit?';
        } else if (
          lower.includes('gayung') ||
          lower.includes('ember') ||
          lower.includes('baskom')
        ) {
          replyText =
            'Halo! Gayung, ember, dan baskom kami terbuat dari plastik murni elastis tebal anti pecah dan awet bertahun-tahun. Mau pilih warna apa nggih?';
        } else if (
          lower.includes('sapu') ||
          lower.includes('lidi') ||
          lower.includes('pengki') ||
          lower.includes('ijuk')
        ) {
          replyText =
            'Halo! Sapu ijuk dan lidi kami dianyam kawat kencang, tidak mudah rontok dan gagang kayunya halus di tangan. Sangat bersih untuk menyapu lantai & halaman.';
        } else if (
          lower.includes('piring') ||
          lower.includes('sendok') ||
          lower.includes('mangkok') ||
          lower.includes('toples')
        ) {
          replyText =
            'Halo! Untuk piring, sendok, mangkok, dan toples kaca/plastik kami bungkus ekstra bubble wrap tebal + kardus. Dijamin aman sampai rumah!';
        } else if (
          lower.includes('diskon') ||
          lower.includes('potongan') ||
          lower.includes('harga') ||
          lower.includes('grosir')
        ) {
          replyText =
            'Halo! Untuk pembelian lebih dari 2 pcs atau grosir keperluan hajatan/rumah makan, Bu Ngatmin beri harga spesial nggih. Boleh tahu butuh berapa unit?';
        } else if (
          lower.includes('kirim') ||
          lower.includes('ongkir') ||
          lower.includes('alamat')
        ) {
          replyText =
            'Halo! Kami siap kirim cepat ke seluruh kecamatan & kota via kurir kargo, reguler, maupun instan. Silakan kirimkan alamat lengkapnya nggih!';
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

        const updatedConv: ChatConversation = {
          ...target,
          messages: [...target.messages, sellerMsg],
          lastMessage: replyText,
          lastMessageTimestamp: Date.now(),
          unreadByCustomer: target.unreadByCustomer + 1,
        };

        saveConvToFirestore(updatedConv);

        return prev.map((c) => (c.id === conversationId ? updatedConv : c));
      });
    }, 1000);
  };

  const sendMessage = (
    conversationId: string,
    text: string,
    senderRole?: 'customer' | 'seller',
    orderSummaryDetails?: ChatMessage['orderSummaryDetails'],
    productSnapshot?: ProductSummary
  ) => {
    const role = senderRole || activeRole;
    const isCustomer = role === 'customer';
    const senderId = isCustomer ? user?.id || 'usr-anon' : INITIAL_SELLER_INFO.id;
    const senderName = isCustomer ? user?.name || 'Pelanggan' : INITIAL_SELLER_INFO.name;

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5),
      conversationId: conversationId,
      senderId: senderId,
      senderRole: role,
      senderName: senderName,
      text: text,
      timestamp: Date.now(),
      productSnapshot: productSnapshot,
      isOrderSummary: !!orderSummaryDetails,
      orderSummaryDetails: orderSummaryDetails,
    };

    let needsInitialAutoReply = false;
    let targetProductSnapshot = productSnapshot;
    let updatedTargetConv: ChatConversation | undefined;

    setConversations((prev) => {
      return prev.map((c) => {
        if (c.id === conversationId) {
          const hasSellerReply = c.messages.some((m) => m.senderRole === 'seller');
          if (isCustomer && !hasSellerReply && !orderSummaryDetails) {
            needsInitialAutoReply = true;
            targetProductSnapshot = productSnapshot || c.productSnapshot;
          }

          const updated: ChatConversation = {
            ...c,
            messages: [...c.messages, newMsg],
            lastMessage: orderSummaryDetails
              ? `Kesepakatan Order: ${orderSummaryDetails.productName}`
              : text,
            lastMessageTimestamp: Date.now(),
            productSnapshot: productSnapshot || c.productSnapshot,
            unreadBySeller: isCustomer ? c.unreadBySeller + 1 : c.unreadBySeller,
            unreadByCustomer: !isCustomer ? c.unreadByCustomer + 1 : c.unreadByCustomer,
            status: orderSummaryDetails ? 'deal_agreed' : c.status,
          };
          updatedTargetConv = updated;
          return updated;
        }
        return c;
      });
    });

    if (updatedTargetConv) {
      saveConvToFirestore(updatedTargetConv);
    }

    if (needsInitialAutoReply) {
      triggerSellerAutoReply(conversationId, text, targetProductSnapshot);
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
    const summaryDetails: ChatMessage['orderSummaryDetails'] = {
      productName: details.productName,
      quantity: details.quantity,
      unitPrice: details.unitPrice,
      totalPrice: details.totalPrice,
      variants: details.variants,
      status: 'deal_agreed',
    };

    sendMessage(
      conversationId,
      `Nota Kesepakatan Toko Bu Ngatmin dibuat: ${details.productName} (${details.quantity} pcs)`,
      'seller',
      summaryDetails
    );

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const updated: ChatConversation = { ...c, status: 'deal_agreed' };
          saveConvToFirestore(updated);
          return updated;
        }
        return c;
      })
    );
  };

  const markAsRead = (conversationId: string, role: 'customer' | 'seller') => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const updated: ChatConversation = {
            ...c,
            unreadBySeller: role === 'seller' ? 0 : c.unreadBySeller,
            unreadByCustomer: role === 'customer' ? 0 : c.unreadByCustomer,
          };
          saveConvToFirestore(updated);
          return updated;
        }
        return c;
      })
    );
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      await deleteDoc(doc(db, 'conversations', conversationId));
    } catch (e) {
      console.warn('Error deleting firestore conv', e);
    }
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    if (activeConversationId === conversationId) {
      setActiveConversationId(null);
    }
  };

  const clearAllConversations = () => {
    conversations.forEach((c) => {
      deleteDoc(doc(db, 'conversations', c.id)).catch(() => {});
    });
    setConversations([]);
    setActiveConversationId(null);
  };

  const unreadCountForCustomer = conversations.reduce(
    (acc, curr) => acc + (curr.unreadByCustomer || 0),
    0
  );
  const unreadCountForSeller = conversations.reduce(
    (acc, curr) => acc + (curr.unreadBySeller || 0),
    0
  );

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
        clearAllConversations,
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
