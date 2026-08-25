export function formatRupiah(amount: number): string {
  if (isNaN(amount)) return 'Rp 0';
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export function calculateDiscountPercentage(originalPrice: number, discountPrice: number): number {
  if (!discountPrice || discountPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
}
