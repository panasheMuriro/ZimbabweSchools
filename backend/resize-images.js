// resize-images.js
import fs from "fs";
import path from "path";
import sharp from "sharp";


const inputDir = "../EmbroideredLogos";
const outputDir = "../EmbroideredLogosOptimized";

// Create output dir if not exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Process all images
fs.readdirSync(inputDir).forEach(async (file) => {
  const ext = path.extname(file).toLowerCase();
  if (![".png", ".jpg", ".jpeg", ".webp"].includes(ext)) return;

  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(
    outputDir,
    file.replace(/\s+/g, "_").toLowerCase() // clean file name
  );

  try {
    await sharp(inputPath)
      .resize({ width: 800 }) // ✅ resize to max width 400px (adjust as needed)
      .toFormat("jpg", { quality: 100 }) // ✅ compress & save as WebP
      .toFile(outputPath);

    console.log(`Optimized: ${outputPath}`);
  } catch (err) {
    console.error(`Failed: ${file}`, err);
  }
});
