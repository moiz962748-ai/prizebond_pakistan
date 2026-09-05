function parsePrizeBondText(rawText) {
  // Lines mein split karein aur extra spaces khatam karein
  const lines = rawText.split('\n').map(line => line.trim()).filter(Boolean);
  
  let denomination = "";
  let drawNumber = "";
  let firstPrize = [];
  let secondPrizes = [];
  let thirdPrizes = [];
  
  let currentSection = "";
  
  for (let line of lines) {
    // Header se denomination aur draw number nikalna
    if (line.includes("Draw Result of Rs.")) {
      const matchDenom = line.match(/Rs\.\s*(\d+)\/-\s*Denomination/i);
      const matchDraw = line.match(/(\d+)(?:st|nd|rd|th)\s*Draw/i);
      if (matchDenom) denomination = matchDenom[1];
      if (matchDraw) drawNumber = matchDraw[1];
    } 
    // Sections detect karna
    else if (line.includes("First Prize of")) {
      currentSection = "FIRST";
    } else if (line.includes("Second Prize of")) {
      currentSection = "SECOND";
    } else if (line.includes("Third Prize of")) {
      currentSection = "THIRD";
    } 
    // Numbers extract karna
    else {
      // Line ke andar jitne bhi numbers spaces se alag hain unhe pakrein
      const numbers = line.split(/\s+/).filter(n => /^\d+$/.test(n));
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
  }
  
  return {
    denomination,
    drawNumber,
    firstPrize,
    secondPrizes,
    thirdPrizes
  };
}