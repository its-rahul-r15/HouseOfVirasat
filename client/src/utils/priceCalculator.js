/**
 * Calculates a transparent luxury price breakdown (Tanishq/Vamika style)
 */
export function calculateTransparentBreakup(product, liveGoldRate = 7200, liveSilverRate = 85) {
  if (!product) return null;

  const sellingPrice = Number(product.sellingPrice) || Number(product.mrp) || 0;
  const netWeight = product.netWeight || product.grossWeight || 10;
  const metalType = product.metalType || 'SILVER';
  const purity = product.purity || '925';

  // If custom price breakup is configured by admin
  if (product.priceBreakup && product.priceBreakup.isCustom) {
    const pb = product.priceBreakup;
    const finalPrice = Number(pb.finalPrice) || sellingPrice;
    const gstRate = Number(pb.gstRate) !== undefined && pb.gstRate !== '' ? Number(pb.gstRate) : 3;
    const preTaxTotal = Number(pb.preTaxTotal) || Math.round(finalPrice / (1 + gstRate / 100));
    const gstAmount = Number(pb.gstAmount) !== undefined && pb.gstAmount !== ''
      ? Number(pb.gstAmount)
      : Math.round(finalPrice - preTaxTotal);

    return {
      netWeight,
      purityLabel: pb.purityLabel || (purity === '925' ? '925 Silver' : `${purity} Gold`),
      metalRatePerGram: Number(pb.metalRatePerGram) || 0,
      estimatedMetalCost: Number(pb.estimatedMetalCost) || 0,
      estimatedStoneCost: Number(pb.estimatedStoneCost) || 0,
      makingCharges: Number(pb.makingCharges) || 0,
      makingChargesLabel: pb.makingChargesLabel || 'Jaipur Karigari & Craftsmanship',
      preTaxTotal,
      gstRate,
      gstAmount,
      finalPrice,
      customNote: pb.customNote || 'Price includes BIS hallmarking verification, insured vault delivery, and luxury wooden gift box.',
      isCustom: true,
    };
  }

  let baseMetalRatePerGram = liveSilverRate;
  if (metalType === 'GOLD') {
    if (purity === '22K') baseMetalRatePerGram = liveGoldRate * (22 / 24);
    else if (purity === '18K') baseMetalRatePerGram = liveGoldRate * (18 / 24);
    else if (purity === '14K') baseMetalRatePerGram = liveGoldRate * (14 / 24);
    else baseMetalRatePerGram = liveGoldRate * (18 / 24);
  }

  const estimatedMetalCost = Math.round(Number(netWeight) * baseMetalRatePerGram) || 0;
  
  // Calculate stones value
  let estimatedStoneCost = 0;
  if (product.stones && product.stones.length > 0) {
    estimatedStoneCost = Math.round(sellingPrice * 0.35); // 35% estimated gemstone/polki value
  }

  // Pre-tax subtotal
  const preTaxPrice = Math.round(sellingPrice / 1.03);
  const gstAmount = sellingPrice - preTaxPrice;

  // Making charges & Karigari is the balance
  let makingCharges = preTaxPrice - estimatedMetalCost - estimatedStoneCost;
  if (makingCharges < 0) {
    makingCharges = Math.round(preTaxPrice * 0.2);
  }

  return {
    netWeight,
    purityLabel: purity === '925' ? '925 Silver' : `${purity} Gold`,
    metalRatePerGram: Math.round(baseMetalRatePerGram),
    estimatedMetalCost: Math.min(estimatedMetalCost, preTaxPrice * 0.65),
    estimatedStoneCost,
    makingCharges: Math.max(makingCharges, Math.round(preTaxPrice * 0.15)),
    makingChargesLabel: 'Jaipur Karigari & Craftsmanship',
    preTaxTotal: preTaxPrice,
    gstRate: 3,
    gstAmount,
    finalPrice: sellingPrice,
    customNote: 'Price includes BIS hallmarking verification, insured vault delivery, and luxury wooden gift box.',
    isCustom: false,
  };
}
