import fs from 'fs';
import path from 'path';
import { DenominationValue, CheckerResultItem } from '@/types/prizebond';

export interface ParsedDraw {
  id: string;
  denomination: string;
  drawNumber: number;
  drawDate: string;
  city: string;
  firstPrizes: Set<string>;
  secondPrizes: Set<string>;
  thirdPrizes: Set<string>;
  firstAmount: number;
  secondAmount: number;
  thirdAmount: number;
  fileName: string;
}

// Official CDNS & SBP standard prize structure for all 6 denominations
export const OFFICIAL_PRIZE_STRUCTURES: Record<
  string,
  {
    first: { amount: number; formatted: string };
    second: { amount: number; formatted: string };
    third: { amount: number; formatted: string };
  }
> = {
  '100': {
    first: { amount: 700000, formatted: 'Rs. 700,000' },
    second: { amount: 200000, formatted: 'Rs. 200,000' },
    third: { amount: 1000, formatted: 'Rs. 1,000' },
  },
  '200': {
    first: { amount: 750000, formatted: 'Rs. 750,000' },
    second: { amount: 250000, formatted: 'Rs. 250,000' },
    third: { amount: 1250, formatted: 'Rs. 1,250' },
  },
  '750': {
    first: { amount: 1500000, formatted: 'Rs. 1,500,000' },
    second: { amount: 500000, formatted: 'Rs. 500,000' },
    third: { amount: 9300, formatted: 'Rs. 9,300' },
  },
  '1500': {
    first: { amount: 3000000, formatted: 'Rs. 3,000,000' },
    second: { amount: 1000000, formatted: 'Rs. 1,000,000' },
    third: { amount: 18500, formatted: 'Rs. 18,500' },
  },
  '25000': {
    first: { amount: 30000000, formatted: 'Rs. 30,000,000' },
    second: { amount: 10000000, formatted: 'Rs. 10,000,000' },
    third: { amount: 300000, formatted: 'Rs. 300,000' },
  },
  '40000': {
    first: { amount: 80000000, formatted: 'Rs. 80,000,000' },
    second: { amount: 30000000, formatted: 'Rs. 30,000,000' },
    third: { amount: 500000, formatted: 'Rs. 500,000' },
  },
};

const SBP_CITIES = [
  'Karachi',
  'Lahore',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Hyderabad',
  'Muzaffarabad',
  'Sialkot',
  'Islamabad',
  'Bahawalpur',
  'Gujranwala',
  'Sukkur',
];

