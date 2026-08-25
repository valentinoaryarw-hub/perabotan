import { Benefit, Testimonial } from '../types';

export const BENEFITS: Benefit[] = [
  {
    id: 'b-1',
    title: 'Produk Pilihan & Estetik',
    description: 'Dipilih dan dirancang khusus untuk kenyamanan hunian modern, apartemen, maupun rumah keluarga.',
    iconName: 'Sparkles',
  },
  {
    id: 'b-2',
    title: 'Harga Bersahabat & Transparan',
    description: 'Langsung dari pengrajin perabot lokal dengan kualitas bahan prima tanpa biaya markup toko besar.',
    iconName: 'BadgePercent',
  },
  {
    id: 'b-3',
    title: 'Order Mudah via WhatsApp',
    description: 'Pesan langsung ke WhatsApp tanpa repot buat akun atau registrasi berbelit. CS ramah dan responsif.',
    iconName: 'MessageSquare',
  },
  {
    id: 'b-4',
    title: 'Packing Aman & Ekspedisi Luas',
    description: 'Pengemasan berlapis kardus tebal & bubble wrap, melayani kirim instant, kargo pulau Jawa, & luar pulau.',
    iconName: 'Truck',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Siti Rahma',
    city: 'Bandung',
    rating: 5,
    comment: 'Panci susu stainless-nya tebal banget, gagang kayunya nyaman dan tidak panas. Bu Ngatmin ramah banget di chat, packing bubble tebal aman sampai rumah.',
    productBought: 'Panci Susu / Rebus Stainless Gagang Kayu',
    date: '2 hari lalu',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 't-2',
    name: 'Wahyu Hidayat',
    city: 'Semarang',
    rating: 5,
    comment: 'Sapu ijuk dan pengkinya berkualitas bagus! Ijuknya rapat tidak rontok berserakan di ubin. Pengkinya juga rapat di lantai jadi debu langsung masuk.',
    productBought: 'Sapu Ijuk Super Tebal Gagang Kayu',
    date: '1 minggu lalu',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 't-3',
    name: 'Rina Kusuma',
    city: 'Surabaya',
    rating: 5,
    comment: 'Toples kaca tutup bambu dan piring keramiknya estetik banget. Kirim ke Surabaya kaca utuh mulus tanpa pecah karena dilapisi kardus tebal.',
    productBought: 'Toples Kaca Kedap Udara Tutup Bambu (Set 3)',
    date: '3 hari lalu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 't-4',
    name: 'Budi Santoso',
    city: 'Jakarta',
    rating: 5,
    comment: 'Ember 20 liter sama gayung mandinya tebal anti pecah. Gagang besinya kokoh gak melengkung pas diisi air penuh. Belanja di Bu Ngatmin mantap!',
    productBought: 'Ember Air Plastik Jumbo 20 Liter',
    date: '5 hari lalu',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
  },
];
