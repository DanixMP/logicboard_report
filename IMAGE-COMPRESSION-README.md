# Image Compression Guide

This project includes an automated image compression tool to optimize your images for web performance.

## 🚀 Quick Start

Run the compression script:

```bash
npm run compress
```

## 📋 What It Does

The script will:
- ✅ Compress all JPG, JPEG, PNG, and WebP images in the `images/` folder
- ✅ Save compressed versions to `images-compressed/` folder
- ✅ Show detailed compression statistics for each image
- ✅ Maintain image quality at 80% (good balance between quality and size)
- ✅ Use progressive JPEG encoding for faster loading

## 📊 Compression Settings

- **JPEG Quality:** 80% (progressive)
- **PNG Quality:** 80% (compression level 9)
- **WebP Quality:** 80%

## 🔧 How to Use Compressed Images

After running the compression:

1. **Backup your originals** (optional but recommended):
   ```bash
   rename images images-original
   ```

2. **Use compressed images**:
   ```bash
   rename images-compressed images
   ```

3. **Test your website** to ensure images look good

4. **Commit and push** the optimized images:
   ```bash
   git add images/
   git commit -m "Optimize images for web performance"
   git push
   ```

## 📈 Expected Results

Typical compression results:
- **JPG images:** 30-60% size reduction
- **PNG images:** 20-50% size reduction
- **Overall:** Faster page load times and better performance

## ⚙️ Customization

To adjust compression quality, edit `compress-images.js`:

```javascript
const compressionOptions = {
    jpeg: { quality: 80, progressive: true },  // Change quality (1-100)
    png: { quality: 80, compressionLevel: 9 },
    webp: { quality: 80 }
};
```

## 🛠️ Requirements

- Node.js (v14 or higher)
- npm packages: `sharp` (automatically installed)

## 📝 Notes

- Original images are never modified
- Compressed images are saved to a separate folder
- You can run the script multiple times safely
- The script shows detailed statistics for each image