// Fallback Draw Metadata Lookup table for draws where raw text had abbreviated or incomplete headers
const DRAW_SCHEDULE_LOOKUP: Record<string, Record<string, { date: string; city: string }>> = {
  '100': {
    '48': { date: '2024-11-15', city: 'Multan' },
    '49': { date: '2025-02-17', city: 'Rawalpindi' },
    '50': { date: '2025-05-15', city: 'Sialkot' },
    '51': { date: '2025-08-15', city: 'Lahore' },
    '52': { date: '2025-11-17', city: 'Hyderabad' },
    '53': { date: '2026-02-16', city: 'Karachi' },
    '54': { date: '2026-05-15', city: 'Peshawar' },
    '55': { date: '2026-08-17', city: 'Muzaffarabad' },
    '56': { date: '2026-11-16', city: 'Faisalabad' },
  },
  '200': {
    '97': { date: '2024-03-15', city: 'Muzaffarabad' },
    '98': { date: '2024-06-18', city: 'Rawalpindi' },
    '99': { date: '2024-09-16', city: 'Peshawar' },
    '100': { date: '2024-12-16', city: 'Sialkot' },
    '101': { date: '2025-03-17', city: 'Faisalabad' },
    '102': { date: '2025-06-16', city: 'Quetta' },
    '103': { date: '2025-09-15', city: 'Multan' },
    '104': { date: '2025-12-15', city: 'Lahore' },
    '105': { date: '2026-03-16', city: 'Faisalabad' },
    '106': { date: '2026-06-16', city: 'Multan' },
    '107': { date: '2026-09-15', city: 'Peshawar' },
    '108': { date: '2026-12-15', city: 'Lahore' },
  },
  '750': {
    '97': { date: '2024-01-15', city: 'Sialkot' },
    '98': { date: '2024-04-15', city: 'Hyderabad' },
    '99': { date: '2024-07-15', city: 'Quetta' },
    '100': { date: '2024-10-15', city: 'Faisalabad' },
    '101': { date: '2025-01-15', city: 'Karachi' },
    '102': { date: '2025-04-15', city: 'Peshawar' },
    '103': { date: '2025-07-15', city: 'Rawalpindi' },
    '104': { date: '2025-10-15', city: 'Muzaffarabad' },
    '105': { date: '2026-01-15', city: 'Lahore' },
    '106': { date: '2026-04-15', city: 'Hyderabad' },
    '107': { date: '2026-07-15', city: 'Quetta' },
    '108': { date: '2026-10-15', city: 'Muzaffarabad' },
  },
  '1500': {
    '97': { date: '2024-02-15', city: 'Lahore' },
    '98': { date: '2024-05-15', city: 'Karachi' },
    '99': { date: '2024-08-15', city: 'Multan' },
    '100': { date: '2024-11-15', city: 'Rawalpindi' },
    '101': { date: '2025-02-17', city: 'Multan' },
    '102': { date: '2025-05-15', city: 'Karachi' },
    '103': { date: '2025-08-15', city: 'Faisalabad' },
    '104': { date: '2025-11-17', city: 'Rawalpindi' },
    '105': { date: '2026-02-16', city: 'Lahore' },
    '106': { date: '2026-05-15', city: 'Sialkot' },
    '107': { date: '2026-08-15', city: 'Faisalabad' },
    '108': { date: '2026-11-16', city: 'Rawalpindi' },
  },
  '25000': {
    '13': { date: '2024-03-11', city: 'Peshawar' },
    '14': { date: '2024-06-10', city: 'Hyderabad' },
    '15': { date: '2024-09-10', city: 'Lahore' },
    '16': { date: '2024-12-10', city: 'Quetta' },
    '17': { date: '2025-03-10', city: 'Rawalpindi' },
    '18': { date: '2025-06-10', city: 'Faisalabad' },
    '19': { date: '2025-09-10', city: 'Multan' },
    '20': { date: '2025-12-10', city: 'Karachi' },
    '21': { date: '2026-03-10', city: 'Peshawar' },
    '22': { date: '2026-06-10', city: 'Karachi' },
    '23': { date: '2026-09-10', city: 'Islamabad' },
    '24': { date: '2026-12-10', city: 'Quetta' },
  },
  '40000': {
    '28': { date: '2024-03-11', city: 'Peshawar' },
    '29': { date: '2024-06-10', city: 'Hyderabad' },
    '30': { date: '2024-09-10', city: 'Lahore' },
    '31': { date: '2024-12-10', city: 'Quetta' },
    '32': { date: '2025-03-10', city: 'Rawalpindi' },
    '33': { date: '2025-06-10', city: 'Faisalabad' },
    '34': { date: '2025-09-10', city: 'Multan' },
    '35': { date: '2025-12-10', city: 'Karachi' },
    '36': { date: '2026-03-10', city: 'Peshawar' },
    '37': { date: '2026-06-10', city: 'Rawalpindi' },
    '38': { date: '2026-09-10', city: 'Lahore' },
    '39': { date: '2026-12-10', city: 'Sialkot' },
  },
};

function extractCityFromText(headerText: string, fileName: string): string | null {
  const combined = `${headerText} ${fileName}`.toLowerCase();
  for (const c of SBP_CITIES) {
    if (combined.includes(c.toLowerCase())) {
      return c;
    }
  }
  if (combined.includes('rwp')) return 'Rawalpindi';
  if (combined.includes('lhr')) return 'Lahore';
  if (combined.includes('khi')) return 'Karachi';
  if (combined.includes('fsd')) return 'Faisalabad';
  if (combined.includes('mul')) return 'Multan';
  if (combined.includes('pes')) return 'Peshawar';
  if (combined.includes('qta')) return 'Quetta';
  if (combined.includes('hyd')) return 'Hyderabad';
  if (combined.includes('mzd')) return 'Muzaffarabad';
  return null;
}

