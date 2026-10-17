import { NextResponse } from 'next/server';
import { searchPrizeBonds, SearchOptions } from '@/lib/prizeBondParser';
import { DenominationValue } from '@/types/prizebond';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      denomination = '1500',
      numbers = [],
      drawScope = 'all',
      selectedYearFilter,
      selectedDrawId,
    } = body;

    if (!Array.isArray(numbers) || numbers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please provide at least one bond number.' },
        { status: 400 }
      );
    }

    // Limit maximum numbers to check in a single request for safety
    if (numbers.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Maximum 500 bond numbers allowed per check.' },
        { status: 400 }
      );
    }

    const options: SearchOptions = {
      denomination: String(denomination) as DenominationValue,
      numbers,
      drawScope,
      selectedYearFilter,
      selectedDrawId,
    };

    const results = searchPrizeBonds(options);

    return NextResponse.json({
      success: true,
      count: results.length,
      winnersCount: results.filter((r) => r.isWinner).length,
      results,
    });
  } catch (error: any) {
    console.error('Error in check-bonds API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
