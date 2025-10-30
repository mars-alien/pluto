import { useState } from 'react';
import { useEditorSettings } from '../../context/EditorSettingsContext';

export default function EditorSettings({ isOpen, onClose }) {
  const { settings, updateSetting, resetSettings, AVAILABLE_THEMES, AVAILABLE_FONTS } = useEditorSettings();
  const [activeTab, setActiveTab] = useState('appearance');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Editor Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-700">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'appearance'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'editor'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('editor')}
          >
            Editor
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'behavior'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('behavior')}
          >
            Behavior
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'appearance' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSetting('theme', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {AVAILABLE_THEMES.map(theme => (
                    <option key={theme.value} value={theme.value}>{theme.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Font Size: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Font Family</label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => updateSetting('fontFamily', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {AVAILABLE_FONTS.map(font => (
                    <option key={font} value={font}>{font.split(',')[0].replace(/'/g, '')}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Font Ligatures</label>
                <button
                  onClick={() => updateSetting('fontLigatures', !settings.fontLigatures)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.fontLigatures ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.fontLigatures ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </>
          )}

          {activeTab === 'editor' && (
            <>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Show Minimap</label>
                <button
                  onClick={() => updateSetting('minimap', !settings.minimap)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.minimap ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.minimap ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Word Wrap</label>
                <select
                  value={settings.wordWrap}
                  onChange={(e) => updateSetting('wordWrap', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="off">Off</option>
                  <option value="on">On</option>
                  <option value="wordWrapColumn">Word Wrap Column</option>
                  <option value="bounded">Bounded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Line Numbers</label>
                <select
                  value={settings.lineNumbers}
                  onChange={(e) => updateSetting('lineNumbers', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="on">On</option>
                  <option value="off">Off</option>
                  <option value="relative">Relative</option>
                  <option value="interval">Interval</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tab Size: {settings.tabSize}
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="2"
                  value={settings.tabSize}
                  onChange={(e) => updateSetting('tabSize', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cursor Style</label>
                <select
                  value={settings.cursorStyle}
                  onChange={(e) => updateSetting('cursorStyle', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="line">Line</option>
                  <option value="block">Block</option>
                  <option value="underline">Underline</option>
                  <option value="line-thin">Line Thin</option>
                  <option value="block-outline">Block Outline</option>
                  <option value="underline-thin">Underline Thin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cursor Blinking</label>
                <select
                  value={settings.cursorBlinking}
                  onChange={(e) => updateSetting('cursorBlinking', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="blink">Blink</option>
                  <option value="smooth">Smooth</option>
                  <option value="phase">Phase</option>
                  <option value="expand">Expand</option>
                  <option value="solid">Solid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Render Whitespace</label>
                <select
                  value={settings.renderWhitespace}
                  onChange={(e) => updateSetting('renderWhitespace', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="none">None</option>
                  <option value="boundary">Boundary</option>
                  <option value="selection">Selection</option>
                  <option value="all">All</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'behavior' && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">Auto Save</label>
                  <p className="text-xs text-gray-500 mt-1">Automatically save files after editing</p>
                </div>
                <button
                  onClick={() => updateSetting('autoSave', !settings.autoSave)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoSave ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {settings.autoSave && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Auto Save Delay: {settings.autoSaveDelay}ms
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="500"
                    value={settings.autoSaveDelay}
                    onChange={(e) => updateSetting('autoSaveDelay', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Format on Paste</label>
                <button
                  onClick={() => updateSetting('formatOnPaste', !settings.formatOnPaste)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.formatOnPaste ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.formatOnPaste ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Format on Type</label>
                <button
                  onClick={() => updateSetting('formatOnType', !settings.formatOnType)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.formatOnType ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.formatOnType ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Scroll Beyond Last Line</label>
                <button
                  onClick={() => updateSetting('scrollBeyondLastLine', !settings.scrollBeyondLastLine)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.scrollBeyondLastLine ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.scrollBeyondLastLine ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-700 flex justify-between">
          <button
            onClick={resetSettings}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