function extractDateFromText(headerText: string, fileName: string): string | null {
  // 1. Matches DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dateMatch = headerText.match(/(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})/);
  if (dateMatch) {
    const d = dateMatch[1].padStart(2, '0');
    const m = dateMatch[2].padStart(2, '0');
    const y = dateMatch[3];
    return `${y}-${m}-${d}`;
  }

  // 2. Matches from filename
  const fnMatch = fileName.match(/(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})/);
  if (fnMatch) {
    const d = fnMatch[1].padStart(2, '0');
    const m = fnMatch[2].padStart(2, '0');
    const y = fnMatch[3];
    return `${y}-${m}-${d}`;
  }

  // 3. Month names e.g. "15-May-2024" or "May-2026"
  const monthMap: Record<string, string> = {
    jan: '01',
    feb: '02',
    mar: '03',
    apr: '04',
    may: '05',
    jun: '06',
    jul: '07',
    aug: '08',
    sep: '09',
    oct: '10',
    nov: '11',
    dec: '12',
  };
  const monthRegex = /(\d{1,2})?[-_\s]?([A-Za-z]{3,9})[-_\s]?(\d{4})/;
  const mMatch = `${headerText} ${fileName}`.match(monthRegex);
  if (mMatch) {
    const mStr = mMatch[2].toLowerCase().substring(0, 3);
    if (monthMap[mStr]) {
      const day = (mMatch[1] || '15').padStart(2, '0');
      const year = mMatch[3];
      return `${year}-${monthMap[mStr]}-${day}`;
    }
  }

  // 4. Compact 6-digit in filename e.g. 100_170826 -> 2026-08-17
  const sixDigit = fileName.match(/_(\d{2})(\d{2})(\d{2})\./);
  if (sixDigit) {
    const day = sixDigit[1];
    const month = sixDigit[2];
    const year = `20${sixDigit[3]}`;
    return `${year}-${month}-${day}`;
  }

  return null;
}

function extractDrawNumberFromText(headerText: string, fileName: string): string | null {
  const match =
    headerText.match(/Draw\s*No\.?\s*:?\s*(\d+)/i) ||
    headerText.match(/(\d+)(?:st|nd|rd|th)?\s*Draw/i) ||
    headerText.match(/^(\d+)(?:st|nd|rd|th)?\s*draw/im) ||
    headerText.match(/Draw\s*-\s*Result\s*-\s*\d+\s*-\s*(\d+)/i) ||
    headerText.match(/[–-]\s*(\d+)(?:st|nd|rd|th)?\s*Draw/i);
  if (match) return match[1];

  const fnMatch =
    fileName.match(/(\d+)(?:st|nd|rd|th)?-?draw/i) || fileName.match(/^(\d+)-/);
  if (fnMatch) return fnMatch[1];
  return null;
}

// In-Memory parsed draws cache keyed by denomination
const drawsCache: Record<string, ParsedDraw[]> = {};

export function getParsedDrawsForDenom(denomination: string): ParsedDraw[] {
  if (drawsCache[denomination]) {
    return drawsCache[denomination];
  }

  const folderPath = path.join(process.cwd(), 'prize-bond-data', denomination);
  if (!fs.existsSync(folderPath)) {
    return [];
  }

  const files = fs.readdirSync(folderPath);
  const parsedDraws: ParsedDraw[] = [];

  for (const file of files) {
    if (!file.endsWith('.txt')) continue;

    try {
      const filePath = path.join(folderPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);

      const headerText = lines.slice(0, 35).join('\n');
      let drawNumberStr = extractDrawNumberFromText(headerText, file);
      let city = extractCityFromText(headerText, file);
      let drawDate = extractDateFromText(headerText, file);

      // Check fallback lookup if city or date is missing
      if (
        drawNumberStr &&
        DRAW_SCHEDULE_LOOKUP[denomination] &&
        DRAW_SCHEDULE_LOOKUP[denomination][drawNumberStr]
      ) {
        const fallback = DRAW_SCHEDULE_LOOKUP[denomination][drawNumberStr];
        if (!city) city = fallback.city;
        if (!drawDate) drawDate = fallback.date;
      }

      const drawNumber = parseInt(drawNumberStr || '1', 10);
      const finalCity = city || 'Pakistan';
      const finalDate = drawDate || '2024-01-01';

      // Parse Winning Numbers Sections
      const firstPrizes = new Set<string>();
      const secondPrizes = new Set<string>();
      const thirdPrizes = new Set<string>();

      let currentSection: 'FIRST' | 'SECOND' | 'THIRD' | '' = '';

      for (const line of lines) {
        const lower = line.toLowerCase();
        if (lower.includes('first prize') || lower.includes('1st prize')) {
          currentSection = 'FIRST';
          continue;
        } else if (lower.includes('second prize') || lower.includes('2nd prize')) {
          currentSection = 'SECOND';
          continue;
        } else if (
          lower.includes('third prize') ||
          lower.includes('3rd prize') ||
          /prize\(s\)\s+of/i.test(line) ||
          /\d+\s+prizes?\s+of/i.test(line) ||
          /prizes?\s+of\s+rs/i.test(line)
        ) {
          currentSection = 'THIRD';
          continue;
        }

        const numbers = line.split(/[\s\t,]+/).filter((n) => /^\d{5,6}$/.test(n));
        for (const num of numbers) {
          const padded = num.padStart(6, '0');
          if (currentSection === 'FIRST') firstPrizes.add(padded);
          else if (currentSection === 'SECOND') secondPrizes.add(padded);
          else if (currentSection === 'THIRD') thirdPrizes.add(padded);
        }
      }

      const prizeConfig = OFFICIAL_PRIZE_STRUCTURES[denomination] || OFFICIAL_PRIZE_STRUCTURES['1500'];

      parsedDraws.push({
        id: `${denomination}-${drawNumber}-${finalDate}`,
        denomination,
        drawNumber,
        drawDate: finalDate,
        city: finalCity,
        firstPrizes,
        secondPrizes,
        thirdPrizes,
        firstAmount: prizeConfig.first.amount,
        secondAmount: prizeConfig.second.amount,
        thirdAmount: prizeConfig.third.amount,
        fileName: file,
      });
    } catch (err) {
      console.error(`Error reading prize bond file ${file}:`, err);
    }
  }

  // Sort draws descending by drawDate (most recent first)
  parsedDraws.sort((a, b) => {
    if (a.drawDate === b.drawDate) return b.drawNumber - a.drawNumber;
    return b.drawDate.localeCompare(a.drawDate);
  });

  drawsCache[denomination] = parsedDraws;
  return parsedDraws;
}

