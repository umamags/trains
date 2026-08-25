const fs = require('fs');
const path = require('path');

const CHAPTERS_DIR = '.';
const OUTPUT_DIR = 'public/data';
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'chapters.json');

// Copy Appendix folder to public for deployment
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

const APPENDIX_SRC = 'Appendix';
const APPENDIX_DEST = 'public/Appendix';

if (fs.existsSync(APPENDIX_SRC)) {
  copyDir(APPENDIX_SRC, APPENDIX_DEST);
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Find all Chapter *.md files
const files = fs.readdirSync(CHAPTERS_DIR)
  .filter(file => file.match(/^Chapter\s+\d+\s*-/i) && file.endsWith('.md'))
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  });

const chapters = files.map((file, index) => {
  const filePath = path.join(CHAPTERS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract chapter number from filename
  const chapterNum = parseInt(file.match(/\d+/)[0]);

  // Extract title from filename (remove "Chapter X - " prefix)
  const title = file.replace(/^Chapter\s+\d+\s*-\s*/, '').replace(/\.md$/, '');

  // Count words
  const wordCount = content.trim().split(/\s+/).length;

  return {
    id: chapterNum,
    title: title,
    filename: file,
    content: content,
    wordCount: wordCount,
    order: index + 1
  };
});

// Create the output JSON
const output = {
  chapters: chapters,
  generatedAt: new Date().toISOString(),
  totalChapters: chapters.length
};

// Write to file
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

console.log(`✓ Generated ${OUTPUT_FILE} with ${chapters.length} chapters`);
console.log(`✓ Copied Appendix folder to ${APPENDIX_DEST}`);
