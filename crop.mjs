import sharp from 'sharp';

async function generateFavicon() {
  try {
    const inputPath = './Data/6.png';
    const pngFaviconPath = './Data/favicon.png';
    
    // We assume the original image is 500x500
    // The "P" logo is typically centered, and the text is at the bottom.
    // Let's crop x:125, y:50, w:250, h:250
    // This forms a perfect square covering the "P" and the silhouette!
    
    await sharp(inputPath)
      .extract({ 
         left: 125, 
         top: 50, 
         width: 250, 
         height: 300
      })
      .resize(256, 256, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // transparent background
      })
      .toFile(pngFaviconPath);
      
    console.log(`Generated favicon at ${pngFaviconPath}`);
  } catch (err) {
    console.error('Error:', err);
  }
}

generateFavicon();
