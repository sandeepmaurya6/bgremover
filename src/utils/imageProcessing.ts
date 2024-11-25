import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';

let segmenter: SelfieSegmentation | null = null;

export async function initModel() {
  if (!segmenter) {
    segmenter = new SelfieSegmentation({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
      },
    });

    segmenter.setOptions({
      modelSelection: 1, // 1 for better quality, 0 for faster performance
      selfieMode: false,
    });

    // Initialize the model
    await new Promise((resolve) => {
      if (!segmenter) return;
      segmenter.onResults(() => resolve(true));
      segmenter.initialize();
    });
  }
  return segmenter;
}

export async function removeBackground(
  imageElement: HTMLImageElement,
  canvas: HTMLCanvasElement
): Promise<string> {
  const segmenter = await initModel();
  if (!segmenter) throw new Error('Failed to initialize segmenter');
  
  // Ensure canvas dimensions match image
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  
  // Get segmentation
  const results = await new Promise<{ segmentationMask: CanvasImageSource }>((resolve) => {
    if (!segmenter) return;
    segmenter.onResults((results) => resolve(results));
    segmenter.send({ image: imageElement });
  });

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Create a temporary canvas for the mask
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = canvas.width;
  maskCanvas.height = canvas.height;
  const maskCtx = maskCanvas.getContext('2d');
  if (!maskCtx) throw new Error('Could not get mask canvas context');

  // Draw and process the mask
  maskCtx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
  const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height);

  // Draw original image
  ctx.drawImage(imageElement, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Apply mask
  for (let i = 0; i < maskData.data.length; i += 4) {
    // MediaPipe mask is grayscale, where white (255) represents foreground
    const maskValue = maskData.data[i]; // Red channel is sufficient as it's grayscale
    if (maskValue < 128) { // Threshold to determine background
      imageData.data[i + 3] = 0; // Set alpha to 0 for background
    }
  }

  // Put modified image data back
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL('image/png');
}