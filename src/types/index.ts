export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  processed?: string;
  isProcessing: boolean;
  error?: string;
}

export interface EditorState {
  brushSize: number;
  isEraser: boolean;
  history: string[];
  currentStep: number;
}

export interface ProcessingOptions {
  batchProcess: boolean;
  autoDownload: boolean;
}