export interface SearchOptions {
  denomination: DenominationValue;
  numbers: string[];
  drawScope?: 'latest' | 'all' | 'specific';
  selectedYearFilter?: string;
  selectedDrawId?: string;
}

export function searchPrizeBonds(options: SearchOptions): CheckerResultItem[] {
  const {
    denomination,
    numbers,
    drawScope = 'all',
    selectedYearFilter,
    selectedDrawId,
  } = options;

  const allDraws = getParsedDrawsForDenom(denomination);
  if (allDraws.length === 0) {
    return numbers.map((n) => ({
      bondNumber: n.padStart(6, '0'),
      denomination,
      isWinner: false,
      drawNo: 1,
      drawDate: 'N/A',
      drawCity: 'Pakistan',
    }));
  }

  // Filter draws based on requested scope
  let candidateDraws: ParsedDraw[] = allDraws;
  if (drawScope === 'latest') {
    candidateDraws = [allDraws[0]];
  } else if (drawScope === 'specific') {
    if (selectedDrawId && selectedDrawId !== 'all') {
      const found = allDraws.find(
        (d) =>
          d.id === selectedDrawId ||
          d.fileName === selectedDrawId ||
          String(d.drawNumber) === selectedDrawId
      );
      if (found) candidateDraws = [found];
    } else if (selectedYearFilter) {
      candidateDraws = allDraws.filter((d) => d.drawDate.startsWith(selectedYearFilter));
      if (candidateDraws.length === 0) candidateDraws = allDraws;
    }
  }

  const latestDraw = allDraws[0];
  const prizeConfig = OFFICIAL_PRIZE_STRUCTURES[denomination] || OFFICIAL_PRIZE_STRUCTURES['1500'];

  const results: CheckerResultItem[] = [];

  for (const rawNum of numbers) {
    const clean = rawNum.trim().replace(/\D/g, '');
    if (!clean) continue;
    const padded = clean.padStart(6, '0');

    let winningMatch: {
      draw: ParsedDraw;
      category: '1st Prize' | '2nd Prize' | '3rd Prize';
      amount: number;
      amountFormatted: string;
    } | null = null;

    for (const draw of candidateDraws) {
      if (draw.firstPrizes.has(padded)) {
        winningMatch = {
          draw,
          category: '1st Prize',
          amount: draw.firstAmount,
          amountFormatted: prizeConfig.first.formatted,
        };
        break;
      }
      if (draw.secondPrizes.has(padded)) {
        winningMatch = {
          draw,
          category: '2nd Prize',
          amount: draw.secondAmount,
          amountFormatted: prizeConfig.second.formatted,
        };
        break;
      }
      if (draw.thirdPrizes.has(padded)) {
        winningMatch = {
          draw,
          category: '3rd Prize',
          amount: draw.thirdAmount,
          amountFormatted: prizeConfig.third.formatted,
        };
        break;
      }
    }

    if (winningMatch) {
      results.push({
        bondNumber: padded,
        denomination,
        isWinner: true,
        prizeCategory: winningMatch.category,
        prizeAmount: winningMatch.amount,
        prizeAmountFormatted: winningMatch.amountFormatted,
        drawNo: winningMatch.draw.drawNumber,
        drawDate: winningMatch.draw.drawDate,
        drawCity: winningMatch.draw.city,
        matchedDrawId: winningMatch.draw.id,
      });
    } else {
      results.push({
        bondNumber: padded,
        denomination,
        isWinner: false,
        drawNo: latestDraw.drawNumber,
        drawDate: latestDraw.drawDate,
        drawCity: latestDraw.city,
      });
    }
  }

  return results;
}
