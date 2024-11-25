import { useCallback, useRef } from 'react';
import { useStore } from '../store/useStore';
import { removeBackground } from '../utils/imageProcessing';

export function useImageProcessing() {
  const { setProcessingStatus, setProcessed, setError } = useStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const processImage = useCallback(async (imageId: string, imageUrl: string) => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    try {
      setProcessingStatus(imageId, true);
      
      // Load image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Process image
      const processedImageUrl = await removeBackground(img, canvasRef.current);
      setProcessed(imageId, processedImageUrl);
    } catch (error) {
      setError(imageId, error instanceof Error ? error.message : 'Failed to process image');
    } finally {
      setProcessingStatus(imageId, false);
    }
  }, [setProcessingStatus, setProcessed, setError]);

  return { processImage };
}