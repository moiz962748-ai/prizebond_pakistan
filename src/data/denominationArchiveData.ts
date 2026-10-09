export interface HistoricalDrawItem {
  drawNo: number;
  date: string;
  year: number;
  city: string;
  firstPrize: string;
  secondPrizeSample?: string[];
  gazetteUrl?: string;
  downloadUrl?: string;
  status: 'Published' | 'Upcoming';
}

export interface DenominationDetailConfig {
  value: string;
  name: string;
  formattedTitle: string;
  isPremium: boolean;
  frequency: string;
  scheduleCycle: string;
  firstPrize: {
    amount: number;
    formatted: string;
    count: number;
    filerNet: string;
    nonFilerNet: string;
    taxFiler: string;
    taxNonFiler: string;
  };
  secondPrize: {
    amount: number;
    formatted: string;
    count: number;
    totalAmountFormatted: string;
  };
  thirdPrize: {
    amount: number;
    formatted: string;
    count: number;
    totalAmountFormatted: string;
  };
  totalPrizePool: string;
  totalWinnersCount: number;
  description: string;
  fbrTaxNote: string;
  historicalDraws: Record<number, HistoricalDrawItem[]>;
}

export const DENOMINATION_ARCHIVE_DATA: Record<string, DenominationDetailConfig> = {
  '100': {
    value: '100',
    name: 'Rs. 100 Prize Bond',
    formattedTitle: 'Rs. 100',
    isPremium: false,
    frequency: 'Quarterly (Every 3 Months)',
    scheduleCycle: 'February 15 · May 15 · August 15 · November 15',
    firstPrize: {
      amount: 700000,
      formatted: 'Rs. 700,000',
      count: 1,
      filerNet: 'Rs. 595,000',
      nonFilerNet: 'Rs. 490,000',
      taxFiler: 'Rs. 105,000 (15%)',
      taxNonFiler: 'Rs. 210,000 (30%)',
    },
    secondPrize: {
      amount: 200000,
      formatted: 'Rs. 200,000',
      count: 3,
      totalAmountFormatted: 'Rs. 600,000',
    },
    thirdPrize: {
      amount: 1000,
      formatted: 'Rs. 1,000',
      count: 1199,
      totalAmountFormatted: 'Rs. 1,199,000',
    },
    totalPrizePool: 'Rs. 2,499,000',
    totalWinnersCount: 1203,
    description:
      'The Rs. 100 Prize Bond is Pakistan’s most accessible savings instrument, issued by National Savings under State Bank supervision. It features 1,203 prizes per draw with a top prize of Rs. 7 Lakhs.',
    fbrTaxNote:
      'Pursuant to FBR Section 156 of the Income Tax Ordinance 2001, withholding tax of 15% is deducted for Active Taxpayers (Filers) and 30% for Non-Filers at source before prize distribution.',
    historicalDraws: {
      2026: [
        {
          drawNo: 53,
          date: '16 November 2026',
          year: 2026,
          city: 'Hyderabad',
          firstPrize: 'Pending',
          gazetteUrl: '/results/100-draw-53',
          downloadUrl: '#',
          status: 'Upcoming',
        },
        {
          drawNo: 52,
          date: '17 August 2026',
          year: 2026,
          city: 'Muzaffarabad',
          firstPrize: '284910',
          secondPrizeSample: ['102938', '491029', '782910'],
          gazetteUrl: '/results/100-draw-52',
          downloadUrl: '#',
          status: 'Published',
        },
        {
          drawNo: 51,
          date: '15 May 2026',
          year: 2026,
          city: 'Peshawar',
          firstPrize: '012345',
          secondPrizeSample: ['248102', '593012', '829103'],
          gazetteUrl: '/results/100-draw-51',
          downloadUrl: '#',
          status: 'Published',
        },
        {
          drawNo: 50,
          date: '16 February 2026',
          year: 2026,
          city: 'Karachi',
          firstPrize: '918273',
          secondPrizeSample: ['381920', '492810', '671920'],
          gazetteUrl: '/results/100-draw-50',
          downloadUrl: '#',
          status: 'Published',
        },
      ],
      2025: [
        {
          drawNo: 49,
          date: '17 November 2025',
          year: 2025,
          city: 'Lahore',
          firstPrize: '482910',
          secondPrizeSample: ['102938', '491029', '782910'],
          gazetteUrl: '/results/100-draw-49',
          downloadUrl: '#',
          status: 'Published',
        },
      ],
      2024: [],
      2023: [],
    },
  },
  '200': {
    value: '200',
    name: 'Rs. 200 Prize Bond',
    formattedTitle: 'Rs. 200',
    isPremium: false,
    frequency: 'Quarterly (Every 3 Months)',
    scheduleCycle: 'March 15 · June 15 · September 15 · December 15',
    firstPrize: {
      amount: 750000,
      formatted: 'Rs. 750,000',
      count: 1,
      filerNet: 'Rs. 637,500',
      nonFilerNet: 'Rs. 525,000',
      taxFiler: 'Rs. 112,500 (15%)',
      taxNonFiler: 'Rs. 225,000 (30%)',
    },
    secondPrize: { amount: 250000, formatted: 'Rs. 250,000', count: 5, totalAmountFormatted: 'Rs. 1,250,000' },
    thirdPrize: { amount: 1250, formatted: 'Rs. 1,250', count: 2394, totalAmountFormatted: 'Rs. 2,992,500' },
    totalPrizePool: 'Rs. 4,992,500',
    totalWinnersCount: 2400,
    description: 'The Rs. 200 Prize Bond offers 2,400 winning chances per quarterly draw.',
    fbrTaxNote: 'Prize bond proceeds are subject to statutory deduction under FBR Section 156.',
    historicalDraws: {
      2026: [{ drawNo: 100, date: '16 March 2026', year: 2026, city: 'Rawalpindi', firstPrize: '182930', status: 'Published' }],
      2025: [], 2024: [], 2023: [],
    },
  },
  '750': {
    value: '750',
    name: 'Rs. 750 Prize Bond',
    formattedTitle: 'Rs. 750',
    isPremium: false,
    frequency: 'Quarterly (Every 3 Months)',
    scheduleCycle: 'January 15 · April 15 · July 15 · October 15',
    firstPrize: {
      amount: 1500000,
      formatted: 'Rs. 1,500,000',
      count: 1,
      filerNet: 'Rs. 1,275,000',
      nonFilerNet: 'Rs. 1,050,000',
      taxFiler: 'Rs. 225,000 (15%)',
      taxNonFiler: 'Rs. 450,000 (30%)',
    },
    secondPrize: { amount: 500000, formatted: 'Rs. 500,000', count: 3, totalAmountFormatted: 'Rs. 1,500,000' },
    thirdPrize: { amount: 9300, formatted: 'Rs. 9,300', count: 1696, totalAmountFormatted: 'Rs. 15,772,800' },
    totalPrizePool: 'Rs. 18,772,800',
    totalWinnersCount: 1700,
    description: 'The Rs. 750 Prize Bond awards a Rs. 15 Lakh 1st prize.',
    fbrTaxNote: 'Under FBR regulations, tax at 15% is deducted for filers.',
    historicalDraws: {
      2026: [{ drawNo: 100, date: '15 January 2026', year: 2026, city: 'Sialkot', firstPrize: '482910', status: 'Published' }],
      2025: [], 2024: [], 2023: [],
    },
  },
  '1500': {
    value: '1500',
    name: 'Rs. 1,500 Prize Bond',
    formattedTitle: 'Rs. 1,500',
    isPremium: false,
    frequency: 'Quarterly (Every 3 Months)',
    scheduleCycle: 'February 15 · May 15 · August 15 · November 15',
    firstPrize: {
      amount: 3000000,
      formatted: 'Rs. 3,000,000',
      count: 1,
      filerNet: 'Rs. 2,550,000',
      nonFilerNet: 'Rs. 2,100,000',
      taxFiler: 'Rs. 450,000 (15%)',
      taxNonFiler: 'Rs. 900,000 (30%)',
    },
    secondPrize: { amount: 1000000, formatted: 'Rs. 1,000,000', count: 3, totalAmountFormatted: 'Rs. 3,000,000' },
    thirdPrize: { amount: 18500, formatted: 'Rs. 18,500', count: 1696, totalAmountFormatted: 'Rs. 31,376,000' },
    totalPrizePool: 'Rs. 37,376,000',
    totalWinnersCount: 1700,
    description: 'The Rs. 1,500 Prize Bond is the premier standard denomination in Pakistan.',
    fbrTaxNote: 'FBR Section 156 mandates a 15% withholding tax for active filers.',
    historicalDraws: {
      2026: [{ drawNo: 103, date: '15 August 2026', year: 2026, city: 'Faisalabad', firstPrize: '452819', status: 'Published' }],
      2025: [], 2024: [], 2023: [],
    },
  },
  '25000': {
    value: '25000',
    name: 'Rs. 25,000 Premium Prize Bond',
    formattedTitle: 'Rs. 25,000 Premium',
    isPremium: true,
    frequency: 'Quarterly + Bi-Annual Profit',
    scheduleCycle: 'March 10 · June 10 · September 10 · December 10',
    firstPrize: {
      amount: 30000000,
      formatted: 'Rs. 30,000,000 (2 Winners)',
      count: 2,
      filerNet: 'Rs. 25,500,000 each',
      nonFilerNet: 'Rs. 21,000,000 each',
      taxFiler: 'Rs. 4,500,000 (15%)',
      taxNonFiler: 'Rs. 9,000,000 (30%)',
    },
    secondPrize: { amount: 10000000, formatted: 'Rs. 10,000,000', count: 5, totalAmountFormatted: 'Rs. 50,000,000' },
    thirdPrize: { amount: 300000, formatted: 'Rs. 300,000', count: 700, totalAmountFormatted: 'Rs. 210,000,000' },
    totalPrizePool: 'Rs. 320,000,000 + Periodic Profit',
    totalWinnersCount: 707,
    description: 'Registered Premium Prize Bond issued in investor’s CNIC with bi-annual profit.',
    fbrTaxNote: 'Tax on prize winnings is withheld at 15% for filers and 30% for non-filers.',
    historicalDraws: {
      2026: [{ drawNo: 21, date: '10 March 2026', year: 2026, city: 'Islamabad', firstPrize: '192830', status: 'Published' }],
      2025: [], 2024: [], 2023: [],
    },
  },
  '40000': {
    value: '40000',
    name: 'Rs. 40,000 Premium Prize Bond',
    formattedTitle: 'Rs. 40,000 Premium',
    isPremium: true,
    frequency: 'Quarterly + Bi-Annual Profit',
    scheduleCycle: 'March 10 · June 10 · September 10 · December 10',
    firstPrize: {
      amount: 80000000,
      formatted: 'Rs. 80,000,000',
      count: 1,
      filerNet: 'Rs. 68,000,000',
      nonFilerNet: 'Rs. 56,000,000',
      taxFiler: 'Rs. 12,000,000 (15%)',
      taxNonFiler: 'Rs. 24,000,000 (30%)',
    },
    secondPrize: { amount: 30000000, formatted: 'Rs. 30,000,000', count: 3, totalAmountFormatted: 'Rs. 90,000,000' },
    thirdPrize: { amount: 500000, formatted: 'Rs. 500,000', count: 660, totalAmountFormatted: 'Rs. 330,000,000' },
    totalPrizePool: 'Rs. 500,000,000 + Profit',
    totalWinnersCount: 664,
    description: 'The highest denomination sovereign bond in Pakistan.',
    fbrTaxNote: 'WHT of 15% applies to ATL registered filers.',
    historicalDraws: {
      2026: [{ drawNo: 33, date: '10 March 2026', year: 2026, city: 'Quetta', firstPrize: '284910', status: 'Published' }],
      2025: [], 2024: [], 2023: [],
    },
  },
};

export const SUPPORTED_DENOMINATIONS = ['100', '200', '750', '1500', '25000', '40000'];

export function normalizeDenomination(param: string): string | null {
  if (!param) return null;
  const clean = param.toLowerCase().replace(/^rs-?/i, '').replace(/-/g, '').trim();
  if (SUPPORTED_DENOMINATIONS.includes(clean)) {
    return clean;
  }
  return null;
}