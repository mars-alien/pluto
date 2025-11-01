import React, { useRef, useEffect, useState } from 'react';
import { 
  Pen, 
  Eraser, 
  Square, 
  Circle, 
  Minus, 
  Type, 
  Palette, 
  RotateCcw, 
  Download,
  Trash2,
  Undo,
  Redo,
  Save,
  Upload,
  PaintBucket,
  Triangle,
  Star,
  ArrowRight
} from 'lucide-react';

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const textInputRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(2);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [textValue, setTextValue] = useState('');
  const [fontSize, setFontSize] = useState(20);

  const colors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
    '#ffc0cb', '#a52a2a', '#808080', '#90ee90', '#add8e6'
  ];

  const tools = [
    { id: 'pen', icon: Pen, label: 'Pen (P)' },
    { id: 'eraser', icon: Eraser, label: 'Eraser (E)' },
    { id: 'line', icon: Minus, label: 'Line (L)' },
    { id: 'rectangle', icon: Square, label: 'Rectangle (R)' },
    { id: 'circle', icon: Circle, label: 'Circle (C)' },
    { id: 'triangle', icon: Triangle, label: 'Triangle (T)' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow (A)' },
    { id: 'text', icon: Type, label: 'Text (X)' },
    { id: 'fill', icon: PaintBucket, label: 'Fill (F)' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Set default styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#1f2937'; // Dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state
    saveToHistory();
    
    // Keyboard shortcuts
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      } else {
        switch(e.key.toLowerCase()) {
          case 'p': setTool('pen'); break;
          case 'e': setTool('eraser'); break;
          case 'l': setTool('line'); break;
          case 'r': setTool('rectangle'); break;
          case 'c': setTool('circle'); break;
          case 't': setTool('triangle'); break;
          case 'a': setTool('arrow'); break;
          case 'x': setTool('text'); break;
          case 'f': setTool('fill'); break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = history[historyStep - 1];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      setHistoryStep(historyStep - 1);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = history[historyStep + 1];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      setHistoryStep(historyStep + 1);
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'text') {
      setTextPosition({ x, y });
      setShowTextInput(true);
      return;
    }
    
    if (tool === 'fill') {
      fillArea(x, y);
      return;
    }
    
    setIsDrawing(true);
    setLastPos({ x, y });
    setStartPos({ x, y });
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = tool === 'eraser' ? '#1f2937' : color;
    ctx.fillStyle = color;
    
    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
      setLastPos({ x, y });
    } else {
      // For shapes, we need to redraw from saved state
      // For now, shapes will be drawn on mouse up
    }
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    
    // Draw final shape
    switch (tool) {
      case 'line':
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
        
      case 'rectangle':
        const width = x - startPos.x;
        const height = y - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, width, height);
        break;
        
      case 'circle':
        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
        
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(startPos.x, y);
        ctx.lineTo(x, y);
        ctx.lineTo((startPos.x + x) / 2, startPos.y);
        ctx.closePath();
        ctx.stroke();
        break;
        
      case 'arrow':
        // Draw arrow line
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Draw arrowhead
        const angle = Math.atan2(y - startPos.y, x - startPos.x);
        const headLength = 15;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - headLength * Math.cos(angle - Math.PI / 6), y - headLength * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x, y);
        ctx.lineTo(x - headLength * Math.cos(angle + Math.PI / 6), y - headLength * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        break;
    }
    
    setIsDrawing(false);
    saveToHistory();
  };

  const fillArea = (x, y) => {
    // Simple fill - fill entire canvas with color
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const addText = () => {
    if (!textValue.trim()) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(textValue, textPosition.x, textPosition.y);
    
    setShowTextInput(false);
    setTextValue('');
    saveToHistory();
  };

  const clearCanvas = () => {
    if (!window.confirm('Clear entire canvas?')) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `pluto-drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    localStorage.setItem('pluto_drawing', dataURL);
    alert('Drawing saved to browser storage!');
  };

  const loadDrawing = () => {
    const savedDrawing = localStorage.getItem('pluto_drawing');
    if (!savedDrawing) {
      alert('No saved drawing found!');
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = savedDrawing;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      saveToHistory();
    };
  };

  return (
    <div className="flex h-full bg-gray-800">
      {/* Drawing Toolbar */}
      <div className="w-16 bg-gray-900 flex flex-col items-center py-4 space-y-2">
        {/* Tools */}
        {tools.map((toolItem) => {
          const Icon = toolItem.icon;
          return (
            <button
              key={toolItem.id}
              onClick={() => setTool(toolItem.id)}
              className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${
                tool === toolItem.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
              title={toolItem.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
        
        <div className="w-full h-px bg-gray-700 my-2" />
        
        {/* Actions */}
        <button
          onClick={undo}
          disabled={historyStep <= 0}
          className="w-12 h-12 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors disabled:opacity-30"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-5 h-5" />
        </button>
        
        <button
          onClick={redo}
          disabled={historyStep >= history.length - 1}
          className="w-12 h-12 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors disabled:opacity-30"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-5 h-5" />
        </button>
        
        <button
          onClick={saveDrawing}
          className="w-12 h-12 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors"
          title="Save Drawing"
        >
          <Save className="w-5 h-5" />
        </button>
        
        <button
          onClick={loadDrawing}
          className="w-12 h-12 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors"
          title="Load Drawing"
        >
          <Upload className="w-5 h-5" />
        </button>
        
        <button
          onClick={clearCanvas}
          className="w-12 h-12 flex items-center justify-center rounded-lg text-red-400 hover:text-red-200 hover:bg-red-900 transition-colors"
          title="Clear Canvas"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        
        <button
          onClick={downloadCanvas}
          className="w-12 h-12 flex items-center justify-center rounded-lg text-green-400 hover:text-green-200 hover:bg-green-900 transition-colors"
          title="Download PNG"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-4 space-x-6">
          {/* Color Picker */}
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-gray-400" />
            <div className="flex space-x-1">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded border-2 transition-all ${
                    color === c ? 'border-white scale-110' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
          
          {/* Line Width */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Brush:</span>
            <input
              type="range"
              min="1"
              max="30"
              value={lineWidth}
              onChange={(e) => setLineWidth(e.target.value)}
              className="w-24 accent-blue-600"
            />
            <span className="text-sm text-gray-300 w-8">{lineWidth}px</span>
          </div>
          
          {/* Font Size (for text tool) */}
          {tool === 'text' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Font:</span>
              <input
                type="range"
                min="10"
                max="60"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-24 accent-blue-600"
              />
              <span className="text-sm text-gray-300 w-8">{fontSize}px</span>
            </div>
          )}
          
          {/* Current Tool */}
          <div className="flex-1 flex justify-end items-center space-x-2">
            <span className="text-sm text-gray-400">Tool:</span>
            <span className="text-sm font-medium text-white capitalize">{tool}</span>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-4 overflow-auto">
          <canvas
            ref={canvasRef}
            className="w-full h-full border-2 border-gray-600 rounded-lg cursor-crosshair shadow-2xl"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
        
        {/* Text Input Modal */}
        {showTextInput && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Add Text</h3>
              <input
                ref={textInputRef}
                type="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addText()}
                placeholder="Enter text..."
                className="w-64 px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white mb-4"
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={addText}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  Add Text
                </button>
                <button
                  onClick={() => {
                    setShowTextInput(false);
                    setTextValue('');
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawingCanvas;
