import React from 'react';
import { Trash2, Edit3, Download, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useImageProcessing } from '../hooks/useImageProcessing';

export function ImageGrid() {
  const { images, removeImage, setCurrentImage } = useStore();
  const { processImage } = useImageProcessing();

  if (images.length === 0) {
    return null;
  }

  const handleImageLoad = async (image: { id: string; preview: string }) => {
    if (!image.processed && !image.isProcessing) {
      await processImage(image.id, image.preview);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative group bg-gray-800 rounded-lg overflow-hidden"
          onLoad={() => handleImageLoad(image)}
        >
          <img
            src={image.processed || image.preview}
            alt="Uploaded"
            className="w-full aspect-video object-cover"
          />
          
          {image.isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          )}

          {image.error && (
            <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center p-4">
              <p className="text-white text-center">{image.error}</p>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex justify-end gap-2">
              {image.processed && (
                <>
                  <button
                    onClick={() => setCurrentImage(image.id)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <a
                    href={image.processed}
                    download={`processed-${image.file.name}`}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </>
              )}
              <button
                onClick={() => removeImage(image.id)}
                className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-colors"
                title="Remove"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}