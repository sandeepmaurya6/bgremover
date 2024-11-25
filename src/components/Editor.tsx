import React, { useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';

export function Editor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentImage, images, editorState } = useStore();
  
  const currentImageData = currentImage 
    ? images.find(img => img.id === currentImage)
    : null;

  useEffect(() => {
    if (!canvasRef.current || !currentImageData?.processed) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = currentImageData.processed;
  }, [currentImageData?.processed]);

  if (!currentImageData?.processed) return null;

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-900 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full"
      />
    </div>
  );
}