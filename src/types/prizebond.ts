export type DenominationValue = '100' | '200' | '750' | '1500' | '25000' | '40000';

export interface DenominationInfo {
  value: DenominationValue;
  label: string;
  formattedAmount: string;
  isPremium: boolean;
  color: string;
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
  drawFrequency: string;
  description: string;
}

export interface PrizeStructure {
  firstCount: number;
  firstAmount: number;
  firstAmountFormatted: string;
  secondCount: number;
  secondAmount: number;
  secondAmountFormatted: string;
  thirdCount: number;
  thirdAmount: number;
  thirdAmountFormatted: string;
}

export interface WinningNumberEntry {
  number: string;
  category: '1st' | '2nd' | '3rd';
  amount: number;
  amountFormatted: string;
}

export interface DrawRecord {
  id: string;
  drawNo: number;
  denomination: DenominationValue;
  date: string; // YYYY-MM-DD
  formattedDate: string; // e.g. 15 August 2026
  city: string;
  status: 'Published' | 'Upcoming';
  prizeStructure: PrizeStructure;
  firstPrizeNumbers: string[];
  secondPrizeNumbers: string[];
  thirdPrizeSampleNumbers: string[]; // representative sample for Third prize list
  allWinningNumbersMap?: Record<string, { category: '1st' | '2nd' | '3rd'; amount: number }>;
}

export interface ScheduleItem {
  id: string;
  drawNo: number;
  date: string;
  day: string;
  denomination: DenominationValue;
  city: string;
  status: 'Upcoming' | 'Completed';
  isNextDraw?: boolean;
}

export interface CheckerResultItem {
  bondNumber: string;
  denomination: DenominationValue;
  isWinner: boolean;
  prizeCategory?: '1st Prize' | '2nd Prize' | '3rd Prize';
  prizeAmount?: number;
  prizeAmountFormatted?: string;
  drawNo?: number;
  drawDate?: string;
  drawCity?: string;
  matchedDrawId?: string;
}

export interface SavedBond {
  id: string;
  label: string;
  denomination: DenominationValue;
  bondNumber: string;
  dateAdded: string;
}

export interface InfoArticle {
  slug: string;
  title: string;
  shortSummary: string;
  category: string;
  lastUpdated: string;
  readTime: string;
  sections: {
    heading: string;
    content: string;
    bulletPoints?: string[];
    tableData?: { headers: string[]; rows: string[][] };
  }[];
  relatedSlugs?: string[];
}

export type GuideArticle = InfoArticle;

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}