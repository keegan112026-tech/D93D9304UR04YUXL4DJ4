const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function extractDocxText(docxPath, outputPath) {
  try {
    const tempZip = path.join(process.cwd(), 'temp_archive.zip');
    const tempDir = path.join(process.cwd(), 'tmp_docx_extract');
    
    // 1. Copy docx to .zip
    fs.copyFileSync(docxPath, tempZip);
    
    // 2. Unzip
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const unzipCmd = `Expand-Archive -Path "${tempZip}" -DestinationPath "${tempDir}" -Force`;
    execSync(`powershell -Command "${unzipCmd}"`);
    
    // 3. Read word/document.xml
    const xmlPath = path.join(tempDir, 'word', 'document.xml');
    if (fs.existsSync(xmlPath)) {
      const xmlContent = fs.readFileSync(xmlPath, 'utf8');
      const textMatches = xmlContent.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
      const text = textMatches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
      fs.writeFileSync(outputPath, text, 'utf8');
      console.log(`Extracted text to ${outputPath}`);
    }
    
    // Clean up
    fs.unlinkSync(tempZip);
    execSync(`powershell -Command "Remove-Item -Path '${tempDir}' -Recurse -Force"`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

const target = 'c:/Users/User/OneDrive/Desktop/網站雛型/補充.docx';
const output = 'c:/Users/User/OneDrive/Desktop/網站雛型/補充_text.txt';
extractDocxText(target, output);
