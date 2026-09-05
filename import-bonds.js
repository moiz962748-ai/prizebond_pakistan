const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yprybofxbbqqulmpydtq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DATA_FOLDER = path.join(__dirname, 'prize-bond-data');

function parsePrizeBondText(rawText, fileName = "") {
  const lines = rawText.split('\n').map(line => line.trim()).filter(Boolean);
  
  let denomination = "";
  let drawNumber = "";
  let drawDate = "";
  let firstPrize = [];
  let secondPrizes = [];
  let thirdPrizes = [];
  
  let currentSection = "";
  
  for (let line of lines) {
    // Denomination & Draw Number detect karna
    if (line.includes("Draw Result of") || line.includes("DENOMINATION") || line.includes("Draw") || line.includes("DRAW OF")) {
      const matchDenom = line.match(/(?:Rs\.?|\b)\s*(\d+)\/?-?\s*(?:Denomination|PRIZE BOND)?/i);
      const matchDraw = line.match(/(\d+)(?:st|nd|rd|th)?\s*Draw/i) || line.match(/Draw\s*No\.?\s*:\s*(\d+)/i);
      if (matchDenom && !denomination) denomination = matchDenom[1];
      if (matchDraw && !drawNumber) drawNumber = matchDraw[1];
    } 

    // Date detect karna (e.g. Date : 15/07/2020 ya 15-07-2020)
    if (!drawDate && (line.includes("Date") || line.includes("HELD ON"))) {
      const dateMatch = line.match(/(\d{2})[-\/](\d{2})[-\/](\d{4})/);
      if (dateMatch) {
        drawDate = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`; // YYYY-MM-DD format for database
      }
    }
    
    if (line.includes("First Prize") || line.toLowerCase().includes("1st prize")) {
      currentSection = "FIRST";
      continue;
    } else if (line.includes("Second Prize") || line.toLowerCase().includes("2nd prize")) {
      currentSection = "SECOND";
      continue;
    } else if (line.includes("Third Prize") || line.toLowerCase().includes("3rd prize")) {
      currentSection = "THIRD";
      continue;
    } 
    
    const numbers = line.split(/\s+/).filter(n => /^\d{5,6}$/.test(n));
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

  // Fallback: Agar text ya filename se date na mile toh filename se nikal lo
  if (!drawDate) {
    const fileDateMatch = fileName.match(/(\d{2})[-\/](\d{2})[-\/](\d{4})/);
    if (fileDateMatch) {
      drawDate = `${fileDateMatch[3]}-${fileDateMatch[2]}-${fileDateMatch[1]}`;
    } else {
      drawDate = '2020-01-01'; // Default fallback
    }
  }

  if (!drawNumber) {
    const fileMatch = fileName.match(/(\d+)(?:st|nd|rd|th)?-?draw/i) || fileName.match(/^(\d+)-/);
    if (fileMatch) drawNumber = fileMatch[1];
  }

  return {
    denomination,
    drawNumber,
    drawDate,
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

    // Folder name se default denomination uthana (e.g. "750" ya folder name)
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

      // Insert into 'draws' with actual correct date and denomination
      const { data: drawRecord, error: drawError } = await supabase
        .from('draws')
        .insert({
          denomination: finalDenom,
          draw_number: parseInt(parsedData.drawNumber),
          draw_date: parsedData.drawDate
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