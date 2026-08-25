export const STORE_CONFIG = {
  name: 'Perabotan Bu Ngatmin',
  tagline: 'Perabot Pilihan Keluarga, Kualitas Mantap & Nyaman',
  description: 'Pusat perabot rumah tangga & home living pilihan keluarga Indonesia. Menghadirkan aneka perabot estetik, kokoh, dan terjangkau langsung dari workshop perajin berpengalaman.',
  
  // WhatsApp Configuration (without '+' or leading zeros, e.g. 6281234567890)
  whatsappNumber: '6281298765432',
  whatsappDisplayNumber: '+62 812-9876-5432',
  
  // Store Address & Workshop
  address: {
    street: 'Jl. Sukajadi No. 142, Pasteur',
    district: 'Kec. Sukajadi',
    city: 'Kota Bandung',
    province: 'Jawa Barat',
    postalCode: '40162',
    fullAddress: 'Jl. Sukajadi No. 142, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat 40162',
    googleMapsUrl: 'https://maps.google.com/?q=Sukajadi+Bandung',
  },

  // Hours
  openingHours: {
    weekdays: 'Senin - Jumat: 08.30 - 18.00 WIB',
    saturday: 'Sabtu: 09.00 - 17.00 WIB',
    sunday: 'Minggu & Hari Libur: Chat WhatsApp Tetap Dilayani (Slow Response)',
  },

  // Socials
  socials: {
    instagram: '@perabotan.bungatmin',
    instagramUrl: 'https://instagram.com',
    tiktok: '@perabotan.bungatmin',
    tiktokUrl: 'https://tiktok.com',
    email: 'halo@bungatmin.id',
  },

  // Shipping & Couriers
  shippingCouriers: [
    { name: 'JNE Express / JTR (Trucking)', note: 'Untuk barang sedang s/d berat' },
    { name: 'SiCepat Cargo / Gokil', note: 'Pengiriman hemat antar kota' },
    { name: 'GoSend / GrabExpress (Instant)', note: 'Khusus area Bandung & sekitarnya' },
    { name: 'Deliveree / Lalamove Van', note: 'Untuk perabot mebel besar siap pakai' },
    { name: 'Ekspedisi Truk Langganan', note: 'Area Jabodetabek & Jawa-Bali tarif flat bersahabat' },
  ],

  // Payment Methods (Discussed via WhatsApp)
  paymentMethods: [
    'Transfer Bank (BCA, Mandiri, BRI, BNI)',
    'QRIS (Gopay, OVO, Dana, ShopeePay)',
    'COD (Khusus Area Tertentu Bandung Kota via Kurir Toko)',
  ],

  // Brand Palette Constants
  colors: {
    primary: '#8F1D2C',
    darkPrimary: '#64121D',
    lightPrimary: '#F8E9EB',
    background: '#FAFAF9',
    surface: '#FFFFFF',
    textMain: '#242424',
    textSecondary: '#667085',
    border: '#E7E7E7',
    success: '#2E7D5B',
    warning: '#D99A2B',
  }
};
