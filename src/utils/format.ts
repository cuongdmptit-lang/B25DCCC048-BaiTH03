export const formatPrice = (value: number): string => new Intl.NumberFormat('vi-VN', {
  style: 'currency', currency: 'USD',
}).format(value);
