import { CartItem, CustomerOrderData, Product } from '../types';
import { STORE_CONFIG } from '../config/store';
import { formatRupiah } from './currency';

/**
 * Builds standard WhatsApp direct link
 */
export function createWhatsAppUrl(message: string, phoneNumber: string = STORE_CONFIG.whatsappNumber): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Formats structured message for Cart Checkout Order
 */
export function generateCartOrderMessage(
  cartItems: CartItem[],
  totalAmount: number,
  customerData?: Partial<CustomerOrderData>
): string {
  const dateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let message = `Halo ${STORE_CONFIG.name}, saya ingin memesan perabot dari website:\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📋 *DETAIL PESANAN (${dateStr})*\n\n`;

  cartItems.forEach((item, index) => {
    const variantParts: string[] = [];
    if (item.selectedVariants && Object.keys(item.selectedVariants).length > 0) {
      Object.entries(item.selectedVariants).forEach(([key, val]) => {
        variantParts.push(`${key}: ${val}`);
      });
    }
    const variantText = variantParts.length > 0 ? `   _Varian: ${variantParts.join(' | ')}_\n` : '';
    const itemSubtotal = item.unitPrice * item.quantity;

    message += `${index + 1}. *${item.product.name}*\n`;
    if (variantText) message += variantText;
    message += `   • Harga: ${formatRupiah(item.unitPrice)}\n`;
    message += `   • Jumlah: ${item.quantity} unit\n`;
    message += `   • Subtotal: ${formatRupiah(itemSubtotal)}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTAL SEMENTARA: ${formatRupiah(totalAmount)}*\n`;
  message += `_(Belum termasuk ongkir, akan dikonfirmasi Bu Ngatmin)_\n\n`;

  message += `📍 *DATA PENGIRIMAN:*\n`;
  message += `• Nama: ${customerData?.name?.trim() ? customerData.name : '—'}\n`;
  message += `• No. WhatsApp: ${customerData?.phone?.trim() ? customerData.phone : '—'}\n`;
  message += `• Kota/Kecamatan: ${customerData?.city?.trim() ? customerData.city : '—'}\n`;
  message += `• Alamat Lengkap: ${customerData?.address?.trim() ? customerData.address : '—'}\n`;
  if (customerData?.notes?.trim()) {
    message += `• Catatan: ${customerData.notes}\n`;
  }

  message += `\nMohon dibantu untuk konfirmasi ketersediaan stok & estimasi ongkir terbaik ya. Terima kasih! 🙏`;

  return message;
}

/**
 * Formats message for Single Product Instant Order
 */
export function generateDirectProductOrderMessage(
  product: Product,
  quantity: number,
  selectedVariants: Record<string, string>,
  customerData?: Partial<CustomerOrderData>
): string {
  const unitPrice = product.discountPrice || product.price;
  const subtotal = unitPrice * quantity;

  let message = `Halo ${STORE_CONFIG.name}, saya tertarik dan ingin memesan produk berikut:\n\n`;
  message += `🛋️ *${product.name}*\n`;
  
  if (Object.keys(selectedVariants).length > 0) {
    const varArr = Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`);
    message += `• Varian: ${varArr.join(' | ')}\n`;
  }
  
  message += `• Jumlah: ${quantity} unit\n`;
  message += `• Harga Satuan: ${formatRupiah(unitPrice)}\n`;
  message += `• Total: *${formatRupiah(subtotal)}*\n\n`;

  if (customerData?.name || customerData?.city) {
    message += `📍 *Tujuan Kirim:*\n`;
    if (customerData?.name) message += `• Nama: ${customerData.name}\n`;
    if (customerData?.city) message += `• Kota/Kecamatan: ${customerData.city}\n`;
    if (customerData?.address) message += `• Alamat: ${customerData.address}\n`;
    message += `\n`;
  }

  message += `Apakah produk ini ready stok? Boleh info estimasi ongkir ke alamat saya? Terima kasih.`;

  return message;
}

/**
 * General Help or Consultation Message
 */
export function generateHelpInquiryMessage(context?: string): string {
  if (context) {
    return `Halo tim ${STORE_CONFIG.name}, saya ingin bertanya perihal: "${context}". Boleh dibantu konsultasinya? Terima kasih.`;
  }
  return `Halo ${STORE_CONFIG.name}, saya ingin tanya-tanya mengenai produk perabot dan estimasi pengiriman. Boleh dibantu?`;
}
