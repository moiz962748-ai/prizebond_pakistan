const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yprybofxbbqqulmpydtq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DATA_FOLDER = path.join(__dirname, 'prize-bond-data');

const SBP_CITIES = [
  'Karachi', 'Lahore', 'Rawalpindi', 'Faisalabad', 'Multan',
  'Peshawar', 'Quetta', 'Hyderabad', 'Muzaffarabad', 'Sialkot',
  'Islamabad', 'Bahawalpur', 'Gujranwala', 'Sukkur'
];

function cleanCityName(rawText) {
  const lower = (rawText || '').toLowerCase();
  for (const c of SBP_CITIES) {
    if (lower.includes(c.toLowerCase())) return c;
  }
  if (lower.includes('rwp')) return 'Rawalpindi';
  if (lower.includes('lhr')) return 'Lahore';
  if (lower.includes('fsd')) return 'Faisalabad';
  if (lower.includes('mul')) return 'Multan';
  if (lower.includes('pes')) return 'Peshawar';
  if (lower.includes('qta')) return 'Quetta';
  if (lower.includes('hyd')) return 'Hyderabad';
  if (lower.includes('mzd')) return 'Muzaffarabad';
  return 'Pakistan';
}

function parsePrizeBondText(rawText, fileName = "") {
  const lines = rawText.split('\n').map(line => line.trim()).filter(Boolean);
  
  let denomination = "";
  let drawNumber = "";
  let drawDate = "";
  let city = "";
  let firstPrize = [];
  let secondPrizes = [];
  let thirdPrizes = [];
  
  let currentSection = "";
  
  for (let i = 0; i < Math.min(lines.length, 35); i++) {
    const line = lines[i];

    // City detect karna
    if (!city || city === 'Pakistan') {
      const cityMatch = line.match(/(?:HELD\s+(?:AT|ON)|at\s+SBP\s*\(BSC\)|DRAW\s+AT)\s+([A-Za-z\s]+)/i);
      if (cityMatch) {
        city = cleanCityName(cityMatch[1]);
      }
    }

    // Denomination & Draw Number detect karna
    if (line.includes("Draw Result of") || line.includes("DENOMINATION") || line.includes("Draw") || line.includes("DRAW OF")) {
      const matchDenom = line.match(/(?:Rs\.?|\b)\s*(\d+)\/?-?\s*(?:Denomination|PRIZE BOND)?/i);
      const matchDraw = line.match(/(\d+)(?:st|nd|rd|th)?\s*Draw/i) || line.match(/Draw\s*No\.?\s*:\s*(\d+)/i);
      if (matchDenom && !denomination) denomination = matchDenom[1];
      if (matchDraw && !drawNumber) drawNumber = matchDraw[1];
    } 

    // Date detect karna
    if (!drawDate) {
      const dateMatch = line.match(/(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})/);
      if (dateMatch) {
        const d = dateMatch[1].padStart(2, '0');
        const m = dateMatch[2].padStart(2, '0');
        const y = dateMatch[3];
        drawDate = `${y}-${m}-${d}`;
      }
    }
  }

  // Fallback from filename
  if (!city || city === 'Pakistan') {
    city = cleanCityName(fileName);
  }

  if (!drawDate) {
    const fileDateMatch = fileName.match(/(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})/);
    if (fileDateMatch) {
      const d = fileDateMatch[1].padStart(2, '0');
      const m = fileDateMatch[2].padStart(2, '0');
      const y = fileDateMatch[3];
      drawDate = `${y}-${m}-${d}`;
    } else {
      drawDate = '2024-01-01'; // Default fallback
    }
  }

  if (!drawNumber) {
    const fileMatch = fileName.match(/(\d+)(?:st|nd|rd|th)?-?draw/i) || fileName.match(/^(\d+)-/);
    if (fileMatch) drawNumber = fileMatch[1];
  }

  // Section parsing for winning numbers
  for (let line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes("first prize") || lower.includes("1st prize")) {
      currentSection = "FIRST";
      continue;
    } else if (lower.includes("second prize") || lower.includes("2nd prize")) {
      currentSection = "SECOND";
      continue;
    } else if (
      lower.includes("third prize") || 
      lower.includes("3rd prize") || 
      /prize\(s\)\s+of/i.test(line) ||
      /\d+\s+prizes?\s+of/i.test(line) ||
      /prizes?\s+of\s+rs/i.test(line)
    ) {
      currentSection = "THIRD";
      continue;
    } 
    
    const numbers = line.split(/[\s\t,]+/).filter(n => /^\d{5,6}$/.test(n));
    if (numbers.length > 0) {
      if (currentSection === "FIRST") {
        firstPrize.push(...numbers);
      } else if (currentSection === "SECOND") {
        secondPrizes.push(...numbers);
      } else if (currentSection === "THIRD") {
        thirdPrizes.push(...numbers);
      }
    }
  }

  return {
    denomination,
    drawNumber,
    drawDate,
    city: city || 'Pakistan',
    firstPrize,
    secondPrizes,
    thirdPrizes
  };
}

async function importAllData() {
  if (!fs.existsSync(DATA_FOLDER)) {
    console.error("Error: 'prize-bond-data' folder nahi mila!");
    return;
  }

  const denominations = fs.readdirSync(DATA_FOLDER);

  for (const denomFolder of denominations) {
    const denomPath = path.join(DATA_FOLDER, denomFolder);
    if (!fs.statSync(denomPath).isDirectory()) continue;

    const folderDenom = denomFolder.replace(/\D/g, '') || denomFolder;

    console.log(`Processing Denomination Folder: Rs. ${denomFolder}`);
    const files = fs.readdirSync(denomPath);

    for (const file of files) {
      if (!file.endsWith('.txt')) continue;

      const filePath = path.join(denomPath, file);
      const rawText = fs.readFileSync(filePath, 'utf-8');

      const parsedData = parsePrizeBondText(rawText, file);
      if (!parsedData.drawNumber) {
        continue;
      }

      const finalDenom = parseInt(parsedData.denomination || folderDenom);

      // Insert into 'draws' with actual correct date, city, and denomination
      const { data: drawRecord, error: drawError } = await supabase
        .from('draws')
        .insert({
          denomination: finalDenom,
          draw_number: parseInt(parsedData.drawNumber),
          draw_date: parsedData.drawDate,
          city: parsedData.city
        })
        .select()
        .single();

      if (drawError) {
        console.error(`Error inserting draw for ${file}:`, drawError.message);
        continue;
      }

      const drawId = drawRecord.id;
      const allBondsToInsert = [];

      parsedData.firstPrize.forEach(num => {
        allBondsToInsert.push({ draw_id: drawId, bond_number: num, prize_type: 'first' });
      });

      parsedData.secondPrizes.forEach(num => {
        allBondsToInsert.push({ draw_id: drawId, bond_number: num, prize_type: 'second' });
      });

      parsedData.thirdPrizes.forEach(num => {
        allBondsToInsert.push({ draw_id: drawId, bond_number: num, prize_type: 'third' });
      });

      const chunkSize = 500;
      for (let i = 0; i < allBondsToInsert.length; i += chunkSize) {
        const chunk = allBondsToInsert.slice(i, i + chunkSize);
        await supabase.from('prize_bonds').insert(chunk);
      }

      console.log(`Imported: ${file} (Denom: ${finalDenom}, Date: ${parsedData.drawDate}, Bonds: ${allBondsToInsert.length})`);
    }
  }
  console.log("All data re-imported successfully with correct dates and denominations!");
}

importAllData();