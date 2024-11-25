import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useImageProcessing } from '../hooks/useImageProcessing';

export function Upload() {
  const { addImages, processingOptions } = useStore();
  const { processImage } = useImageProcessing();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(
      file => file.type === 'image/png' && file.size <= 2048 * 2048
    );
    
    if (validFiles.length) {
      const newImages = validFiles.map(file => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        isProcessing: false,
      }));
      
      addImages(validFiles);

      if (processingOptions.batchProcess) {
        for (const image of newImages) {
          await processImage(image.id, image.preview);
        }
      }
    }
  }, [addImages, processImage, processingOptions.batchProcess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
    },
    maxSize: 2048 * 2048,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 mb-8 text-center cursor-pointer
        transition-colors duration-200
        ${isDragActive ? 'border-blue-500 bg-blue-50/5' : 'border-gray-600 hover:border-gray-500'}
      `}
    >
      <input {...getInputProps()} />
      <UploadIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p className="text-lg mb-2">
        {isDragActive ? 'Drop your PNG images here' : 'Drag & drop PNG images here'}
      </p>
      <p className="text-sm text-gray-400">
        or click to select files (max 2048x2048)
      </p>
    </div>
  );
}