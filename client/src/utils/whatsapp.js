/**
 * Generates an authentic WhatsApp Concierge link for House of Virasat
 */
export function getWhatsAppLink({
  phoneNumber = '919876543210',
  product = null,
  bespokeId = null,
  customMessage = null,
}) {
  let message = 'Namaste House of Virasat, I would like to inquire about your jewellery.';

  if (product) {
    message = `Namaste House of Virasat! I am interested in: *${product.name}* (SKU: ${product.sku || 'N/A'}).\nPrice: ₹${product.sellingPrice?.toLocaleString('en-IN') || 'Upon Request'}.\nCould you please share more details or karigar videos?`;
  } else if (bespokeId) {
    message = `Namaste! I submitted a Bespoke Jewellery enquiry (Ref: *${bespokeId}*). I would like to discuss design details with your master craftsman.`;
  } else if (customMessage) {
    message = customMessage;
  }

  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
