import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const denomination = searchParams.get('denom'); // e.g. "100"
  const date = searchParams.get('date'); // e.g. "2024-05-15"

  if (!denomination || !date) {
    return NextResponse.json({ error: 'Missing denomination or date' }, { status: 400 });
  }

  try {
    const folderPath = path.join(process.cwd(), 'prize-bond-data', denomination);

    if (!fs.existsSync(folderPath)) {
      return new NextResponse(`Denomination folder (${denomination}) not found`, { status: 404 });
    }

    const files = fs.readdirSync(folderPath);

    // Date ke alag-alag formats bana lete hain taake match karne mein asani ho
    // Misal ke taur par: "2024-05-15" se banega "15-05-2024", "15-05-24", "20240515" waghera
    const [year, month, day] = date.split('-');
    const formatsToMatch = [
      date, // 2024-05-15
      `${day}-${month}-${year}`, // 15-05-2024
      `${day}-${month}-${year.slice(-2)}`, // 15-05-24
      `${year}${month}${day}`, // 20240515
    ];

    // Aisi file dhoondhein jisme upar diye gaye formats mein se koi bhi date match ho jaye
    const matchedFile = files.find((file) => {
      return formatsToMatch.some((fmt) => file.includes(fmt));
    });

    if (!matchedFile) {
      return new NextResponse(`No matching text file found for date: ${date} under Rs.${denomination}`, { status: 404 });
    }

    const filePath = path.join(folderPath, matchedFile);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}