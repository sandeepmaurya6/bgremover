import React from 'react';
import { Eraser, Paintbrush, Undo, Redo, Save, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Toolbar() {
  const { editorState, updateEditorState, setCurrentImage } = useStore();
  const { brushSize, isEraser } = editorState;

  return (
    <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center gap-4">
        <button
          onClick={() => updateEditorState({ isEraser: false })}
          className={`p-2 rounded ${
            !isEraser ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          title="Brush"
        >
          <Paintbrush className="w-5 h-5" />
        </button>
        <button
          onClick={() => updateEditorState({ isEraser: true })}
          className={`p-2 rounded ${
            isEraser ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          title="Eraser"
        >
          <Eraser className="w-5 h-5" />
        </button>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => updateEditorState({ brushSize: +e.target.value })}
          className="w-32"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded bg-gray-700 hover:bg-gray-600"
          title="Undo"
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          className="p-2 rounded bg-gray-700 hover:bg-gray-600"
          title="Redo"
        >
          <Redo className="w-5 h-5" />
        </button>
        <button
          className="p-2 rounded bg-green-600 hover:bg-green-500"
          title="Save"
        >
          <Save className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentImage(null)}
          className="p-2 rounded bg-gray-700 hover:bg-gray-600"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}