import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

const EditorSettingsContext = createContext(null);

export const useEditorSettings = () => {
  const context = useContext(EditorSettingsContext);
  if (!context) {
    throw new Error('useEditorSettings must be used within EditorSettingsProvider');
  }
  return context;
};

const DEFAULT_SETTINGS = {
  theme: 'vs-dark',
  fontSize: 14,
  fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Courier New', monospace",
  fontLigatures: true,
  minimap: true,
  wordWrap: 'on',
  lineNumbers: 'on',
  tabSize: 2,
  autoSave: true,
  autoSaveDelay: 1000,
  cursorStyle: 'line',
  cursorBlinking: 'smooth',
  renderWhitespace: 'selection',
  scrollBeyondLastLine: false,
  formatOnPaste: true,
  formatOnType: false
};

const AVAILABLE_THEMES = [
  { value: 'vs-dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'hc-black', label: 'High Contrast Dark' },
  { value: 'hc-light', label: 'High Contrast Light' }
];

const AVAILABLE_FONTS = [
  "'Fira Code', monospace",
  "'Monaco', monospace",
  "'Menlo', monospace",
  "'Consolas', monospace",
  "'Courier New', monospace",
  "'Source Code Pro', monospace",
  "'JetBrains Mono', monospace"
];

export const EditorSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const savedSettings = localStorage.getItem('editorSettings');
    if (savedSettings) {
      try {
        setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
      } catch (e) {
        console.error('Failed to load editor settings');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('editorSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const getMonacoOptions = () => ({
    fontSize: settings.fontSize,
    fontFamily: settings.fontFamily,
    fontLigatures: settings.fontLigatures,
    minimap: { enabled: settings.minimap },
    wordWrap: settings.wordWrap,
    lineNumbers: settings.lineNumbers,
    tabSize: settings.tabSize,
    cursorStyle: settings.cursorStyle,
    cursorBlinking: settings.cursorBlinking,
    renderWhitespace: settings.renderWhitespace,
    scrollBeyondLastLine: settings.scrollBeyondLastLine,
    formatOnPaste: settings.formatOnPaste,
    formatOnType: settings.formatOnType,
    automaticLayout: true,
    smoothScrolling: true,
    scrollbar: {
      useShadows: false,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10
    }
  });

  const value = {
    settings,
    updateSetting,
    resetSettings,
    getMonacoOptions,
    AVAILABLE_THEMES,
    AVAILABLE_FONTS
  };

  return (
    <EditorSettingsContext.Provider value={value}>
      {children}
    </EditorSettingsContext.Provider>
  );
};
