const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './images';

// Get all image files
const imageFiles = fs.readdirSync(inputDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
});

console.log(`Found ${imageFiles.length} images to compress aggressively...\n`);

// More aggressive compression settings
const compressionOptions = {
    // Hero images and large files - very aggressive
    hero: { quality: 65, progressive: true },
    // Regular images - moderate compression
    regular: { quality: 75, progressive: true },
    // Small images - light compression
    small: { quality: 80, progressive: true }
};

// Process each image
let processed = 0;
let totalOriginalSize = 0;
let totalCompressedSize = 0;

imageFiles.forEach(async (file, index) => {
    const inputPath = path.join(inputDir, file);
    const outputPath = inputPath; // Overwrite original
    
    try {
        // Get original file size
        const originalStats = fs.statSync(inputPath);
        const originalSize = originalStats.size;
        totalOriginalSize += originalSize;
        
        // Determine compression level based on file name and size
        let quality;
        const isHero = file.includes('hero') || file.includes('day-one') || file.includes('day-two') || file.includes('day-three');
        const isLarge = originalSize > 1024 * 1024; // > 1MB
        
        if (isHero || isLarge) {
            quality = compressionOptions.hero;
            console.log(`🎯 Aggressive compression for: ${file}`);
        } else if (originalSize > 500 * 1024) { // > 500KB
            quality = compressionOptions.regular;
            console.log(`📦 Moderate compression for: ${file}`);
        } else {
            quality = compressionOptions.small;
            console.log(`✨ Light compression for: ${file}`);
        }
        
        // Create temp file
        const tempPath = inputPath + '.tmp';
        
        // Compress image
        await sharp(inputPath)
            .jpeg(quality)
            .toFile(tempPath);
        
        // Get compressed file size
        const compressedStats = fs.statSync(tempPath);
        const compressedSize = compressedStats.size;
        totalCompressedSize += compressedSize;
        
        // Replace original with compressed
        fs.unlinkSync(inputPath);
        fs.renameSync(tempPath, inputPath);
        
        const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
        
        console.log(`  Original: ${(originalSize / 1024).toFixed(2)} KB`);
        console.log(`  Compressed: ${(compressedSize / 1024).toFixed(2)} KB`);
        console.log(`  Reduction: ${reduction}%\n`);
        
        processed++;
        
        // Show summary when all images are processed
        if (processed === imageFiles.length) {
            console.log('═══════════════════════════════════════');
            console.log('AGGRESSIVE COMPRESSION SUMMARY');
            console.log('═══════════════════════════════════════');
            console.log(`Total images processed: ${processed}`);
            console.log(`Original total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`Compressed total size: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`Total reduction: ${((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(2)}%`);
            console.log(`Space saved: ${((totalOriginalSize - totalCompressedSize) / 1024 / 1024).toFixed(2)} MB`);
            console.log('═══════════════════════════════════════');
            console.log('\n✅ Images have been compressed and replaced!');
            console.log('⚠️  Original images were overwritten (no backup)');
        }
        
    } catch (error) {
        console.error(`✗ Error compressing ${file}:`, error.message);
    }
});
