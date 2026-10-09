import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const denom = searchParams.get('denom');
  const date = searchParams.get('date');

  if (!denom || !date) {
    return new NextResponse('Missing parameters', { status: 400 });
  }

  try {
    const targetDir = path.join(process.cwd(), 'prize-bond-data', denom);
    
    if (!fs.existsSync(targetDir)) {
      return new NextResponse('Denomination folder not found.', { status: 404 });
    }

    const files = fs.readdirSync(targetDir);
    const matchedFile = files.find((file) => file.includes(date));

    if (!matchedFile) {
      return new NextResponse('Official TXT gazette file not found for this date.', { status: 404 });
    }

    const filePath = path.join(targetDir, matchedFile);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Plain text return karein taake frontend asani se read kar sake
    return new NextResponse(fileContent, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    return new NextResponse('Internal server error while reading gazette file.', { status: 500 });
  }
}