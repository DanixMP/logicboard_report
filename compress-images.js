const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './images';
const outputDir = './images-compressed';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Get all image files
const imageFiles = fs.readdirSync(inputDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
});

console.log(`Found ${imageFiles.length} images to compress...\n`);

// Compression settings
const compressionOptions = {
    jpeg: { quality: 80, progressive: true },
    png: { quality: 80, compressionLevel: 9 },
    webp: { quality: 80 }
};

// Process each image
let processed = 0;
let totalOriginalSize = 0;
let totalCompressedSize = 0;

imageFiles.forEach(async (file, index) => {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    
    try {
        // Get original file size
        const originalStats = fs.statSync(inputPath);
        const originalSize = originalStats.size;
        totalOriginalSize += originalSize;
        
        // Compress image
        const ext = path.extname(file).toLowerCase();
        let sharpInstance = sharp(inputPath);
        
        if (ext === '.jpg' || ext === '.jpeg') {
            await sharpInstance.jpeg(compressionOptions.jpeg).toFile(outputPath);
        } else if (ext === '.png') {
            await sharpInstance.png(compressionOptions.png).toFile(outputPath);
        } else if (ext === '.webp') {
            await sharpInstance.webp(compressionOptions.webp).toFile(outputPath);
        }
        
        // Get compressed file size
        const compressedStats = fs.statSync(outputPath);
        const compressedSize = compressedStats.size;
        totalCompressedSize += compressedSize;
        
        const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
        
        console.log(`✓ ${file}`);
        console.log(`  Original: ${(originalSize / 1024).toFixed(2)} KB`);
        console.log(`  Compressed: ${(compressedSize / 1024).toFixed(2)} KB`);
        console.log(`  Reduction: ${reduction}%\n`);
        
        processed++;
        
        // Show summary when all images are processed
        if (processed === imageFiles.length) {
            console.log('═══════════════════════════════════════');
            console.log('COMPRESSION SUMMARY');
            console.log('═══════════════════════════════════════');
            console.log(`Total images processed: ${processed}`);
            console.log(`Original total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`Compressed total size: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`Total reduction: ${((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(2)}%`);
            console.log(`Space saved: ${((totalOriginalSize - totalCompressedSize) / 1024 / 1024).toFixed(2)} MB`);
            console.log('═══════════════════════════════════════');
            console.log('\nCompressed images saved to: ./images-compressed/');
            console.log('\nTo use compressed images:');
            console.log('1. Backup your original images folder');
            console.log('2. Delete the images folder');
            console.log('3. Rename images-compressed to images');
        }
        
    } catch (error) {
        console.error(`✗ Error compressing ${file}:`, error.message);
    }
});
