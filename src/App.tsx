import React from 'react';
import { Upload, ImageGrid, Editor, Toolbar } from './components';
import { useStore } from './store/useStore';

function App() {
  const currentImage = useStore((state) => state.currentImage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="p-6 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-center">Background Removal App</h1>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {!currentImage ? (
          <>
            <Upload />
            <ImageGrid />
          </>
        ) : (
          <div className="space-y-4">
            <Toolbar />
            <Editor />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;