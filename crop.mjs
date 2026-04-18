import sharp from 'sharp';

async function generateFavicon() {
  try {
    const inputPath = './Data/6.png';
    const pngFaviconPath = './Data/favicon.png';
    
    // Extract the "P" logo from the top-center
    const extractedBuffer = await sharp(inputPath)
      .extract({ 
         left: 140, 
         top: 50, 
         width: 220, 
         height: 220
      })
      .toBuffer();

    // Now put it on a solid black background with padding
    // We resize it to 200x200 padded inside a 256x256 black square
    await sharp(extractedBuffer)
      .resize(200, 200, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } 
      })
      .extend({
        top: 28,
        bottom: 28,
        left: 28,
        right: 28,
        background: { r: 10, g: 10, b: 10, alpha: 1 } // Solid Dark background!
      })
      .toFile(pngFaviconPath);
      
    console.log(`Generated solid background favicon at ${pngFaviconPath}`);
  } catch (err) {
    console.error('Error:', err);
  }
}

generateFavicon();
