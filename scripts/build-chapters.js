const fs = require('fs');
const path = require('path');

const MAIN_CHAPTERS_DIR = 'src/main_chapters';
const OTHER_CHAPTERS_DIR = 'src/other_chapters';
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

// Function to read chapters from a directory
function readChaptersFromDir(dirPath, category) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs.readdirSync(dirPath)
    .filter(file => file.match(/^Chapter\s+\d+\s*-/i) && file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(dirPath, file);
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
        category: category
      };
    });
}

// Read chapters from both directories
const mainChapters = readChaptersFromDir(MAIN_CHAPTERS_DIR, 'main');
const otherChapters = readChaptersFromDir(OTHER_CHAPTERS_DIR, 'other');

// Combine and sort all chapters
const allChapters = [...mainChapters, ...otherChapters]
  .sort((a, b) => a.id - b.id)
  .map((chapter, index) => ({
    ...chapter,
    order: index + 1
  }));

// Create the output JSON
const output = {
  chapters: allChapters,
  mainChapters: mainChapters.sort((a, b) => a.id - b.id),
  otherChapters: otherChapters.sort((a, b) => a.id - b.id),
  generatedAt: new Date().toISOString(),
  totalChapters: allChapters.length
};

// Write to file
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

console.log(`✓ Generated ${OUTPUT_FILE} with ${allChapters.length} chapters`);
console.log(`  - Main chapters (1-8): ${mainChapters.length}`);
console.log(`  - Other chapters (9-10): ${otherChapters.length}`);
console.log(`✓ Copied Appendix folder to ${APPENDIX_DEST}`);
