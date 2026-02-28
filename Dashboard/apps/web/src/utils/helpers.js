export const NODE_COLORS = {
  company: '#38bdf8',
  person: '#34d399',
  investor: '#a78bfa',
  technology: '#fb923c',
  feature: '#2dd4bf',
};

export const NODE_LABELS = {
  company: 'Companies',
  person: 'People',
  investor: 'Investors',
  technology: 'Technologies',
  feature: 'Features',
};

export const EDGE_LABELS = {
  COMPETES_WITH: 'Competes With',
  FUNDED_BY: 'Funded By',
  FOUNDED: 'Founded',
  USES: 'Uses',
  OFFERS: 'Offers',
};

export const CLASSIFICATION_CONFIG = {
  direct_competitor: { label: 'Direct', className: 'badge-direct' },
  indirect_competitor: { label: 'Indirect', className: 'badge-indirect' },
  emerging: { label: 'Emerging', className: 'badge-emerging' },
};

export function formatFunding(amount) {
  if (!amount) return 'Undisclosed';
  return amount;
}

export function parseFundingNumber(fundingStr) {
  if (!fundingStr) return 0;
  const cleaned = fundingStr.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  if (fundingStr.includes('B')) return num * 1000;
  return num;
}

export function sortCompetitors(competitors, sortBy) {
  return [...competitors].sort((a, b) => {
    if (sortBy === 'funding') {
      return parseFundingNumber(b.funding_total) - parseFundingNumber(a.funding_total);
    }
    if (sortBy === 'employees') {
      return (b.employees || 0) - (a.employees || 0);
    }
    return 0;
  });
}

export function truncate(str, maxLen = 120) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '...';
}
