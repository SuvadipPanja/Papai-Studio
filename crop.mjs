import sharp from 'sharp';

async function generateFavicon() {
  try {
    const inputPath = './Data/6.png';
    const pngFaviconPath = './Data/favicon.png';
    
    // 1. Extract the center "P" logo area
    const extractedBuffer = await sharp(inputPath)
      .extract({ 
         left: 125, 
         top: 20, 
         width: 250, 
         height: 250
      })
      .toBuffer();

    // 2. Put it on a solid black Canvas
    await sharp({
      create: {
        width: 256,
        height: 256,
        channels: 4,
        background: { r: 10, g: 10, b: 10, alpha: 1 } // Solid Dark Grey
      }
    })
    .composite([
      { input: extractedBuffer } // The transparent PNG logo will be drawn exactly over the solid black background
    ])
    .toFile(pngFaviconPath);
      
    console.log(`Generated flattened solid background favicon at ${pngFaviconPath}`);
  } catch (err) {
    console.error('Error:', err);
  }
}

generateFavicon();
