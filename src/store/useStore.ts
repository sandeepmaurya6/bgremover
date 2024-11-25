import { create } from 'zustand';
import { ImageFile, ProcessingOptions, EditorState } from '../types';

interface AppState {
  images: ImageFile[];
  currentImage: string | null;
  processingOptions: ProcessingOptions;
  editorState: EditorState;
  addImages: (files: File[]) => void;
  removeImage: (id: string) => void;
  setProcessed: (id: string, processedUrl: string) => void;
  setProcessingStatus: (id: string, status: boolean) => void;
  setError: (id: string, error: string) => void;
  setCurrentImage: (id: string | null) => void;
  updateEditorState: (state: Partial<EditorState>) => void;
  updateProcessingOptions: (options: Partial<ProcessingOptions>) => void;
}

export const useStore = create<AppState>((set) => ({
  images: [],
  currentImage: null,
  processingOptions: {
    batchProcess: false,
    autoDownload: true,
  },
  editorState: {
    brushSize: 20,
    isEraser: false,
    history: [],
    currentStep: -1,
  },
  addImages: (files) =>
    set((state) => ({
      images: [
        ...state.images,
        ...files.map((file) => ({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          isProcessing: false,
        })),
      ],
    })),
  removeImage: (id) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
      currentImage: state.currentImage === id ? null : state.currentImage,
    })),
  setProcessed: (id, processedUrl) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, processed: processedUrl } : img
      ),
    })),
  setProcessingStatus: (id, status) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, isProcessing: status } : img
      ),
    })),
  setError: (id, error) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, error } : img
      ),
    })),
  setCurrentImage: (id) => set({ currentImage: id }),
  updateEditorState: (newState) =>
    set((state) => ({
      editorState: { ...state.editorState, ...newState },
    })),
  updateProcessingOptions: (options) =>
    set((state) => ({
      processingOptions: { ...state.processingOptions, ...options },
    })),
}));