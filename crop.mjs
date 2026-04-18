import sharp from 'sharp';

async function generateFavicon() {
  try {
    const inputPath = './Data/6.png';
    const pngFaviconPath = './Data/favicon.png';
    
    // We discovered the exact bounding box of the logo elements.
    // Content starts at Y: 111, X: 47. 
    // Total width is 408. Center X is 47 + 204 = 251.
    // We grab a 200x200 square right from the top center!
    const extractedBuffer = await sharp(inputPath)
      .extract({ 
         left: 151,  // 251 (center) - 100
         top: 111,   // Absolute top boundary from trim
         width: 200, 
         height: 200 // Grab top 200px (ignores the text below)
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
      { input: extractedBuffer } // Drop the perfectly cropped logo in
    ])
    .toFile(pngFaviconPath);
      
    console.log(`Generated flattened solid background favicon at ${pngFaviconPath}`);
  } catch (err) {
    console.error('Error:', err);
  }
}

generateFavicon();
