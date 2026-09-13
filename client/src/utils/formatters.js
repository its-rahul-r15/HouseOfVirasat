/**
 * Formats a number into Indian Rupee format e.g. ₹ 45,000
 */
export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹ 0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats grams
 */
export function formatWeight(grams) {
  if (!grams) return null;
  return `${Number(grams).toFixed(2)} g`;
}

/**
 * Purity display label
 */
export function formatPurity(metalType, purity) {
  if (metalType === 'SILVER' || purity === '925') {
    return '925 Sterling Silver';
  }
  if (metalType === 'GOLD' || ['9K', '14K', '18K', '22K', '24K'].includes(purity)) {
    return `${purity || '18K'} BIS Hallmarked Gold`;
  }
  return purity || metalType || 'Authentic Hallmark';
}

/**
 * Date formatter for orders
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
